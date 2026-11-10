import { getList } from '../../../../../libs/notionCache';
import { isNotionId, isPublishedArticlePage, normalizeNotionId } from '../../../../../libs/notion';
import { verifyImageBlockId } from '../../../../../libs/imageSignature';

export const runtime = 'edge';

const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

/**
 * Notion の署名付き画像URLは有効期限が1時間しかない。
 *
 * 記事HTMLは CDN で `s-maxage=3600, stale-while-revalidate=86400` としてキャッシュ
 * されるため、キャッシュされたHTMLに埋まった署名付きURLは確実に失効し、
 * 最大24時間にわたって画像が404になっていた。
 *
 * そこで本文には「失効しない自前のURL」を埋め、ここで毎回 Notion に
 * 最新の署名付きURLを問い合わせてリダイレクトする。
 *
 * 画像の実体は S3 から直接ブラウザへ流れるので、Worker を通る帯域は増えない。
 * リダイレクト自体は署名の寿命より十分短い時間だけキャッシュする。
 */
const REDIRECT_TTL_SECONDS = 1800; // 30分。署名の寿命(1時間)の半分に留める

/**
 * 画像ブロックからページまでの親をたどる上限。
 * toggle / callout / column_list > column の中など、入れ子は実際には2〜3段。
 * 余裕を持たせつつ、でたらめな入力で Notion を叩き続けないように切る。
 */
const MAX_PARENT_HOPS = 6;

function extractImageUrl(block: any): string | null {
  const image = block?.image;
  if (!image) return null;
  if (image.type === 'external') return image.external?.url ?? null;
  return image.file?.url ?? null;
}

class UpstreamError extends Error {}

/** 4xx（存在しない・共有されていない）は null、5xx や通信失敗は UpstreamError */
async function notionGet(path: string): Promise<any | null> {
  const res = await fetch(`${NOTION_API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': NOTION_VERSION,
    },
  });
  if (res.ok) return res.json();
  if (res.status >= 500 || res.status === 429) throw new UpstreamError(`Notion API error: ${res.status}`);
  return null;
}

/** ブロックが載っているページの ID。親をたどりきれなければ null */
async function findPageId(block: any): Promise<string | null> {
  let parent = block?.parent;
  for (let hop = 0; parent?.type === 'block_id'; hop++) {
    if (hop >= MAX_PARENT_HOPS || !isNotionId(String(parent.block_id))) return null;
    const parentBlock = await notionGet(`/blocks/${parent.block_id}`);
    if (!parentBlock) return null;
    parent = parentBlock.parent;
  }
  return parent?.type === 'page_id' && isNotionId(String(parent.page_id)) ? String(parent.page_id) : null;
}

/**
 * そのページが公開中の記事か。
 *
 * まずキャッシュ済みの記事一覧（Published だけ、notionCache で5分）から探す。
 * 公開記事の画像ならほぼここで決まり、Notion への往復は増えない。
 * 一覧に無いときだけページを直接引いて確かめる。公開した直後で一覧のキャッシュが
 * まだ古い記事を 404 にしないため。
 */
async function isPublishedArticle(pageId: string): Promise<boolean> {
  const wanted = normalizeNotionId(pageId);
  try {
    const { contents } = await getList();
    if (contents.some((post) => post.pageId && normalizeNotionId(post.pageId) === wanted)) return true;
  } catch {
    // 一覧が取れなくても、下で直接確かめる
  }
  const page = await notionGet(`/pages/${pageId}`);
  return isPublishedArticlePage(page);
}

const notFound = () => new Response('Not found', { status: 404 });

export async function GET(request: Request, { params }: { params: Promise<{ blockId: string }> }) {
  const { blockId } = await params;

  // ブロックIDはUUID。想定外の値でNotionへリクエストを飛ばさない
  if (!isNotionId(blockId)) {
    return new Response('Invalid block id', { status: 400 });
  }

  // 本文を組み立てたときに付けた署名を確かめる。合わなければ Notion に問い合わせない。
  // でたらめな UUID の連打で Notion API の枠を使い切られないようにするため（#570）
  if (!(await verifyImageBlockId(blockId, new URL(request.url).searchParams.get('s')))) {
    return notFound();
  }

  try {
    const block = await notionGet(`/blocks/${blockId}`);
    if (!block) return notFound();

    const url = extractImageUrl(block);
    if (!url) return notFound();

    // インテグレーションが読めるブロックなら何でも署名付きURLを返せてしまうので、
    // 公開中の記事の本文にある画像だけに絞る。Draft の記事や記事DB以外のページの
    // 画像は、存在しない場合と区別せず 404 にする。
    const pageId = await findPageId(block);
    if (!pageId || !(await isPublishedArticle(pageId))) return notFound();

    return new Response(null, {
      status: 302,
      headers: {
        Location: url,
        'Cache-Control': `public, max-age=${REDIRECT_TTL_SECONDS}, s-maxage=${REDIRECT_TTL_SECONDS}`,
      },
    });
  } catch {
    return new Response('Upstream error', { status: 502 });
  }
}

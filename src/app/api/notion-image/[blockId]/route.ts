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

function extractImageUrl(block: any): string | null {
  const image = block?.image;
  if (!image) return null;
  if (image.type === 'external') return image.external?.url ?? null;
  return image.file?.url ?? null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ blockId: string }> }) {
  const { blockId } = await params;

  // ブロックIDはUUID。想定外の値でNotionへリクエストを飛ばさない
  if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(blockId)) {
    return new Response('Invalid block id', { status: 400 });
  }

  try {
    const res = await fetch(`${NOTION_API_BASE}/blocks/${blockId}`, {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        'Notion-Version': NOTION_VERSION,
      },
    });
    if (!res.ok) return new Response('Not found', { status: 404 });

    const url = extractImageUrl(await res.json());
    if (!url) return new Response('Not an image block', { status: 404 });

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

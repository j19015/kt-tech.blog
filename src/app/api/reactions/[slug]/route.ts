import { getOptionalRequestContext } from '@cloudflare/next-on-pages';
import { getDetail, getList } from '../../../../../libs/notionCache';
import { isNotionId, normalizeNotionId } from '../../../../../libs/notion';

export const runtime = 'edge';

/**
 * 記事の「参考になった」の件数（Issue #455）。
 *
 * 記事の HTML は CDN に7日キャッシュしたままにし、件数だけをクライアントから取りに来る。
 * 件数は D1（バインディング `DB`）に1記事1行で持つ。
 *
 * バインディングが無い環境（ローカルで wrangler.dev.toml を通していない、
 * プレビューにバインドしていない）では 503 を返す。UI はそれを見てボタンを引っ込める。
 */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** Turnstile のトークンは最大 2048 文字（公式の仕様） */
const MAX_TOKEN_LENGTH = 2048;

/**
 * 件数のキャッシュ。押した本人の画面はレスポンスの件数で更新するので、
 * ほかの読者に1分遅れて見えるぶんには困らない。
 *
 * `/api/` は CDN の Cache Rule の対象外で、`s-maxage` を返しても CDN には載って
 * いなかった（本番で cf-cache-status: DYNAMIC。#570）。そこで Worker の中で
 * Cache API（colo ごと）に持つ。D1 の読み取りはこれで1分に1回まで減る。
 */
const COUNT_TTL_SECONDS = 60;
const GET_CACHE_CONTROL = `public, max-age=0, s-maxage=${COUNT_TTL_SECONDS}`;

function countCache(): Cache | null {
  const store = (globalThis as any).caches?.default;
  return store && typeof store.match === 'function' ? store : null;
}

/** キャッシュのキー。外から届く URL とは別にして、クエリ付きの URL でキャッシュを外されないようにする */
const countCacheKey = (slug: string) =>
  new Request(`https://reactions-cache.kt-tech.blog/v1/${encodeURIComponent(slug)}`);

async function putCount(slug: string, count: number): Promise<void> {
  try {
    await countCache()?.put(countCacheKey(slug), json({ count }, 200, `public, max-age=${COUNT_TTL_SECONDS}`));
  } catch {
    // 書けなくても件数は返せる
  }
}

const json = (body: unknown, status = 200, cacheControl = 'no-store') =>
  Response.json(body, { status, headers: { 'Cache-Control': cacheControl } });

/**
 * URL の形として明らかにおかしいものは D1 にも Notion にも渡さない。
 * slug は英数字とハイフンが大半だが、日本語の slug も弾かないよう緩めにしてある。
 */
function isPlausibleSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= 200 && !/[\s/?#\\]/.test(slug);
}

function getEnv(): CloudflareEnv | undefined {
  // next dev で setupDevPlatform を通していない、next build の解析中などは undefined になる
  return getOptionalRequestContext()?.env;
}

/**
 * POST を受け付けてよい Origin か。
 *
 * 本番は SITE_URL と一致するものだけ。開発中（next dev）は localhost も通す。
 * `wrangler pages dev`（npm run preview）は本番ビルドなので localhost は通らない。
 */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  try {
    if (process.env.SITE_URL && new URL(process.env.SITE_URL).origin === origin) return true;
  } catch {
    // SITE_URL が壊れていたら、下の開発時の判定だけになる
  }
  if (process.env.NODE_ENV !== 'production') {
    try {
      const { hostname } = new URL(origin);
      return hostname === 'localhost' || hostname === '127.0.0.1';
    } catch {
      return false;
    }
  }
  return false;
}

async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  try {
    const res = await fetch(SITEVERIFY_URL, { method: 'POST', body: form });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean; hostname?: string };
    if (data.success !== true) return false;
    // 自サイトで発行されたトークンかも確かめる（Cloudflare の推奨）。
    // ウィジェットの許可ドメインを広げたときに、別ホストのトークンを通さないため。
    // 開発中は Turnstile のテスト用キーが hostname を "example.com" で返すので照合しない
    if (process.env.NODE_ENV !== 'production') return true;
    const expected = process.env.SITE_URL ? new URL(process.env.SITE_URL).hostname : null;
    return expected !== null && data.hostname === expected;
  } catch {
    return false;
  }
}

/**
 * slug が公開中の記事なら、その記事の正式な ID（Blog.id）を返す。無ければ null。
 *
 * 同じ記事に `/blogs/{slug}` と `/blogs/{page-id}` の2通りで届くので、
 * D1 のキーは Blog.id に揃える。揃えないと件数が2行に割れる。
 *
 * まずキャッシュ済みの一覧（Published のみ）から探す。公開直後で一覧が古いときに
 * 404 にしないよう、無ければ記事を直接引いて確かめる（/api/notion-image と同じ考え方）。
 * 存在しない slug は notionCache 側が「無い」ことをキャッシュするので、
 * 同じ slug で連打されても Notion は叩かれ続けない。
 */
async function resolveArticleId(slug: string): Promise<string | null> {
  try {
    const { contents } = await getList();
    const wanted = isNotionId(slug) ? normalizeNotionId(slug) : null;
    const hit = contents.find(
      (post) => post.id === slug || (wanted !== null && !!post.pageId && normalizeNotionId(post.pageId) === wanted)
    );
    if (hit) return hit.id;
  } catch {
    // 一覧が取れなくても、下で直接確かめる
  }
  try {
    return (await getDetail(slug)).id;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.startsWith('Blog not found: ')) return null;
    throw error;
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isPlausibleSlug(slug)) return json({ error: 'invalid slug' }, 400);

  const db = getEnv()?.DB;
  if (!db) return json({ error: 'unavailable' }, 503);

  try {
    const hit = await countCache()?.match(countCacheKey(slug));
    if (hit) return json(await hit.json(), 200, GET_CACHE_CONTROL);
  } catch {
    // キャッシュが読めなければ D1 から取る
  }

  try {
    const row = await db.prepare('SELECT count FROM reactions WHERE slug = ?').bind(slug).first<{ count: number }>();
    const count = row?.count ?? 0;
    await putCount(slug, count);
    return json({ count }, 200, GET_CACHE_CONTROL);
  } catch (error) {
    console.error(`[reactions] 件数の取得に失敗: ${error}`);
    return json({ error: 'database error' }, 500);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  // 他サイトから押させない。ブラウザは Origin を偽れないので、まずここで落とす
  if (!isAllowedOrigin(request.headers.get('Origin'))) return json({ error: 'forbidden' }, 403);

  const { slug } = await params;
  if (!isPlausibleSlug(slug)) return json({ error: 'invalid slug' }, 400);

  const env = getEnv();
  const db = env?.DB;
  const secret = env?.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY;
  if (!db || !secret) return json({ error: 'unavailable' }, 503);

  let token: unknown;
  try {
    token = ((await request.json()) as { token?: unknown })?.token;
  } catch {
    return json({ error: 'invalid body' }, 400);
  }
  if (typeof token !== 'string' || token.length === 0 || token.length > MAX_TOKEN_LENGTH) {
    return json({ error: 'invalid token' }, 400);
  }

  // Notion を引く前に人間かどうかを確かめる。bot に Notion の往復を使わせない
  if (!(await verifyTurnstile(secret, token, request.headers.get('CF-Connecting-IP')))) {
    return json({ error: 'verification failed' }, 403);
  }

  let articleId: string | null;
  try {
    articleId = await resolveArticleId(slug);
  } catch {
    return json({ error: 'upstream error' }, 502);
  }
  // 存在しない slug の行を作らせない
  if (!articleId) return json({ error: 'not found' }, 404);

  try {
    const row = await db
      .prepare(
        `INSERT INTO reactions (slug, count, updated_at) VALUES (?, 1, ?)
         ON CONFLICT(slug) DO UPDATE SET count = count + 1, updated_at = excluded.updated_at
         RETURNING count`
      )
      .bind(articleId, new Date().toISOString())
      .first<{ count: number }>();
    const count = row?.count ?? 1;
    // 押した直後に読み直した人が古い件数を見ないよう、キャッシュも新しい件数にする
    await putCount(articleId, count);
    return json({ count });
  } catch (error) {
    console.error(`[reactions] 件数の更新に失敗: ${error}`);
    return json({ error: 'database error' }, 500);
  }
}

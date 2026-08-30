/**
 * Notion への往復を「鮮度の期限ごとに1回」まで減らすキャッシュ層。
 *
 * ## なぜ要るのか
 *
 * このブログは全ルートが `runtime = 'edge'` で、ページを描くたびに Notion を叩く。
 * Cloudflare Pages では ISR が使えないので、鮮度は CDN の `s-maxage` に任せている。
 * つまり **CDN のキャッシュを外したリクエストは、必ず Notion への往復になる**。
 *
 * Notion の公開APIは平均3リクエスト/秒で絞られる。記事1本の描画は
 * 「DB検索 + 本文ブロックの取得（入れ子があればその数だけ追加）」で
 * 実測 5 往復かかる（本文に toggle / callout / quote / table が多い記事はもっと増える）。
 * クローラが sitemap の URL を並べて取りに来ると、この 5 往復が同時に何本も走り、
 * 数秒で上限に触れて 429 が返る。`libs/notion.ts` はそれをそのまま throw するので
 * ページが 500 になる。
 *
 * リトライ（`libs/notion.ts` 側の対応）は「踏んでしまった 429 から復帰する」話で、
 * こちらは「そもそも踏まない」ための対応。両方要る。
 *
 * ## 三層
 *
 * 1. React `cache()` — 同一リクエスト内。既に `libs/notion.ts` にあるが、
 *    こちらにも掛けて「キャッシュの参照そのもの」を1回に抑える。
 *    なお `cache()` は RSC のレンダリング中しか効かない。Route Handler や
 *    `sitemap.ts` のような metadata route では素通しになる（実測で確認済み）。
 * 2. isolate 内のメモリ — Cloudflare Workers の isolate は複数リクエストで
 *    再利用されるので、同じ isolate に当たった後続リクエストは 0 往復になる。
 * 3. Cloudflare Cache API（`caches.default`）— 同じ colo の全 isolate で共有する。
 *    KV と違ってバインディングも認証も要らず、コードを置くだけで効く。
 *
 * ## 鮮度と stale
 *
 * 各エントリは `FRESH_MS` を過ぎると stale になり、次のリクエストが Notion を引き直す。
 * 引き直しに失敗した場合（429 など）は `STALE_MS` の範囲で古い値を返す。
 * 「少し古い記事一覧」は「500」より確実に良い。
 *
 * Notion で記事を直してからサイトに出るまでの遅れは、この層で最大 `FRESH_MS`、
 * その上に CDN の `s-maxage` が乗る。合計しても十数分で、既存の運用と変わらない。
 */
import { cache } from 'react';
import {
  getList as loadList,
  getDetail as loadDetail,
  getTagList as loadTagList,
  getCategoryList as loadCategoryList,
  type Blog,
  type Tag,
  type Category,
} from './notion';

export type { Blog, Tag, Category, Series, ChangelogEntry, BlogProps } from './notion';
// リトライ待ちの上限。feed.xml / sitemap.xml が使う。import 元を1つに保つため再輸出する
export { BOT_RETRY_WAIT_MS } from './notion';

type ListResult = { contents: Blog[]; totalCount: number; offset: number; limit: number };
type NameList<T> = { contents: T[]; totalCount: number; offset: number; limit: number };

/** 記事一覧。新着の反映が遅れると一番目立つので短くする（トップの s-maxage と同じ） */
const LIST_FRESH_MS = 5 * 60 * 1000;
/** タグ・カテゴリの選択肢。記事より遥かに変わらない */
const SCHEMA_FRESH_MS = 30 * 60 * 1000;
/** 記事本文。往復数が一番多いのでここを長めに持つ */
const DETAIL_FRESH_MS = 15 * 60 * 1000;
/** 存在しない slug。クローラが古いURLを舐めても Notion を叩かせない */
const NOT_FOUND_FRESH_MS = 5 * 60 * 1000;

/** fresh を過ぎた値を「取得に失敗したときの代役」として使い続ける上限 */
const STALE_MS = 24 * 60 * 60 * 1000;

/** isolate に貯める最大件数。記事が増えてもメモリが膨らみ続けないように */
const MEMO_MAX_ENTRIES = 64;

/**
 * 引き直しに失敗したあと、次に試すまで待つ時間。
 *
 * これが無いと、Notion が絞っている間は**リクエストのたびに**引き直しに行く。
 * `libs/notion.ts` のリトライは3回まで粘るので、1リクエストにつき
 * Notion を3回叩いて数秒待ち、結局 stale を返す、というのを延々繰り返すことになる。
 * 絞られている相手を余計に叩いて、こちらも遅くなるという最悪の組み合わせになる。
 *
 * 代役（stale）を持っている間はそれを即座に返し、30秒に1回だけ様子を見に行く。
 * Notion の Retry-After が 25〜30秒を返してくることに合わせてある。
 */
const FAILURE_COOLDOWN_MS = 30 * 1000;

/**
 * Cache API のキーに使うホスト。
 *
 * 実在しないサブドメインにしてあるのは、外から到達させないため。
 * `kt-tech.blog/...` を鍵にすると、その URL を直接叩いた人にキャッシュの中身が
 * そのまま返りうる（中身は公開済みの記事データなので秘密ではないが、
 * 意図しない JSON エンドポイントを生やすことになる）。
 */
const CACHE_ORIGIN = (() => {
  try {
    return `https://notion-cache.${new URL(process.env.SITE_URL || 'https://kt-tech.blog').hostname}`;
  } catch {
    return 'https://notion-cache.kt-tech.blog';
  }
})();

/** 中身の形を変えたときはここを上げる。古いエントリを読まずに済む */
const CACHE_VERSION = 'v1';

type Envelope<T> = { storedAt: number; notFound?: true; value?: T };

// ---------------------------------------------------------------- 層2: メモリ

const memo = new Map<string, Envelope<unknown>>();

function memoGet<T>(key: string): Envelope<T> | undefined {
  return memo.get(key) as Envelope<T> | undefined;
}

function memoSet<T>(key: string, entry: Envelope<T>) {
  // Map は挿入順を保つので、先頭が一番古い
  if (!memo.has(key) && memo.size >= MEMO_MAX_ENTRIES) {
    const oldest = memo.keys().next();
    if (!oldest.done) memo.delete(oldest.value);
  }
  memo.set(key, entry as Envelope<unknown>);
}

// -------------------------------------------------------- 層3: Cache API

/**
 * `caches.default` は Cloudflare Workers（= 本番と `wrangler pages dev`）にしか無い。
 * `next build` の静的解析や `next dev` の Node 側では undefined なので、
 * 触る前に必ず確認する。無ければメモリ層だけで動く。
 */
function edgeCache(): { match(req: Request): Promise<Response | undefined>; put(req: Request, res: Response): Promise<void> } | null {
  const store = (globalThis as any).caches?.default;
  return store && typeof store.match === 'function' ? store : null;
}

function cacheRequest(key: string): Request {
  return new Request(`${CACHE_ORIGIN}/${CACHE_VERSION}/${encodeURIComponent(key)}`);
}

async function edgeGet<T>(key: string): Promise<Envelope<T> | undefined> {
  const store = edgeCache();
  if (!store) return undefined;
  try {
    const hit = await store.match(cacheRequest(key));
    if (!hit) return undefined;
    return (await hit.json()) as Envelope<T>;
  } catch {
    // キャッシュが壊れていても本題ではない。素通しして取り直す
    return undefined;
  }
}

/**
 * Cache API への書き込みが落ちたことを一度だけ報せる。
 *
 * 黙って握り潰すと「メモリ層だけで動いていて colo 内で共有できていない」状態に
 * 気付けない。呼び出し回数は減っているように見えるので、余計に気付きにくい。
 * `wrangler tail` に1行出しておけば確かめられる。
 */
let putFailureReported = false;

async function edgePut<T>(key: string, entry: Envelope<T>): Promise<void> {
  const store = edgeCache();
  if (!store) return;
  try {
    await store.put(
      cacheRequest(key),
      new Response(JSON.stringify(entry), {
        headers: {
          'Content-Type': 'application/json',
          // 鮮度の判定は storedAt で自前に行う。Cache API 側の寿命は
          // 「stale として使える上限」に合わせて長めに持たせる。
          // ここを FRESH に合わせると、期限切れで消えた瞬間に
          // 代役が無くなり、429 のときに 500 へ戻ってしまう。
          'Cache-Control': `public, max-age=${Math.floor(STALE_MS / 1000)}`,
        },
      })
    );
  } catch (error) {
    // 書けなくても描画は続けられる（メモリ層だけになる）
    if (!putFailureReported) {
      putFailureReported = true;
      console.warn(`[notion-cache] Cache API へ書き込めない。メモリ層のみで動作する: ${error}`);
    }
  }
}

// ------------------------------------------------------------ 取得の本体

/** 同じ isolate 内で同じキーの取得が重ならないようにする */
const inflight = new Map<string, Promise<unknown>>();

/** キーごとの「次に引き直してよい時刻」。直前の取得が失敗したときだけ入る */
const cooldownUntil = new Map<string, number>();

class NotFoundError extends Error {}

/**
 * `loader` の結果をキャッシュする。
 *
 * - fresh なら 0 往復で返す
 * - stale なら引き直す。失敗したら stale をそのまま返す（500 にしない）
 * - `notFoundMessagePrefix` が渡されていて、その文言で失敗したときは
 *   「無い」ことをキャッシュする。存在しない URL への連打で Notion を消費しない
 *
 * `loader` には「stale の代役を持っているか」を渡す。
 * 代役があるならリトライで粘る意味が薄いので、呼び出し側はそれを見て
 * 待ち時間の上限を短く切る（下の `getList` などを参照）。
 */
async function withCache<T>(
  key: string,
  freshMs: number,
  loader: (hasStaleFallback: boolean) => Promise<T>,
  notFoundMessagePrefix?: string
): Promise<T> {
  const now = Date.now();

  let entry = memoGet<T>(key);
  if (!entry) {
    entry = await edgeGet<T>(key);
    if (entry) memoSet(key, entry);
  }

  if (entry) {
    const age = now - entry.storedAt;
    const usableFor = entry.notFound ? NOT_FOUND_FRESH_MS : freshMs;
    if (age < usableFor) {
      if (entry.notFound) throw new NotFoundError(`${notFoundMessagePrefix ?? 'Not found'}${key}`);
      return entry.value as T;
    }
    // 期限は切れているが、直前の引き直しが失敗したばかりなら、
    // 少し落ち着くまでは古い値をそのまま返す。Notion を叩き直さないぶん速い
    if (!entry.notFound && age < STALE_MS && (cooldownUntil.get(key) ?? 0) > now) {
      return entry.value as T;
    }
  }

  const running = inflight.get(key);
  if (running) return running as Promise<T>;

  const hasStaleFallback = !!(entry && !entry.notFound && now - entry.storedAt < STALE_MS);

  const task = (async () => {
    try {
      const value = await loader(hasStaleFallback);
      const fresh: Envelope<T> = { storedAt: Date.now(), value };
      memoSet(key, fresh);
      await edgePut(key, fresh);
      cooldownUntil.delete(key);
      return value;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (notFoundMessagePrefix && message.startsWith(notFoundMessagePrefix)) {
        const miss: Envelope<T> = { storedAt: Date.now(), notFound: true };
        memoSet(key, miss);
        await edgePut(key, miss);
        throw new NotFoundError(message);
      }
      // 取得に失敗したが古い値があるなら、それを返して 500 を避ける。
      // 429 で一覧が丸ごと消えるより、5分前の一覧を出すほうが良い。
      if (entry && !entry.notFound && Date.now() - entry.storedAt < STALE_MS) {
        cooldownUntil.set(key, Date.now() + FAILURE_COOLDOWN_MS);
        console.warn(`[notion-cache] ${key} の取得に失敗したので stale を返す: ${message}`);
        return entry.value as T;
      }
      throw error;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, task);
  return task;
}

// ------------------------------------------------------------- 公開API
// 名前・引数・戻り値は libs/notion.ts と同じ。呼び出し側は import 元を差し替えるだけでよい。
//
// `retryWaitCapMs` は `libs/notion.ts` 側のリトライ待ちの上限で、
// feed.xml / sitemap.xml だけが `BOT_RETRY_WAIT_MS`（20秒 × 最大2回待ち）を渡してくる。
//
// **キャッシュのキーには含めない。** 含めると「人向けの一覧」と
// 「クローラ向けの一覧」が別エントリになり、同じものを2回持つことになる。
// 値は誰が引いても同じで、違うのは「取れなかったときどれだけ粘るか」だけ。
//
// **stale の代役があるときは、その長い待ちを渡さない。**
// 渡すと「40秒粘って諦めてから stale を返す」ことになり、
// 手元にある正しい答えを40秒間そのために寝かせることになる。
// 実測でも feed.xml が1リクエスト約40秒かかった。粘る価値があるのは
// 「代役が無く、失敗したら本当に何も出せない」ときだけなので、そこだけ長く待つ。
// 代役があるときは既定（2秒 × 最大2回）で軽く引き直し、駄目なら即座に stale を返す。

/** 記事一覧（本文なし）。ほぼ全ルートが呼ぶ、一番効くキャッシュ */
export const getList = cache(
  (retryWaitCapMs?: number): Promise<ListResult> =>
    withCache(
      'list',
      LIST_FRESH_MS,
      (hasStale) => loadList(hasStale ? undefined : retryWaitCapMs) as Promise<ListResult>
    )
);

/**
 * 記事の詳細（本文つき）。
 *
 * 元の `getDetail` は「DB検索1回 + 本文ブロックの取得（入れ子の数だけ追加）」で、
 * 1本あたり実測 3〜20 往復。ここが当たれば丸ごと 0 になる。
 */
export const getDetail = cache(
  (slug: string): Promise<Blog> =>
    withCache(`detail:${slug}`, DETAIL_FRESH_MS, () => loadDetail(slug), 'Blog not found: ')
);

/**
 * タグ・カテゴリの選択肢。どちらも Notion の同じDBスキーマから作られるので
 * まとめて1エントリにする。
 *
 * `libs/notion.ts` 側は `getDatabaseSchema` を React `cache()` で共有しているが、
 * **`cache()` は RSC のレンダリング中しか効かない**。`sitemap.ts` は metadata route
 * なので素通しになり、`getTagList` と `getCategoryList` がスキーマを2回取りに行っていた
 * （実測: sitemap.xml は1リクエストで3往復。うち1往復はこの重複）。
 *
 * ここで1エントリに畳むと、キーが同じになるので `inflight` で1本にまとまり、
 * RSC でも Route Handler でも1往復で済む。
 */
const getSchemaLists = cache(
  (retryWaitCapMs?: number): Promise<{ tags: NameList<Tag>; categories: NameList<Category> }> =>
    withCache('schema', SCHEMA_FRESH_MS, async (hasStale) => {
      const cap = hasStale ? undefined : retryWaitCapMs;
      const [tags, categories] = await Promise.all([loadTagList(cap), loadCategoryList(cap)]);
      return { tags: tags as NameList<Tag>, categories: categories as NameList<Category> };
    })
);

export const getTagList = async (retryWaitCapMs?: number): Promise<NameList<Tag>> =>
  (await getSchemaLists(retryWaitCapMs)).tags;

export const getCategoryList = async (retryWaitCapMs?: number): Promise<NameList<Category>> =>
  (await getSchemaLists(retryWaitCapMs)).categories;

export const getTagDetail = async (tagId: string): Promise<Tag> => {
  const { contents } = await getTagList();
  const decoded = decodeURIComponent(tagId);
  const tag = contents.find((t) => t.id === decoded || t.id === tagId);
  if (!tag) throw new Error(`Tag not found: ${tagId}`);
  return tag;
};

export const getCategoryDetail = async (categoryId: string): Promise<Category> => {
  const { contents } = await getCategoryList();
  const decoded = decodeURIComponent(categoryId);
  const category = contents.find((c) => c.id === decoded || c.id === categoryId);
  if (!category) throw new Error(`Category not found: ${categoryId}`);
  return category;
};

import type { Blog } from '../../libs/notion';

/**
 * 関連記事のスコアリング。
 *
 * 以前は「同カテゴリ +3 / タグ一致1個につき +1」だけだった。これだと
 * - 同カテゴリの記事が全部3点で並び、同点の並びは元配列（公開日降順）に
 *   従うため、**カテゴリ内の最新3記事が常に関連記事になる**
 * - どの記事にも付いている `Next.js` のようなタグと、2記事にしか付いていない
 *   タグが同じ1点になる
 * - 5年前の記事が上位に来ても何も起きない
 * という問題があった。
 *
 * タグは希少なものほど強く効かせ（IDF）、同点は新しさで解く。
 */

/** 連載が同じなら他の何より優先する。読者が次に読みたいのはまず「続き」 */
const SERIES_WEIGHT = 8;
const CATEGORY_WEIGHT = 3;
const TAG_WEIGHT = 2;
/** 新しさの加点の上限。同点の解消が主目的なので小さくする */
const RECENCY_WEIGHT = 1;
const RECENCY_HORIZON_DAYS = 730;

export function relatedPosts(all: Blog[], current: Blog, limit = 3): Blog[] {
  const others = all.filter((p) => p.id !== current.id);

  // タグの出現数。希少なタグほど「関連している」という情報量が大きい
  const tagFreq = new Map<string, number>();
  for (const post of all) {
    for (const tag of post.tags ?? []) tagFreq.set(tag.id, (tagFreq.get(tag.id) ?? 0) + 1);
  }

  const currentTagIds = new Set((current.tags ?? []).map((t) => t.id));
  const now = Date.now();

  const scored = others.map((post) => {
    let score = 0;

    if (current.series && post.series?.name === current.series.name) score += SERIES_WEIGHT;
    if (current.category && post.category?.id === current.category.id) score += CATEGORY_WEIGHT;

    for (const tag of post.tags ?? []) {
      if (!currentTagIds.has(tag.id)) continue;
      const freq = tagFreq.get(tag.id) ?? 1;
      // 全記事に付いているタグは log(1)=0 になり、実質効かなくなる
      score += Math.log(all.length / freq) * TAG_WEIGHT;
    }

    const ageDays = (now - new Date(post.createdAt).getTime()) / 86_400_000;
    score += Math.max(0, 1 - ageDays / RECENCY_HORIZON_DAYS) * RECENCY_WEIGHT;

    return { post, score };
  });

  const hits = scored
    .filter(({ score }) => score >= CATEGORY_WEIGHT)
    .sort((a, b) => b.score - a.score)
    .map(({ post }) => post);

  // 関連が見つからないときに何も出さないと、記事末尾で導線が切れる。
  // 最新記事で埋めて「次に読むもの」を必ず用意する。
  if (hits.length >= limit) return hits.slice(0, limit);
  const seen = new Set(hits.map((p) => p.id));
  const fallback = others.filter((p) => !seen.has(p.id)).slice(0, limit - hits.length);
  return [...hits, ...fallback];
}

/**
 * 前後記事の対象範囲。
 *
 * 全記事の公開日順だと、React の記事の「次」が無関係なインフラ記事になる。
 * 連載があれば連載内、なければ同カテゴリ内に絞る。
 */
export function navigationScope(all: Blog[], current: Blog): { posts: Blog[]; label: string | null } {
  if (current.series) {
    const posts = all
      .filter((p) => p.series?.name === current.series!.name)
      .sort(
        (a, b) =>
          (b.series?.order ?? 0) - (a.series?.order ?? 0) ||
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    // PostNavigation は「配列の後ろほど古い」前提なので降順で渡す
    if (posts.length > 1) return { posts, label: current.series.name };
  }

  if (current.category) {
    const posts = all.filter((p) => p.category?.id === current.category!.id);
    if (posts.length > 1) return { posts, label: current.category.name };
  }

  return { posts: all, label: null };
}

import type { Blog } from '../../libs/notion';

/** 記事のどこがキーワードに一致したか */
export type MatchField = 'title' | 'description' | 'tag' | 'category' | 'series';

export type SearchHit = {
  blog: Blog;
  /** 一致した場所。結果に「なぜ出てきたか」を示すのに使う */
  matched: MatchField[];
};

/**
 * 検索キーワードを語に分割する。
 *
 * 全角スペースも区切りとして扱う。日本語入力では半角に切り替えずに
 * スペースを打つことが多く、区切られないと1語として扱われて0件になる。
 */
export function parseQuery(raw: string): string[] {
  return raw
    .trim()
    .split(/[\s　]+/)
    .filter(Boolean)
    .map((t) => t.toLowerCase());
}

/**
 * 1記事が全ての語を含むか判定し、一致箇所を返す。
 *
 * AND 検索なので「語ごとにどこかに一致していること」が条件。
 * 「react hooks」で、タイトルに react・タグに hooks があれば一致とする。
 *
 * 注意: 本文は対象外。`getList()` は本文を取得しない（`pageToBlog(page, false)`）ので、
 * `blog.body` は常に空文字列になる。以前は body も条件に入っていたが、
 * 常に false になるだけの分岐だった。
 * 代わりに、書き手が明示した要約（Summary）を概要に含めている。
 * 本文そのものより短いが、記事の要点は拾える。
 */
export function matchBlog(blog: Blog, terms: string[]): MatchField[] | null {
  if (terms.length === 0) return null;

  const title = blog.title.toLowerCase();
  // 概要には OGP Description と要約の両方を含める。
  // 要約は書き手が「この記事でわかること」として書いた文なので、
  // 本文が引けない以上、いちばん情報量の多い手がかりになる。
  const description = [blog.ogpDescription, ...(blog.summary ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  const series = (blog.series?.name || '').toLowerCase();
  const tags = (blog.tags || []).map((t) => t.name.toLowerCase());
  const category = (blog.category?.name || '').toLowerCase();

  const matched = new Set<MatchField>();
  for (const term of terms) {
    let hit = false;
    if (title.includes(term)) { matched.add('title'); hit = true; }
    if (description.includes(term)) { matched.add('description'); hit = true; }
    if (tags.some((t) => t.includes(term))) { matched.add('tag'); hit = true; }
    if (category.includes(term)) { matched.add('category'); hit = true; }
    if (series.includes(term)) { matched.add('series'); hit = true; }
    // 1語でもどこにも無ければ AND 条件を満たさない
    if (!hit) return null;
  }
  return Array.from(matched);
}

/**
 * 一致箇所の強さ。
 *
 * 概要にたまたま単語が出てくるだけの記事が、その技術をタグに持つ記事より
 * 上に来るのは期待とずれる。タイトル > タグ/カテゴリ > 概要 の順で評価する。
 */
const FIELD_WEIGHT: Record<MatchField, number> = {
  title: 4,
  // 連載名での一致は「その連載を探している」意図が強い
  series: 3,
  tag: 2,
  category: 2,
  description: 1,
};

/** 一致の強い順、同点なら新しい記事を上に */
export function searchBlogs(blogs: Blog[], raw: string): SearchHit[] {
  const terms = parseQuery(raw);
  if (terms.length === 0) return [];

  return blogs
    .map((blog) => ({ blog, matched: matchBlog(blog, terms) }))
    .filter((hit): hit is SearchHit => hit.matched !== null)
    .sort((a, b) => {
      const score = (hit: SearchHit) => hit.matched.reduce((n, f) => n + FIELD_WEIGHT[f], 0);
      const diff = score(b) - score(a);
      if (diff !== 0) return diff;
      return new Date(b.blog.createdAt).getTime() - new Date(a.blog.createdAt).getTime();
    });
}

export const MATCH_LABELS: Record<MatchField, string> = {
  title: 'タイトル',
  description: '概要',
  tag: 'タグ',
  category: 'カテゴリ',
  series: '連載名',
};

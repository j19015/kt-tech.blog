import type { Blog } from '../../libs/notion';
import { isPublic } from './blog';

export type SeriesSummary = {
  name: string;
  /** 連載名から作った URL 用の識別子 */
  slug: string;
  /** 第1回から順に並んだ記事 */
  posts: Blog[];
  /** 連載の最終更新日（＝一番新しい記事の公開日） */
  updatedAt: string;
};

/**
 * 連載名を URL に載せる識別子に変換する。
 *
 * 日本語の連載名を想定しているのでローマ字化はせず、
 * URL で扱いに困る記号だけを落とす。`/series/[seriesSlug]` 側では
 * 逆引きせず、全連載を舐めて slug 一致で探す
 * （連載の数はたかが知れているし、別テーブルを持たずに済む）。
 */
export function seriesSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/["'<>`#%\\/?&=+]/g, '')
    .replace(/\s+/g, '-');
}

/**
 * 記事一覧を連載ごとにまとめる。
 *
 * 並び順は `SeriesOrder` の昇順。未設定（0）の記事が混ざっても
 * 破綻しないよう、同値のときは公開日の古い順で決める。
 */
export function groupBySeries(blogs: Blog[]): SeriesSummary[] {
  const byName = new Map<string, Blog[]>();
  for (const blog of blogs) {
    if (!isPublic(blog) || !blog.series) continue;
    const list = byName.get(blog.series.name);
    if (list) list.push(blog);
    else byName.set(blog.series.name, [blog]);
  }

  return Array.from(byName.entries())
    .map(([name, posts]) => {
      const sorted = [...posts].sort(
        (a, b) =>
          (a.series?.order ?? 0) - (b.series?.order ?? 0) ||
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      );
      const updatedAt = sorted.reduce(
        (latest, p) => (new Date(p.publishedAt) > new Date(latest) ? p.publishedAt : latest),
        sorted[0].publishedAt
      );
      return { name, slug: seriesSlug(name), posts: sorted, updatedAt };
    })
    // 更新の新しい連載を先に見せる
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

/** 指定記事が属する連載と、その中での位置を返す */
export function findSeriesOf(blogs: Blog[], blog: Blog): { series: SeriesSummary; index: number } | null {
  if (!blog.series) return null;
  const series = groupBySeries(blogs).find((s) => s.name === blog.series!.name);
  if (!series) return null;
  const index = series.posts.findIndex((p) => p.id === blog.id);
  if (index < 0) return null;
  return { series, index };
}

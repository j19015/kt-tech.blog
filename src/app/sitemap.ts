import { MetadataRoute } from 'next';
import { BOT_RETRY_WAIT_MS, getList, getCategoryList, getTagList } from '../../libs/notionCache';
import { archiveKey, isIndexableList, isPublic } from '@/lib/blog';
import { groupBySeries } from '@/lib/series';

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';
  // 3本まとめて投げると Notion の「平均3リクエスト/秒」に一度で触れて 429 を貰う。
  // sitemap はクローラしか読まないので、直列にして山を低くするほうが得。
  // （getCategoryList と getTagList は同じスキーマ取得を共有するので実質1リクエスト）
  const { contents } = await getList(BOT_RETRY_WAIT_MS);
  const [categoryData, tagData] = await Promise.all([
    getCategoryList(BOT_RETRY_WAIT_MS),
    getTagList(BOT_RETRY_WAIT_MS),
  ]);

  const allBlogs = contents.filter(isPublic);
  const latestUpdated = allBlogs.length > 0
    ? new Date(Math.max(...allBlogs.map((b) => new Date(b.updatedAt).getTime())))
    : new Date();

  // Blog entries
  const blogEntries: MetadataRoute.Sitemap = allBlogs.map((blog) => ({
    url: `${siteUrl}/blogs/${blog.id}`,
    lastModified: new Date(blog.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 一覧は1ページ目だけ載せる。2ページ目以降は noindex（blogs/page/[pageId]）なので、
  // sitemap に載せると「送信したのに noindex」と食い違う。リンクはたどれるので記事は拾われる
  const paginationEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/blogs/page/1`,
      lastModified: latestUpdated,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  // タグ・カテゴリ・アーカイブは、一覧ページ側で index にするものだけ載せる。
  // 記事が少ない一覧は noindex なので、載せると「送信したのに noindex」と食い違う（#587）
  const countBy = (keysOf: (blog: (typeof allBlogs)[number]) => string[]) => {
    const counts = new Map<string, number>();
    for (const blog of allBlogs) {
      for (const key of keysOf(blog)) counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  };
  const categoryCounts = countBy((b) => (b.category ? [b.category.id] : []));
  const tagCounts = countBy((b) => (b.tags ?? []).map((t) => t.id));
  const archiveCounts = countBy((b) => [archiveKey(b)]);

  // Category pages
  const categories = categoryData.contents
    .filter((c) => c.name !== 'PF')
    .filter((c) => isIndexableList(categoryCounts.get(c.id) ?? 0, 1));
  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteUrl}/categories/${encodeURIComponent(cat.id)}/page/1`,
    lastModified: latestUpdated,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Tag pages（1ページ目のURLを正とする。/tags/{id} はそこへリダイレクトする）
  const tagEntries: MetadataRoute.Sitemap = tagData.contents
    .filter((tag) => isIndexableList(tagCounts.get(tag.id) ?? 0, 1))
    .map((tag) => ({
      url: `${siteUrl}/tags/${encodeURIComponent(tag.id)}/page/1`,
      lastModified: latestUpdated,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

  // Series pages
  const seriesList = groupBySeries(contents);
  const seriesEntries: MetadataRoute.Sitemap = seriesList.map((series) => ({
    url: `${siteUrl}/series/${encodeURIComponent(series.slug)}`,
    lastModified: new Date(series.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Archive pages（一覧の絞り込みと同じく createdAt の先頭7文字で月を切る。
  // Date に通すと、タイムゾーン付きの日時で一覧と月がずれうる）
  const archiveMonths = Array.from(archiveCounts.keys()).filter((month) =>
    isIndexableList(archiveCounts.get(month) ?? 0, 1)
  );
  const archiveEntries: MetadataRoute.Sitemap = archiveMonths.map((month) => ({
    url: `${siteUrl}/archives/${month}/page/1`,
    lastModified: latestUpdated,
    changeFrequency: 'monthly' as const,
    priority: 0.4,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: latestUpdated,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/categories`,
      lastModified: latestUpdated,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/tags`,
      lastModified: latestUpdated,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...(seriesList.length > 0
      ? [
          {
            url: `${siteUrl}/series`,
            lastModified: latestUpdated,
            changeFrequency: 'weekly' as const,
            priority: 0.6,
          },
        ]
      : []),
  ];

  return [
    ...staticPages,
    ...paginationEntries,
    ...categoryEntries,
    ...tagEntries,
    ...seriesEntries,
    ...archiveEntries,
    ...blogEntries,
  ];
}

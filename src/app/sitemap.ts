import { MetadataRoute } from 'next';
import { getList, getCategoryList, getTagList } from '../../libs/notion';
import { ITEMS_PER_PAGE, isPublic } from '@/lib/blog';
import { groupBySeries } from '@/lib/series';

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';
  const [{ contents }, categoryData, tagData] = await Promise.all([
    getList(),
    getCategoryList(),
    getTagList(),
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

  // Pagination pages（件数は一覧ページと同じ定数を使う）
  const totalPages = Math.max(1, Math.ceil(allBlogs.length / ITEMS_PER_PAGE));
  const paginationEntries: MetadataRoute.Sitemap = Array.from({ length: totalPages }, (_, i) => ({
    url: `${siteUrl}/blogs/page/${i + 1}`,
    lastModified: latestUpdated,
    changeFrequency: 'daily' as const,
    priority: i === 0 ? 0.9 : 0.6,
  }));

  // Category pages
  const categories = categoryData.contents.filter((c) => c.name !== 'PF');
  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteUrl}/categories/${encodeURIComponent(cat.id)}/page/1`,
    lastModified: latestUpdated,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Tag pages（1ページ目のURLを正とする。/tags/{id} はそこへリダイレクトする）
  const tagEntries: MetadataRoute.Sitemap = tagData.contents.map((tag) => ({
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

  // Archive pages (unique year-month from articles)
  const archiveMonths = new Set(
    allBlogs.map((b) => {
      const d = new Date(b.createdAt);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    })
  );
  const archiveEntries: MetadataRoute.Sitemap = Array.from(archiveMonths).map((month) => ({
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

import { MetadataRoute } from 'next';
import { getList, getCategoryList, getTagList } from '../../libs/notion';

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';
  const [{ contents }, categoryData, tagData] = await Promise.all([
    getList(),
    getCategoryList(),
    getTagList(),
  ]);

  const allBlogs = contents.filter((a) => a.category?.name !== 'PF');
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

  // Pagination pages
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(allBlogs.length / ITEMS_PER_PAGE);
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

  // Tag pages
  const tagEntries: MetadataRoute.Sitemap = tagData.contents.map((tag) => ({
    url: `${siteUrl}/tags/${encodeURIComponent(tag.id)}`,
    lastModified: latestUpdated,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  // Archive pages (unique year-month from articles)
  const archiveMonths = new Set(
    allBlogs.map((b) => {
      const d = new Date(b.createdAt);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    })
  );
  const archiveEntries: MetadataRoute.Sitemap = Array.from(archiveMonths).map((month) => ({
    url: `${siteUrl}/archives/${month}`,
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
  ];

  return [
    ...staticPages,
    ...paginationEntries,
    ...categoryEntries,
    ...tagEntries,
    ...archiveEntries,
    ...blogEntries,
  ];
}

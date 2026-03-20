import { getList } from '../../../libs/notion';

export const runtime = 'edge';

export async function GET() {
  const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';
  const { contents } = await getList();

  const items = contents.slice(0, 20).map((post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blogs/${post.id}</link>
      <guid isPermaLink="true">${siteUrl}/blogs/${post.id}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      ${post.category ? `<category>${post.category.name}</category>` : ''}
      <description><![CDATA[${post.title}]]></description>
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>kt-tech.blog</title>
    <link>${siteUrl}</link>
    <description>実践的な技術記事とエンジニアリングの知見を発信</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600',
    },
  });
}

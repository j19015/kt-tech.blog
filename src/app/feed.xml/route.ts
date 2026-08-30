import { BOT_RETRY_WAIT_MS, getList } from '../../../libs/notion';

export const runtime = 'edge';

export async function GET() {
  const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';
  // 読むのはRSSリーダーと GitHub Actions だけで、誰も画面の前で待っていない。
  // Notion が 429 を返したら、言われたとおり待って引き直す。
  const { contents } = await getList(BOT_RETRY_WAIT_MS);

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
      // 記事ページと同じく stale を許す。Notion が 429 を返した回だけ 500 になるが、
      // 日に1度しか読まないRSSリーダーや GitHub Actions がそれを踏むと
      // 「フィードが壊れている」ようにしか見えない。
      // 直前の正常なフィードを配れるなら、多少古くてもそのほうがよい。
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=86400',
    },
  });
}

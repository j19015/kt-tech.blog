import { BOT_RETRY_WAIT_MS, getList } from '../../../libs/notionCache';
import { isPublic } from '@/lib/blog';
import { mediumUrl } from '@/lib/eyecatch';

/** CDATA の中に `]]>` があると、そこで区切りが終わって XML が壊れる */
const cdata = (text: string) => `<![CDATA[${text.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

/** 属性値に入れる文字列のエスケープ（URL に & が入ることがある） */
const escapeAttr = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * フィードに載せるアイキャッチ。自前の配信ホストにあるものだけ。
 * Notion にアップロードされた画像の URL は署名付きで1時間ほどで切れるため、
 * 1日キャッシュするフィードに載せるとリーダー側で画像が割れる。
 */
const feedImage = (url: string | undefined): string | undefined => {
  const resolved = mediumUrl(url);
  return resolved?.startsWith('https://img.kt-tech.blog/') ? resolved : undefined;
};

export const runtime = 'edge';

export async function GET() {
  const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';
  // 読むのはRSSリーダーと GitHub Actions だけで、誰も画面の前で待っていない。
  // Notion が 429 を返したら、言われたとおり待って引き直す。
  const { contents } = await getList(BOT_RETRY_WAIT_MS);

  // 一覧・sitemap と同じく、非公開扱いの PF カテゴリは載せない（#596）
  const items = contents.filter(isPublic).slice(0, 20).map((post) => {
    // リーダーの一覧で中身が分かるよう、タイトルの繰り返しではなく要約を入れる
    const description = post.ogpDescription || post.summary?.join(' / ') || post.title;
    const image = feedImage(post.eyecatch?.url);
    return `
    <item>
      <title>${cdata(post.title)}</title>
      <link>${siteUrl}/blogs/${post.id}</link>
      <guid isPermaLink="true">${siteUrl}/blogs/${post.id}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <dc:creator>Koki</dc:creator>
      ${post.category ? `<category>${cdata(post.category.name)}</category>` : ''}
      <description>${cdata(description)}</description>
      ${image ? `<media:thumbnail url="${escapeAttr(image)}"/>` : ''}
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
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
      'Content-Type': 'application/rss+xml; charset=utf-8',
      // 記事ページと同じく stale を許す。Notion が 429 を返した回だけ 500 になるが、
      // 日に1度しか読まないRSSリーダーや GitHub Actions がそれを踏むと
      // 「フィードが壊れている」ようにしか見えない。
      // 直前の正常なフィードを配れるなら、多少古くてもそのほうがよい。
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=86400',
    },
  });
}

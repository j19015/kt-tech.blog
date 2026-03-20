import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getDetail, getList, Blog } from '../../../../libs/notion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag } from '@fortawesome/free-solid-svg-icons';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import hljs from 'highlight.js';
import '../../../../styles/markdown.css';
import '../../../../styles/hljs-theme.css';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang: string): string => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch { /* fallthrough */ }
    }
    try {
      return `<pre><code class="hljs">${hljs.highlightAuto(str).value}</code></pre>`;
    } catch { /* fallthrough */ }
    return `<pre><code class="hljs">${escapeHtml(str)}</code></pre>`;
  },
});
md.use(anchor, { permalink: false, slugify: (s: string) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-')) });

// Edge Runtime互換のHTML操作ヘルパー（cheerio不使用）
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

function extractMetaContent(html: string, patterns: string[]): string | undefined {
  for (const pattern of patterns) {
    const regex = new RegExp(`<meta[^>]*(?:name|property)=["']${pattern}["'][^>]*content=["']([^"']*)["']|<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${pattern}["']`, 'i');
    const match = html.match(regex);
    if (match) return match[1] || match[2];
  }
  return undefined;
}

function extractHeadings(html: string): { text: string; id: string; tag: string }[] {
  const headings: { text: string; id: string; tag: string }[] = [];
  const regex = /<(h[12])[^>]*id=["']([^"']*)["'][^>]*>(.*?)<\/\1>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    headings.push({ tag: match[1], id: match[2], text: stripHtml(match[3]) });
  }
  return headings;
}
import type { Metadata, ResolvingMetadata } from 'next';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { TableOfContents } from '@/components/TableOfContents/TableOfContents';
import { StickyTableOfContents } from '@/components/TableOfContents/StickyTableOfContents';
import { RelatedPosts } from '@/components/RelatedPosts/RelatedPosts';
import { ShareButtons } from '@/components/ShareButtons/ShareButtons';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';
import { CodeCopyButton } from '@/components/CodeCopyButton/CodeCopyButton';


export const runtime = 'edge';

type Props = {
  params: Promise<{ blogId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blogId } = await params;
  const blog = await getDetail(blogId);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = blog.eyecatch || [];

  // markdown->平文（Edge互換）
  const rawHtml = md.render(blog.body);
  const text = stripHtml(rawHtml);

  const description = text.slice(0, 120).replace(/\n/g, ' ').trim();
  const ogImage = blog.eyecatch?.url || `${process.env.SITE_URL}/opengraph-image.png`;
  const pageUrl = `${process.env.SITE_URL}/blogs/${blogId}`;

  return {
    title: blog.title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description,
      site: '@tech_koki',
      creator: '@tech_koki',
      images: [ogImage],
    },
    openGraph: {
      title: blog.title,
      description,
      locale: 'ja_JP',
      type: 'article',
      url: pageUrl,
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      authors: ['kt'],
      images: [{ url: ogImage, width: 1200, height: 630, alt: blog.title }],
    },
    other: {
      thumbnail: ogImage,
    },
  };
}

async function fetchOGPData(url: string) {
  // 無効なURLや内部リンクをスキップ
  if (url.includes('localhost') || !url.startsWith('https://')) {
    return null;
  }

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
    const html = await response.text();

    const title = extractMetaContent(html, ['og:title', 'twitter:title', 'title']) ||
      (html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || '').trim();
    const description = extractMetaContent(html, ['og:description', 'description', 'twitter:description']);
    const image = extractMetaContent(html, ['og:image', 'twitter:image', 'image']);
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`;
    const main_image = image
      ? image.includes('https')
        ? image
        : `${url}${image[0] == '/' ? image.substring(1) : image}`
      : faviconUrl;

    return { title, description, image: main_image };
  } catch (error) {
    console.error(`Error fetching OGP for ${url}:`, error);
    return null;
  }
}

export default async function StaticDetailPage({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) {
  const { blogId } = await params;
  const [blog, { contents }] = await Promise.all([
    getDetail(blogId).catch(() => null),
    getList().catch(() => ({ contents: [] as Blog[], totalCount: 0, offset: 0, limit: 0 })),
  ]);
  if (!blog) notFound();
  
  // 同じカテゴリまたはタグを持つ関連記事を取得
  const relatedPosts = contents.filter(post => {
    if (post.id === blogId) return false;
    
    // カテゴリが同じ記事を優先
    if (blog.category && post.category?.id === blog.category.id) return true;
    
    // タグが重複する記事も含める
    if (blog.tags && post.tags) {
      const blogTagIds = blog.tags.map(t => t.id);
      return post.tags.some(t => blogTagIds.includes(t.id));
    }
    
    return false;
  });
  
  // calloutマーカーをプレースホルダーに変換（markdownToHtmlに通す前）
  const calloutMap = new Map<string, { icon: string; color: string; text: string }>();
  let calloutIndex = 0;
  const bodyPreprocessed = blog.body.replace(
    /:::callout\{icon="([^"]*)" color="([^"]*)"\}\n([\s\S]*?)\n:::/g,
    (_, icon, color, text) => {
      const placeholder = `CALLOUT_PLACEHOLDER_${calloutIndex++}`;
      calloutMap.set(placeholder, { icon, color, text });
      return placeholder;
    }
  );

  const html = md.render(bodyPreprocessed);

  // プレースホルダーをcallout HTMLに置換
  let processedHtml = html;
  calloutMap.forEach(({ icon, color, text }, placeholder) => {
    const textHtml = md.render(text).replace(/<\/?p>/g, '').trim();
    const calloutHtml = `<div class="callout callout-${color}"><span class="callout-icon">${icon}</span><div class="callout-content">${textHtml}</div></div>`;
    processedHtml = processedHtml.replace(new RegExp(`<p>${placeholder}</p>|${placeholder}`, 'g'), calloutHtml);
  });

  // [toc]マーカーを除去（ブログ側で目次を自動生成するため）
  processedHtml = processedHtml.replace(/<p>\s*\[toc\]\s*<\/p>/gi, '');
  processedHtml = processedHtml.replace(/\[toc\]/gi, '');

  // リンクカード生成（正規表現ベース）
  const linkRegex = /<a[^>]*href="(https?:\/\/[^"]*)"[^>]*>.*?<\/a>/gi;
  const uniqueLinks: string[] = [];
  let linkMatch;
  while ((linkMatch = linkRegex.exec(processedHtml)) !== null) {
    const href = linkMatch[1];
    if (!uniqueLinks.includes(href)) uniqueLinks.push(href);
  }

  const ogpResults = await Promise.all(uniqueLinks.map(href => fetchOGPData(href)));
  const hrefToOgpData = new Map<string, any>();
  uniqueLinks.forEach((href, i) => hrefToOgpData.set(href, ogpResults[i]));

  // <p>タグ内の単独リンクをリンクカードに置換
  processedHtml = processedHtml.replace(
    /<p>\s*<a[^>]*href="(https?:\/\/[^"]*)"[^>]*>[^<]*<\/a>\s*<\/p>/gi,
    (fullMatch, href) => {
      const meta = hrefToOgpData.get(href);
      const title = meta?.title || new URL(href).hostname;
      const favicon = `https://www.google.com/s2/favicons?domain=${new URL(href).hostname}&sz=128`;
      const image = meta?.image || favicon;
      return `<div class="link-card mt-3 mb-3"><a href="${href}" target="_blank" rel="noopener noreferrer"><div class="link-card-body"><div class="link-card-info"><div class="link-card-title">${title}</div><div class="link-card-url">${href}</div></div><img src="${image}" class="link-card-thumbnail" /></div></a></div>`;
    }
  );

  // 目次生成（正規表現ベース）
  const toc = extractHeadings(processedHtml);

  if (!blog) {
    notFound();
  }

  // JSON-LD 構造化データ
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.body.replace(/:::callout\{[^}]*\}/g, '').replace(/:::/g, '').replace(/[#*`>\n]/g, ' ').replace(/\s+/g, ' ').slice(0, 160).trim(),
    image: blog.eyecatch?.url || `${process.env.SITE_URL}/opengraph-image.png`,
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    author: { '@type': 'Person', name: 'kt', url: 'https://kt-tech.blog/about' },
    publisher: {
      '@type': 'Organization',
      name: 'kt-tech.blog',
      url: 'https://kt-tech.blog',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.SITE_URL}/blogs/${blogId}`,
    },
    keywords: blog.tags?.map(t => t.name).join(', '),
    articleSection: blog.category?.name,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${process.env.SITE_URL}/blogs/page/1` },
      { '@type': 'ListItem', position: 3, name: blog.title },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <BreadcrumbNav
        items={[
          { label: 'Blog', href: '/blogs/page/1' },
          { label: blog.title, current: true }
        ]}
      />
      <div className='grid grid-cols-2 lg:grid-cols-3 lg:p-4'>
        <div className='lg:col-span-1 p-5 pl-7 pt-0 hidden lg:block'>
          <StickyTableOfContents toc={toc} />
        </div>
        <div className='lg:col-span-2 col-span-3 lg:py-5 lg:px-3 rounded-lg shadow-lg content'>
          {' '}
          {/* 通常の画面サイズでは2列分のスペースを占有 */}
          <div>
            <div className='p-4'>
              <Image
                src={blog.eyecatch?.url || '/images/no_image_generated.png'}
                alt={blog.title}
                width={1200}
                height={630}
                className='rounded-lg w-full'
                priority
              />
            </div>
            {/* メタデータセクション */}
            <div className='p-6 space-y-4'>
              {/* カテゴリと日付 */}
              <div className='flex flex-wrap items-center gap-3'>
                {blog.category && (
                  <Link href={`/categories/${blog.category.id}`}>
                    <span className='inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'>
                      <FontAwesomeIcon icon={faFolderOpen} className='w-3.5 h-3.5' />
                      {blog.category.name}
                    </span>
                  </Link>
                )}
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <FontAwesomeIcon icon={faCalendarAlt} className='w-4 h-4' />
                  <time className='text-sm'>
                    {new Date(blog.createdAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </div>
              
              {/* タグ */}
              {blog.tags && blog.tags.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {blog.tags.map((tag) => (
                    <Link key={tag.id} href={`/tags/${tag.id}`}>
                      <span className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'>
                        <FontAwesomeIcon icon={faTag} className='w-3 h-3' />
                        {tag.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <h1 className='p-4 mt-5 text-xl font-bold lg:text-3xl text-foreground'>{blog.title}</h1>
            <ShareButtons title={blog.title} url={`${process.env.SITE_URL}/blogs/${blog.id}`} />
            <TableOfContents toc={toc} />
            <div className='p-4 znc markdown text-foreground'>
              <div dangerouslySetInnerHTML={{ __html: processedHtml }}></div>
              <CodeCopyButton />
            </div>
            <RelatedPosts posts={relatedPosts} currentPostId={blogId} />
          </div>
        </div>
      </div>
    </>
  );
}

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
import { ReadingTracker } from '@/components/ReadingStats/ReadingTracker';
import { FloatingShareButton } from '@/components/ShareButtons/FloatingShareButton';
import { PostNavigation } from '@/components/PostNavigation/PostNavigation';
import { ImageLightbox } from '@/components/ImageLightbox/ImageLightbox';
import { KeyboardNav } from '@/components/KeyboardNav/KeyboardNav';
import { FloatingTocButton } from '@/components/TableOfContents/FloatingTocButton';
import { BookmarkButton } from '@/components/Bookmark/BookmarkButton';


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
  const cleanBody = blog.body
    .replace(/:::callout\{[^}]*\}/g, '')
    .replace(/:::/g, '')
    .replace(/\[toc\]/gi, '')
    .replace(/"\[toc\]"/gi, '');
  const rawHtml = md.render(cleanBody);
  const text = stripHtml(rawHtml);

  const description = blog.ogpDescription || text.slice(0, 120).replace(/\n/g, ' ').trim();
  const ogImage = blog.eyecatch?.url;
  const pageUrl = `${process.env.SITE_URL}/blogs/${blogId}`;

  return {
    title: blog.title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: blog.title,
      description,
      site: '@meow_koki',
      creator: '@meow_koki',
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    openGraph: {
      title: blog.title,
      description,
      locale: 'ja_JP',
      type: 'article' as const,
      url: pageUrl,
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      authors: ['Koki'],
      section: blog.category?.name,
      tags: blog.tags?.map(t => t.name),
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: blog.title }] } : {}),
    },
    ...(ogImage ? { other: { thumbnail: ogImage } } : {}),
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
  
  // 関連記事をスコアリングで取得（タグ重複数 + カテゴリ一致で重み付け）
  const blogTagIds = blog.tags?.map(t => t.id) || [];
  const relatedPosts = contents
    .filter(post => post.id !== blogId)
    .map(post => {
      let score = 0;
      if (blog.category && post.category?.id === blog.category.id) score += 3;
      if (post.tags) {
        score += post.tags.filter(t => blogTagIds.includes(t.id)).length;
      }
      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ post }) => post);
  
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
    // テキスト先頭の絵文字がiconと重複する場合は除去
    let cleanText = text.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]+\s*/u, '').trim();
    const textHtml = md.render(cleanText).replace(/<\/?p>/g, '').trim();
    const calloutHtml = `<div class="callout callout-${color}"><span class="callout-icon">${icon}</span><div class="callout-content">${textHtml}</div></div>`;
    processedHtml = processedHtml.replace(new RegExp(`<p>${placeholder}</p>|${placeholder}`, 'g'), calloutHtml);
  });

  // [toc]マーカーを除去（ブログ側で目次を自動生成するため）
  processedHtml = processedHtml.replace(/<p>\s*\[toc\]\s*<\/p>/gi, '');
  processedHtml = processedHtml.replace(/<p>\s*"\[toc\]"\s*<\/p>/gi, '');
  processedHtml = processedHtml.replace(/"\[toc\]"/gi, '');
  processedHtml = processedHtml.replace(/\[toc\]/gi, '');

  // テーブルをスクロール可能なラッパーで囲む（モバイル対応）
  processedHtml = processedHtml.replace(
    /<table/g,
    '<div class="overflow-x-auto -mx-4 px-4"><table'
  );
  processedHtml = processedHtml.replace(/<\/table>/g, '</table></div>');

  // コードブロックにaria-labelを付与
  processedHtml = processedHtml.replace(
    /<pre><code class="language-(\w+)"/g,
    '<pre role="region" aria-label="$1 code"><code class="language-$1"'
  );

  // 記事本文内画像に lazy loading + async decoding を付与
  processedHtml = processedHtml.replace(
    /<img(?![^>]*loading=)/g,
    '<img loading="lazy" decoding="async"'
  );

  // リンクカード生成（正規表現ベース）
  const linkRegex = /<a[^>]*href="(https?:\/\/[^"]*)"[^>]*>.*?<\/a>/gi;
  const uniqueLinks: string[] = [];
  let linkMatch;
  while ((linkMatch = linkRegex.exec(processedHtml)) !== null) {
    const href = linkMatch[1];
    if (!uniqueLinks.includes(href)) uniqueLinks.push(href);
  }

  const ogpResults = await Promise.allSettled(uniqueLinks.map(href => fetchOGPData(href)));
  const hrefToOgpData = new Map<string, any>();
  uniqueLinks.forEach((href, i) => {
    const result = ogpResults[i];
    hrefToOgpData.set(href, result.status === 'fulfilled' ? result.value : null);
  });

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
    image: blog.eyecatch?.url || `${process.env.SITE_URL}/opengraph-image`,
    datePublished: new Date(blog.publishedAt).toISOString(),
    dateModified: new Date(blog.updatedAt).toISOString(),
    inLanguage: 'ja',
    author: {
      '@type': 'Person',
      name: 'Koki',
      url: 'https://kt-tech.blog/about',
      sameAs: [
        'https://github.com/j19015',
        'https://x.com/meow_koki',
      ],
    },
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
    thumbnailUrl: blog.eyecatch?.url,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['[data-article-title]', '[data-article-description]'],
    },
    wordCount: stripHtml(processedHtml).length,
    timeRequired: `PT${Math.max(1, Math.ceil(stripHtml(processedHtml).length / 600))}M`,
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
      <div className='grid grid-cols-1 lg:grid-cols-3 lg:p-4'>
        <div className='lg:col-span-1 p-5 pl-7 pt-0 hidden lg:block'>
          <StickyTableOfContents toc={toc} />
        </div>
        <div className='lg:col-span-2 col-span-1 lg:py-5 lg:px-3 content overflow-hidden'>
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
              {/* カテゴリと日付と読了時間 */}
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
                {blog.updatedAt !== blog.createdAt && (
                  <span className='text-xs text-slate-400 dark:text-slate-500'>
                    (更新: {new Date(blog.updatedAt).toLocaleDateString('ja-JP')})
                  </span>
                )}
                <span className='text-xs text-slate-400 dark:text-slate-500'>
                  · 約{Math.max(1, Math.ceil(stripHtml(processedHtml).length / 600))}分で読めます
                </span>
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
            <h1 data-article-title className='p-4 mt-5 text-xl font-bold lg:text-3xl text-foreground break-words'>{blog.title}</h1>
            <div className='flex items-center justify-between px-4'>
              <ShareButtons title={blog.title} url={`${process.env.SITE_URL}/blogs/${blog.id}`} />
              <BookmarkButton articleId={blogId} title={blog.title} />
            </div>
            <TableOfContents toc={toc} />
            <div className='p-4 znc markdown text-foreground'>
              <div dangerouslySetInnerHTML={{ __html: processedHtml }}></div>
              <CodeCopyButton />
              <ImageLightbox />
              <ReadingTracker articleId={blogId} />
            </div>
            {/* 記事末シェアCTA + 著者カード */}
            <div className='mt-12 mx-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-6'>
              <div className='text-center'>
                <p className='text-sm text-slate-600 dark:text-slate-400 mb-3'>この記事が役に立ったら共有しよう</p>
                <ShareButtons title={blog.title} url={`${process.env.SITE_URL}/blogs/${blog.id}`} />
              </div>
              <div className='border-t border-slate-200 dark:border-slate-700 pt-6'>
                <div className='flex items-center gap-4'>
                  <img src='/images/meow_koki.webp' alt='Koki' className='w-12 h-12 rounded-full object-cover' />
                  <div>
                    <p className='font-bold text-slate-900 dark:text-slate-100'>Koki</p>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>フルスタックエンジニア / React, Next.js, TypeScript</p>
                  </div>
                </div>
              </div>
              {/* Feedback links */}
              <div className='flex flex-wrap gap-4 pt-4 border-t border-slate-200 dark:border-slate-700'>
                <a
                  href={`https://x.com/search?q=${encodeURIComponent(process.env.SITE_URL + '/blogs/' + blogId)}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-xs text-slate-400 dark:text-slate-500 hover:text-blue-500 transition-colors'
                >
                  Xで議論を見る
                </a>
                <a
                  href={`https://github.com/j19015/kt-tech.blog/issues/new?title=${encodeURIComponent('[typo] ' + blog.title)}&body=${encodeURIComponent('記事URL: ' + process.env.SITE_URL + '/blogs/' + blogId + '\n\n誤字・修正内容:\n')}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-xs text-slate-400 dark:text-slate-500 hover:text-blue-500 transition-colors'
                >
                  誤字を報告する
                </a>
              </div>
            </div>
            <PostNavigation currentId={blogId} allPosts={contents} />
            {(() => {
              const idx = contents.findIndex(p => p.id === blogId);
              const prevPost = idx < contents.length - 1 ? contents[idx + 1] : null;
              const nextPost = idx > 0 ? contents[idx - 1] : null;
              return <KeyboardNav prevUrl={prevPost ? `/blogs/${prevPost.id}` : undefined} nextUrl={nextPost ? `/blogs/${nextPost.id}` : undefined} />;
            })()}
            <RelatedPosts posts={relatedPosts} currentPostId={blogId} />
          <FloatingTocButton toc={toc} />
          <FloatingShareButton title={blog.title} url={`${process.env.SITE_URL}/blogs/${blog.id}`} />
          </div>
        </div>
      </div>
    </>
  );
}

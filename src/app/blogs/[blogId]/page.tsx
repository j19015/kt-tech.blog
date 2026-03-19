import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getDetail, getList } from '../../../../libs/notion';
import cheerio from 'cheerio';
import hljs from 'highlight.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag } from '@fortawesome/free-solid-svg-icons';
import markdownToHtml from 'zenn-markdown-html';
import 'zenn-content-css';
import '../../../../styles/markdown.css';
import '../../../../styles/default-dark.min.css';
import type { Metadata, ResolvingMetadata } from 'next';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { TableOfContents } from '@/components/TableOfContents/TableOfContents';
import { StickyTableOfContents } from '@/components/TableOfContents/StickyTableOfContents';
import { RelatedPosts } from '@/components/RelatedPosts/RelatedPosts';
import { ShareButtons } from '@/components/ShareButtons/ShareButtons';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';


export async function generateStaticParams() {
  // ビルド時にはパスを生成しない（ISRで初回アクセス時に生成）
  return [];
}

type Props = {
  params: { blogId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // fetch data
  const blog = await getDetail(params.blogId);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = blog.eyecatch || [];

  // markdown->平文
  const html = markdownToHtml(blog.body);
  const $ = cheerio.load(html);
  const text = $('body').text();

  const description = text.slice(0, 120).replace(/\n/g, ' ').trim();
  const ogImage = blog.eyecatch?.url || `${process.env.SITE_URL}/opengraph-image.png`;
  const pageUrl = `${process.env.SITE_URL}/blogs/${params.blogId}`;

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
  // localhostを含むURLの場合はカスタムのデータを返す
  if (url.includes('localhost')) {
    return {
      title: 'localhost', // タイトルにローカルホストと表示
      description: 'ローカル環境のリンクです', // 任意の説明
      image: '/images/no_image_generated.png', // デフォルト画像パス
    };
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const getMetaTag = (name: string) => {
      return (
        $(`meta[name=${name}]`).attr('content') ||
        $(`meta[property="og:${name}"]`).attr('content') ||
        $(`meta[property="twitter:${name}"]`).attr('content') ||
        $(`meta[name="og:${name}"]`).attr('content')
      );
    };

    const title = getMetaTag('title') || $('title').text();
    const description = getMetaTag('description') || $('meta[name="description"]').attr('content');
    const image = getMetaTag('image') || $('img').attr('src');
    // ファビコンをフォールバックとして使用
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`;
    const main_image = image
      ? image.includes('https')
        ? image
        : `${url}${image[0] == '/' ? image.substring(1) : image}`
      : faviconUrl;

    return {
      title,
      description,
      image: main_image,
    };
  } catch (error) {
    console.error(`Error fetching OGP for ${url}:`, error);
    return null; // エラーが発生した場合も何も返さない
  }
}

export default async function StaticDetailPage({
  params: { blogId },
}: {
  params: { blogId: string };
}) {
  const blog = await getDetail(blogId);
  const { contents } = await getList();
  
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

  const html = markdownToHtml(bodyPreprocessed);

  // プレースホルダーをcallout HTMLに置換（テキスト部分もMarkdown変換）
  let htmlWithCallouts = html;
  calloutMap.forEach(({ icon, color, text }, placeholder) => {
    // callout内テキストのインラインMarkdownを変換
    const textHtml = markdownToHtml(text).replace(/<\/?p>/g, '').trim();
    const calloutHtml = `<div class="callout callout-${color}"><span class="callout-icon">${icon}</span><div class="callout-content">${textHtml}</div></div>`;
    htmlWithCallouts = htmlWithCallouts.replace(new RegExp(`<p>${placeholder}</p>|${placeholder}`, 'g'), calloutHtml);
  });

  const parse_body2 = cheerio.load(htmlWithCallouts);

  // シンタックスハイライト
  parse_body2('pre code').each((_, elm) => {
    const result = hljs.highlightAuto(parse_body2(elm).text());
    parse_body2(elm).html(result.value);
    parse_body2(elm).addClass('hljs');
  });

  // 重複なしで全てのリンクのhrefを取得
  const uniqueLinks: string[] = [];
  parse_body2('a').each((_, link) => {
    const href = parse_body2(link).attr('href');
    if (href && !href.startsWith('#') && !uniqueLinks.includes(href)) {
      uniqueLinks.push(href);
    }
  });

  // 各リンクのOGPデータを非同期で取得
  const ogpDataPromises = Array.from(uniqueLinks).map((href) => fetchOGPData(href));
  const ogpDataResults = await Promise.all(ogpDataPromises);

  // hrefとOGPデータをマッピング
  const hrefToOgpData = new Map();
  Array.from(uniqueLinks).forEach((href, index) => {
    hrefToOgpData.set(href, ogpDataResults[index]);
  });

  // リンクカードの生成とHTMLの更新
  parse_body2('a').each((_, link) => {
    const href = parse_body2(link).attr('href');
    if (!href || href.startsWith('#')) {
      return;
    }

    const meta = hrefToOgpData.get(href);

    if (!meta) {
      return;
    }

    const linkCardHTML = `
      <div class="link-card mt-3 mb-3">
        <a href="${href}" target="_blank" rel="noopener noreferrer">
          <div class="link-card-body">
            <div class="link-card-info">
              <div class="link-card-title">${meta.title}</div>
              <div class="link-card-url">${href}</div>
            </div>
            <img src="${meta.image}" class="link-card-thumbnail" />
          </div>
        </a>
      </div>
    `;

    parse_body2(link.parent).replaceWith(linkCardHTML);
  });

  //目次機能
  const $ = cheerio.load(html);
  const headings = $('h1, h2').toArray();
  const toc = headings.map((element) => ({
    text: $(element).text(),
    id: (element as any).attribs.id,
    tag: (element as any).tagName,
  }));

  if (!blog) {
    notFound();
  }

  // JSON-LD 構造化データ
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.body.replace(/[#*`>\n]/g, ' ').slice(0, 160).trim(),
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
              <Link href={`/blogs/${blog.id}`}>
                <Image
                  src={blog.eyecatch?.url || '/images/no_image_generated.png'}
                  alt='画像'
                  width={10000}
                  height={10000}
                  className='rounded-lg'
                />
              </Link>
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
              <div dangerouslySetInnerHTML={{ __html: parse_body2.html() }}></div>
            </div>
            <RelatedPosts posts={relatedPosts} currentPostId={blogId} />
          </div>
        </div>
      </div>
    </>
  );
}

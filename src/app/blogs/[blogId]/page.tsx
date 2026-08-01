import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getDetail, getList, Blog } from '../../../../libs/notion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag } from '@fortawesome/free-solid-svg-icons';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import hljs from 'highlight.js/lib/core';
import '../../../../styles/markdown.css';
import '../../../../styles/hljs-theme.css';

// highlight.js の既定エントリは190以上の言語定義を含み、Workersのバンドルサイズを圧迫する。
// 記事で実際に使う言語だけを登録する。
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import go from 'highlight.js/lib/languages/go';
import graphql from 'highlight.js/lib/languages/graphql';
import ini from 'highlight.js/lib/languages/ini';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import scss from 'highlight.js/lib/languages/scss';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

const LANGUAGES: Record<string, any> = {
  bash, css, diff, dockerfile, go, graphql, java, javascript, json, markdown,
  php, python, ruby, rust, scss, sql, typescript, xml, yaml,
  ini, // toml も ini で色付けできる
};
Object.entries(LANGUAGES).forEach(([name, lang]) => hljs.registerLanguage(name, lang));
// よく使われる別名
hljs.registerAliases(['sh', 'shell', 'zsh'], { languageName: 'bash' });
hljs.registerAliases(['js', 'jsx'], { languageName: 'javascript' });
hljs.registerAliases(['ts', 'tsx'], { languageName: 'typescript' });
hljs.registerAliases(['html', 'vue', 'svg'], { languageName: 'xml' });
hljs.registerAliases(['yml'], { languageName: 'yaml' });
hljs.registerAliases(['toml'], { languageName: 'ini' });
hljs.registerAliases(['py'], { languageName: 'python' });
hljs.registerAliases(['rb'], { languageName: 'ruby' });

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// コードブロック右上に出す言語ラベル。
// 以前はCSSに言語ごとの ::before をハードコードしていたため、
// 列挙外の言語ではラベルが空文字になり、余白だけが2em空いていた。
// 別名も含めて引けるようにしておく。
// hljs.getLanguage().name は "HTML, XML" のような文字列を返すことがあり、正規化には使えない。
const LANG_LABELS: Record<string, string> = {
  bash: 'Bash', sh: 'Bash', shell: 'Bash', zsh: 'Bash',
  css: 'CSS', scss: 'SCSS',
  diff: 'Diff', dockerfile: 'Dockerfile',
  go: 'Go', graphql: 'GraphQL',
  ini: 'INI', toml: 'TOML',
  java: 'Java',
  javascript: 'JavaScript', js: 'JavaScript', jsx: 'JSX',
  typescript: 'TypeScript', ts: 'TypeScript', tsx: 'TSX',
  json: 'JSON', markdown: 'Markdown',
  php: 'PHP',
  python: 'Python', py: 'Python',
  ruby: 'Ruby', rb: 'Ruby',
  rust: 'Rust', sql: 'SQL',
  xml: 'XML', html: 'HTML', vue: 'Vue', svg: 'SVG',
  yaml: 'YAML', yml: 'YAML',
};

const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  // typographer は "..." を … に、-- を – に変換してしまう。
  // 技術記事ではコマンドやJSONの引用符が壊れるため無効にする。
  typographer: false,
  highlight: (str: string, lang: string): string => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const label = LANG_LABELS[lang.toLowerCase()] ?? lang.toUpperCase();
        return `<pre class="has-lang" role="region" aria-label="${escapeHtml(label)}のコード"><code class="hljs language-${lang}" data-lang="${escapeHtml(label)}">${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch { /* fallthrough */ }
    }
    // 言語指定がない場合は自動判定に頼らず、そのままエスケープして出す。
    // 誤判定した色付けは読み手を混乱させるうえ、Edge の CPU 時間も余計に使う。
    return `<pre role="region" aria-label="コード"><code class="hljs">${escapeHtml(str)}</code></pre>`;
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

// h3 まで拾う。以前は h1/h2 しか拾っておらず、目次コンポーネント側にある
// h3 用のインデント分岐が一度も使われていなかった。
function extractHeadings(html: string): { text: string; id: string; tag: string }[] {
  const headings: { text: string; id: string; tag: string }[] = [];
  const regex = /<(h[123])[^>]*id=["']([^"']*)["'][^>]*>(.*?)<\/\1>/gi;
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
import { isPublic } from '@/lib/blog';


export const runtime = 'edge';

type Props = {
  params: Promise<{ blogId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blogId } = await params;
  // 記事が見つからない場合はここで例外を投げず、本体側の notFound() に任せる。
  // catch がないと、存在しないURLが404ではなく500として扱われてしまう。
  const blog = await getDetail(blogId).catch(() => null);
  if (!blog) {
    return { title: '記事が見つかりません', robots: { index: false, follow: false } };
  }

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
      site: '@tech_koki',
      creator: '@tech_koki',
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

  // 前後記事・関連記事はPF記事を除いた一覧から選ぶ。
  // 一覧に出ていない記事へ飛ばされると導線が破綻するため。
  const navPosts = contents.filter(isPublic);

  // 関連記事をスコアリングで取得（タグ重複数 + カテゴリ一致で重み付け）
  const blogTagIds = blog.tags?.map(t => t.id) || [];
  const relatedPosts = navPosts
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
  // 前後を %% で囲うのは、CALLOUT1 が CALLOUT10 の先頭にマッチして
  // 11個目以降のcalloutが壊れるのを防ぐため
  const calloutMap = new Map<string, { icon: string; color: string; text: string }>();
  let calloutIndex = 0;
  const bodyPreprocessed = blog.body.replace(
    /:::callout\{icon="([^"]*)" color="([^"]*)"\}\n([\s\S]*?)\n:::/g,
    (_, icon, color, text) => {
      const placeholder = `%%CALLOUT${calloutIndex++}%%`;
      calloutMap.set(placeholder, { icon, color, text });
      return placeholder;
    }
  );

  const html = md.render(bodyPreprocessed);

  // プレースホルダーをcallout HTMLに置換
  let processedHtml = html;
  calloutMap.forEach(({ icon, color, text }, placeholder) => {
    // テキスト先頭の絵文字がiconと重複する場合は除去
    const cleanText = text.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]+\s*/u, '').trim();
    const rendered = md.render(cleanText).trim();
    // 単一段落のときだけ <p> を外す。
    // 無条件に全ての <p> を除去すると、複数段落のcalloutが1段落に潰れてしまう。
    const isSingleParagraph =
      /^<p>[\s\S]*<\/p>$/.test(rendered) && !rendered.slice(3, -4).includes('<p>');
    const textHtml = isSingleParagraph ? rendered.slice(3, -4) : rendered;
    const calloutHtml = `<div class="callout callout-${color}"><span class="callout-icon" aria-hidden="true">${icon}</span><div class="callout-content">${textHtml}</div></div>`;
    // 置換文字列を関数で渡し、本文中の $& などが置換パターンとして解釈されるのを防ぐ
    processedHtml = processedHtml.replace(
      new RegExp(`<p>${placeholder}</p>|${placeholder}`, 'g'),
      () => calloutHtml
    );
  });

  // [toc]マーカーを除去（ブログ側で目次を自動生成するため）
  processedHtml = processedHtml.replace(/<p>\s*\[toc\]\s*<\/p>/gi, '');
  processedHtml = processedHtml.replace(/<p>\s*"\[toc\]"\s*<\/p>/gi, '');
  processedHtml = processedHtml.replace(/"\[toc\]"/gi, '');
  processedHtml = processedHtml.replace(/\[toc\]/gi, '');

  // 見出し行を持たないNotionテーブルは、Markdownの制約上ダミーの空ヘッダーを挟んでいる。
  // 空のままだと灰色の帯だけが残るので取り除く。
  processedHtml = processedHtml.replace(
    /<thead>\s*<tr>(?:\s*<th[^>]*>\s*<\/th>)+\s*<\/tr>\s*<\/thead>/g,
    ''
  );

  // テーブルをスクロール可能なラッパーで囲む（モバイル対応）
  // スクロールできることが分からないと「表が途中で切れている」と誤解されるため、
  // CSS側で端にフェードを出す（.table-scroll）
  processedHtml = processedHtml.replace(/<table/g, '<div class="table-scroll"><table');
  processedHtml = processedHtml.replace(/<\/table>/g, '</table></div>');

  // 記事本文内画像に lazy loading + async decoding を付与
  processedHtml = processedHtml.replace(
    /<img(?![^>]*loading=)/g,
    '<img loading="lazy" decoding="async"'
  );

  // alt付きの単独画像を figure/figcaption にしてキャプションを表示する。
  // img は置換要素なので ::after でキャプションを出すことはできない。
  processedHtml = processedHtml.replace(
    /<p>(<img [^>]*?alt="([^"]+)"[^>]*>)<\/p>/g,
    (_match, img, alt) => `<figure>${img}<figcaption>${alt}</figcaption></figure>`
  );

  // チェックリスト(to_do)の <li> にクラスを付ける（マーカー除去とインデント調整のため）
  processedHtml = processedHtml.replace(
    /<li>(\s*<input type="checkbox")/g,
    '<li class="task-list-item">$1'
  );

  // リンクカード化するのは <p> 内に単独で置かれたリンクだけ。
  // 以前は本文中のインラインリンクも含めた全リンクにOGP取得をかけており、
  // 大半の結果を捨てたうえで TTFB とWorkersのサブリクエスト数を消費していた。
  const CARD_LINK_RE = /<p>\s*<a[^>]*href="(https?:\/\/[^"]*)"[^>]*>[^<]*<\/a>\s*<\/p>/gi;
  const cardLinks = Array.from(
    new Set(Array.from(processedHtml.matchAll(CARD_LINK_RE), (m) => m[1]))
  );

  const ogpResults = await Promise.allSettled(cardLinks.map((href) => fetchOGPData(href)));
  const hrefToOgpData = new Map<string, any>();
  cardLinks.forEach((href, i) => {
    const result = ogpResults[i];
    hrefToOgpData.set(href, result.status === 'fulfilled' ? result.value : null);
  });

  // <p>タグ内の単独リンクをリンクカードに置換
  processedHtml = processedHtml.replace(CARD_LINK_RE, (_fullMatch, href: string) => {
    const meta = hrefToOgpData.get(href);
    let hostname: string;
    try {
      hostname = new URL(href).hostname;
    } catch {
      return _fullMatch;
    }
    // 外部サイトから取ってきた値なので必ずエスケープする
    const title = escapeHtml(meta?.title || hostname);
    const safeHref = escapeHtml(href);
    const favicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`;
    const thumbnail = meta?.image
      ? `<img src="${escapeHtml(meta.image)}" alt="" class="link-card-thumbnail" loading="lazy" />`
      : '';
    return `<div class="link-card${thumbnail ? '' : ' link-card--no-image'}"><a href="${safeHref}" target="_blank" rel="noopener noreferrer"><div class="link-card-body"><div class="link-card-info"><div class="link-card-title">${title}</div><div class="link-card-url"><img src="${favicon}" alt="" class="link-card-favicon" loading="lazy" />${escapeHtml(hostname)}</div></div>${thumbnail}</div></a></div>`;
  });

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
        'https://x.com/tech_koki',
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
                  <Link href={`/categories/${blog.category.id}/page/1`}>
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
            <ShareButtons title={blog.title} url={`${process.env.SITE_URL}/blogs/${blog.id}`} />
            <div className='px-6 -mt-4 mb-4'>
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
            <PostNavigation currentId={blogId} allPosts={navPosts} />
            {(() => {
              const idx = navPosts.findIndex(p => p.id === blogId);
              const prevPost = idx >= 0 && idx < navPosts.length - 1 ? navPosts[idx + 1] : null;
              const nextPost = idx > 0 ? navPosts[idx - 1] : null;
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

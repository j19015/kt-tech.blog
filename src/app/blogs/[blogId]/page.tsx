import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getDetail, getList, Blog } from '../../../../libs/notion';
import { md, escapeHtml } from '@/lib/markdown';
import { stripEmoji } from '@/lib/emoji';
import '../../../../styles/markdown.css';
import '../../../../styles/hljs-theme.css';

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

// 本文の見出しは h2 から始まる（h1 は記事タイトル）ので h2〜h4 を拾う。
// Notion の heading_1/2/3 がそれぞれ h2/h3/h4 になる。
function extractHeadings(html: string): { text: string; id: string; tag: string }[] {
  const headings: { text: string; id: string; tag: string }[] = [];
  const regex = /<(h[234])[^>]*id=["']([^"']*)["'][^>]*>(.*?)<\/\1>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    // 見出し内のパーマリンク（<a class="heading-anchor">#</a>）を落としてから
    // テキスト化する。残すと目次の項目名が「はじめに#」になってしまう。
    const inner = match[3].replace(/<a class="heading-anchor"[\s\S]*?<\/a>/g, '');
    // 絵文字は本文の見出しには残すが、目次では落として一覧を読みやすく保つ
    headings.push({ tag: match[1], id: match[2], text: stripEmoji(stripHtml(inner)) });
  }
  return headings;
}
import type { Metadata, ResolvingMetadata } from 'next';
import { TableOfContents } from '@/components/TableOfContents/TableOfContents';
import { StickyTableOfContents } from '@/components/TableOfContents/StickyTableOfContents';
import { RelatedPosts } from '@/components/RelatedPosts/RelatedPosts';
import { ShareButtons } from '@/components/ShareButtons/ShareButtons';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';
import { CodeBlockEnhancer } from '@/components/CodeBlock/CodeBlockEnhancer';
import { MermaidLoader } from '@/components/Mermaid/MermaidLoader';
import { EmbedPlayer } from '@/components/Embed/EmbedPlayer';
import { ReadingTracker } from '@/components/ReadingStats/ReadingTracker';
import { FloatingShareButton } from '@/components/ShareButtons/FloatingShareButton';
import { PostNavigation } from '@/components/PostNavigation/PostNavigation';
import { ImageLightbox } from '@/components/ImageLightbox/ImageLightbox';
import { KeyboardNav } from '@/components/KeyboardNav/KeyboardNav';
import { FloatingTocButton } from '@/components/TableOfContents/FloatingTocButton';
import { BookmarkButton } from '@/components/Bookmark/BookmarkButton';
import { SeriesNav } from '@/components/Series/SeriesNav';
import { findSeriesOf } from '@/lib/series';
import { isPublic } from '@/lib/blog';
import { calloutKindFromColor, CALLOUT_META } from '@/lib/callout';
import { isStale } from '@/lib/articleStatus';
import { relatedPosts, navigationScope } from '@/lib/related';
import { CategoryChip, TagChip } from '@/components/Chip/Chip';
// カレンダー・フォルダの3アイコンのために FontAwesome 一式を読み込んでいたので lucide に統一
import { Calendar, Pencil, MessageCircle } from 'lucide-react';


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
    .replace(/:::/g, '');
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

  // 連載。連載名と順序は Notion のプロパティで持つので、新しい保存先は増やしていない。
  const seriesContext = findSeriesOf(navPosts, blog);
  const nextInSeries = seriesContext
    ? seriesContext.series.posts[seriesContext.index + 1] ?? null
    : null;

  // 関連記事。タグの希少性で重み付けし、同じ連載を最優先する。
  const related = relatedPosts(navPosts, blog);

  // 前後記事は連載内 → 同カテゴリ内 → 全体、の順で範囲を決める。
  // 全記事の公開日順だと React の記事の「次」が無関係なインフラ記事になる。
  const navScope = navigationScope(navPosts, blog);
  
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
    // 色ではなく「意味」でクラスを付け、種別ラベルを添える。
    // 色だけでは何の注意書きなのかが伝わらない。
    const kind = calloutKindFromColor(color);
    const meta = CALLOUT_META[kind];
    const calloutHtml =
      `<div class="callout callout--${kind}">` +
      `<div class="callout__label"><span class="callout__icon" aria-hidden="true">${icon || meta.icon}</span>${meta.label}</div>` +
      `<div class="callout__body">${textHtml}</div>` +
      `</div>`;
    // 置換文字列を関数で渡し、本文中の $& などが置換パターンとして解釈されるのを防ぐ
    processedHtml = processedHtml.replace(
      new RegExp(`<p>${placeholder}</p>|${placeholder}`, 'g'),
      () => calloutHtml
    );
  });

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

  // 読了時間は本文・JSON-LDで同じ値を使う
  const plainText = stripHtml(processedHtml);
  const readingMinutes = Math.max(1, Math.ceil(plainText.length / 600));

  // JSON-LD 構造化データ
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    // 以前は blog.body（Markdown）から記号を数種類だけ削っていたため、
    // リンク記法 `[文字](url)` や表の `|`、リストの `-` が説明文に混ざっていた。
    // レンダリング後のHTMLから起こした平文を使えば、記法は残らない。
    description: (blog.ogpDescription || plainText).replace(/\s+/g, ' ').slice(0, 160).trim(),
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
    wordCount: plainText.length,
    timeRequired: `PT${readingMinutes}M`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${process.env.SITE_URL}/blogs/page/1` },
      // 画面のパンくずと同じ階層にする。以前は画面側にカテゴリが無いのに
      // JSON-LD にも無く、しかも最後がタイトルで両者が食い違っていた。
      ...(blog.category
        ? [{
            '@type': 'ListItem',
            position: 3,
            name: blog.category.name,
            item: `${process.env.SITE_URL}/categories/${blog.category.id}/page/1`,
          }]
        : []),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {/* 最後をタイトルではなくカテゴリにする。
          タイトルは直下の <h1> にあるので重複するうえ、
          モバイルでは max-w-[200px] に切られて13文字程度しか読めなかった。
          カテゴリなら Home > Blog > カテゴリ という階層が正しく伝わり、
          カテゴリ一覧への導線にもなる。 */}
      <BreadcrumbNav
        items={
          blog.category
            ? [
                { label: 'Blog', href: '/blogs/page/1' },
                { label: blog.category.name, current: true },
              ]
            : [{ label: 'Blog', current: true }]
        }
      />
      {/* 本文を先に置き、目次は order で右に回す。
          DOM順を本文優先にすることで、スクリーンリーダーと検索エンジンにも本文が先に届く。
          左に目次があると本文の開始位置が右にずれ、視線の起点が補助情報になっていた。 */}
      <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:p-4'>
        <div className='lg:col-span-2 lg:order-1 content [overflow-x:clip]'>
          {/* 記事本文はランドマークとして辿れるよう article にする */}
          <article>
            {/* タイトル → メタ → 本文 の順にする。
                以前はアイキャッチとメタ情報が先で、記事を開いた瞬間に
                何の記事か分かるまでスクロールが必要だった。 */}
            <header className='px-4'>
              <h1 data-article-title className='text-2xl lg:text-3xl font-bold text-foreground break-words leading-tight'>
                {blog.title}
              </h1>

              <div className='mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm'>
                {blog.category && (
                  <CategoryChip
                    name={blog.category.name}
                    href={`/categories/${blog.category.id}/page/1`}
                    size='sm'
                  />
                )}
                <span className='inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400'>
                  <Calendar className='w-3.5 h-3.5' aria-hidden='true' />
                  <time dateTime={blog.createdAt}>
                    {new Date(blog.createdAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </span>
                {blog.updatedAt !== blog.createdAt && (
                  <time className='text-slate-500 dark:text-slate-400' dateTime={blog.updatedAt}>
                    最終更新 {new Date(blog.updatedAt).toLocaleDateString('ja-JP')}
                  </time>
                )}
                <span className='text-slate-500 dark:text-slate-400'>約{readingMinutes}分で読めます</span>
              </div>

              <div className='mt-4'>
                <BookmarkButton articleId={blogId} title={blog.title} />
              </div>

              {/* アイキャッチは自動生成の抽象画像で内容を説明しないため、
                  高さを抑えて本文までの距離を縮める */}
              <Image
                src={blog.eyecatch?.url || '/images/no_image_generated.png'}
                alt=''
                width={1200}
                height={630}
                sizes='(max-width: 1024px) 100vw, 700px'
                className='mt-6 rounded-lg w-full aspect-[21/9] object-cover'
                priority
              />
            </header>
            {/* 連載の目次は本文より前。途中から流入した読者に、
                これが何回目でどこから読むべきかを最初に伝えるため。 */}
            {seriesContext && (
              <div className='mx-4'>
                <SeriesNav
                  seriesName={seriesContext.series.name}
                  seriesHref={`/series/${encodeURIComponent(seriesContext.series.slug)}`}
                  posts={seriesContext.series.posts.map((p) => ({ id: p.id, title: p.title }))}
                  currentIndex={seriesContext.index}
                />
              </div>
            )}
            <TableOfContents toc={toc} />
            <div className='p-4 znc text-foreground'>
              {/* 技術記事は古くなるのが早い。本文に入る直前で知らせる。
                  日付はタイトルの上にあるが、読み始めると画面外に出てしまう。 */}
              {isStale(blog) && (
                <div className='callout callout--warning'>
                  <div className='callout__label'>
                    <span className='callout__icon' aria-hidden='true'>⚠️</span>
                    情報の鮮度について
                  </div>
                  <div className='callout__body'>
                    この記事は最終更新から1年以上経過しています。内容が古くなっている可能性があります。
                  </div>
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: processedHtml }}></div>
              <CodeBlockEnhancer />
              <MermaidLoader />
              <EmbedPlayer />
              <ImageLightbox />
              <ReadingTracker articleId={blogId} />
            </div>
            {/* 記事末: タグ → シェア/著者/フィードバック → 前後記事 → 関連記事。
                以前はシェアが記事上部と末尾の2箇所にあり、著者カードもリンク先がなかった。 */}
            {blog.tags && blog.tags.length > 0 && (
              <div className='mt-12 mx-4'>
                <h2 className='text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3'>
                  この記事のタグ
                </h2>
                <div className='flex flex-wrap gap-2'>
                  {blog.tags.map((tag) => (
                    <TagChip key={tag.id} name={tag.name} href={`/tags/${tag.id}`} />
                  ))}
                </div>
              </div>
            )}

            <div className='mt-8 mx-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-6'>
              <div className='text-center'>
                <p className='text-sm text-slate-600 dark:text-slate-300 mb-3'>この記事が役に立ったら共有しよう</p>
                <ShareButtons title={blog.title} url={`${process.env.SITE_URL}/blogs/${blog.id}`} />
              </div>
              <div className='border-t border-slate-200 dark:border-slate-700 pt-6'>
                {/* 著者カードはどこにもリンクしておらず、行き止まりになっていた */}
                <Link href='/about' className='group flex items-center gap-4'>
                  <Image
                    src='/images/meow_koki.webp'
                    alt=''
                    width={48}
                    height={48}
                    className='rounded-full object-cover'
                  />
                  <div>
                    <p className='font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                      Koki
                    </p>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>
                      フルスタックエンジニア / React, Next.js, TypeScript
                    </p>
                  </div>
                </Link>
              </div>
              {/* フィードバック導線。以前は text-slate-400 の極小文字で埋もれていた */}
              <div className='flex flex-wrap gap-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm'>
                <a
                  href={`https://github.com/j19015/kt-tech.blog/issues/new?title=${encodeURIComponent('[typo] ' + blog.title)}&body=${encodeURIComponent('記事URL: ' + process.env.SITE_URL + '/blogs/' + blogId + '\n\n誤字・修正内容:\n')}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                >
                  <Pencil className='w-3.5 h-3.5' aria-hidden='true' />
                  誤字・間違いを報告する
                </a>
                {/* 検索結果ページ（多くの場合0件）ではなく、感想を書ける投稿画面に送る */}
                <a
                  href={`https://x.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(`${process.env.SITE_URL}/blogs/${blogId}`)}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                >
                  <MessageCircle className='w-3.5 h-3.5' aria-hidden='true' />
                  Xで感想を書く
                </a>
              </div>
            </div>
            {/* 連載の続きは公開日順の前後記事より優先して出す。
                PostNavigation は公開日順なので、連載の間に別記事を挟むと順序が崩れる。 */}
            {nextInSeries && seriesContext && (
              <div className='mt-10 mx-4'>
                <Link
                  href={`/blogs/${nextInSeries.id}`}
                  className='flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-400 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500 dark:hover:bg-slate-700/50'
                >
                  <span className='min-w-0 flex-1'>
                    <span className='block text-xs text-slate-500 dark:text-slate-400'>
                      連載の次の記事（{seriesContext.index + 2} / {seriesContext.series.posts.length}）
                    </span>
                    <span className='mt-0.5 block font-semibold text-slate-900 dark:text-slate-100'>
                      {nextInSeries.title}
                    </span>
                  </span>
                  <span aria-hidden='true' className='shrink-0 text-slate-400'>→</span>
                </Link>
              </div>
            )}
            <PostNavigation currentId={blogId} allPosts={navScope.posts} scopeLabel={navScope.label} />
            {(() => {
              // j/k のショートカットも前後記事ナビと同じ範囲を辿らせる。
              // 別々に index を計算していたため、表示と挙動がずれていた。
              const idx = navScope.posts.findIndex((p) => p.id === blogId);
              const prevPost = idx >= 0 && idx < navScope.posts.length - 1 ? navScope.posts[idx + 1] : null;
              const nextPost = idx > 0 ? navScope.posts[idx - 1] : null;
              return <KeyboardNav prevUrl={prevPost ? `/blogs/${prevPost.id}` : undefined} nextUrl={nextPost ? `/blogs/${nextPost.id}` : undefined} />;
            })()}
            <RelatedPosts posts={related} currentPostId={blogId} />
          <FloatingTocButton toc={toc} />
          <FloatingShareButton title={blog.title} url={`${process.env.SITE_URL}/blogs/${blog.id}`} />
          </article>
        </div>
        {/* 目次は視覚的には右、DOM順では本文のあと */}
        <div className='lg:col-span-1 lg:order-2 hidden lg:block'>
          <StickyTableOfContents toc={toc} />
        </div>
      </div>
    </>
  );
}

import './globals.css';
// Noto Sans JP はリポジトリに取り込んである（public/fonts/noto-sans-jp）。
// next/font/google はビルドのたびに Google Fonts へ CSS を取りに行き、応答が途中で切れると
// URL の抽出に失敗してビルドごと落ちる。実際にデプロイが1回落ちている
// （run 31674916871 の1回目 / next/font の loader.js:122）。
// 中身・unicode-range・fallback のメトリクスは next/font が出していたものと同一で、
// 更新は node scripts/vendor-noto-sans-jp.mjs で行う。
import '../../styles/noto-sans-jp.css';
import { NOTO_SANS_JP_PRELOAD } from '@/lib/font-preload';
import { Header } from '../../src/components/Header/Header';
import { Footer } from '../../src/components/Footer/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import Favicon from './favicon.ico';
import icon from './icon.png';
import { Metadata } from 'next';
import { ThemeProvider } from './providers/ThemeProvider/theme-provider';
import { ReadingProgress } from '@/components/ReadingProgress/ReadingProgress';
import { ScrollToTop } from '@/components/ScrollToTop/ScrollToTop';
import { WebVitals } from '@/components/WebVitals/WebVitals';
import { ScrollDepthTracker } from '@/components/Analytics/ScrollDepthTracker';
import { OutboundLinkTracker } from '@/components/Analytics/OutboundLinkTracker';

const siteName = 'kt-tech.blog';
const description = 'フルスタックエンジニアKokiの技術ブログ。React, Next.js, TypeScript, AWSなどの最新技術情報と実践的な開発ノウハウを共有。';
const url = 'https://kt-tech.blog';
const author = 'Koki';

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: `${siteName} - 技術と創造性が交わる場所`,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: ['技術ブログ', 'React', 'Next.js', 'TypeScript', 'AWS', 'フルスタックエンジニア', 'Web開発', 'プログラミング'],
  authors: [{ name: author, url: 'https://github.com/j19015' }],
  creator: author,
  publisher: author,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: `${siteName} - 技術と創造性が交わる場所`,
    description,
    url,
    siteName,
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - 技術と創造性が交わる場所`,
    description,
    site: '@tech_koki',
    creator: '@tech_koki',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'IpGviaJMSPR7SL1E-maff_nCUNmuWWBXYRTLcDHZUcw',
  },
  alternates: {
    types: {
      'application/rss+xml': `${url}/feed.xml`,
    },
  },
  other: {
    thumbnail: `${url}${icon.src}`,
    'google-adsense-account': 'ca-pub-9002778711554857',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: siteName,
    url: url,
    description: description,
    author: {
      '@type': 'Person',
      name: author,
      url: 'https://github.com/j19015',
      sameAs: [
        'https://x.com/tech_koki',
        'https://github.com/j19015'
      ]
    },
    publisher: {
      '@type': 'Person',
      name: author
    },
    inLanguage: 'ja',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        // サイト内の検索フォームは全て `text` を送る。ここだけ `keyword` になっており、
        // 検索エンジン経由で来た人は空の検索ページに着地していた。
        urlTemplate: `${url}/searches?text={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    // next-themes は hydration 前にインラインスクリプトで <html> に class を足すため、
    // suppressHydrationWarning がないと毎回 hydration mismatch の警告が出る
    <html lang='ja' suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        {/* 日本語のサブセットは unicode-range 任せで必要な分だけ読まれる。
            最初に要る latin だけ先に取りに行かせる（next/font の subsets: ['latin'] と同じ）。
            フォントは同一オリジンでも CORS で取りに行くので crossOrigin が要る */}
        <link
          rel='preload'
          href={NOTO_SANS_JP_PRELOAD}
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
        <link rel='manifest' href='/manifest.json' />
        {/* 1色固定だとライトモードでもブラウザのバーが暗いままになる。
            OSの設定に合わせて出し分ける */}
        <meta name='theme-color' media='(prefers-color-scheme: light)' content='#ffffff' />
        <meta name='theme-color' media='(prefers-color-scheme: dark)' content='#0f172a' />
        <meta name='google-adsense-account' content='ca-pub-9002778711554857'></meta>
        {/* SITE_URL が未設定だと "undefined/favicon.ico" という壊れたURLを出していた。
            metadata 側と同じ既定値にそろえる */}
        <meta name='thumbnail' content={`${url}${Favicon.src}`}></meta>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel='dns-prefetch' href='https://pub-9d03846db4364486bb0806774184931a.r2.dev' />
        <link rel='preconnect' href='https://pub-9d03846db4364486bb0806774184931a.r2.dev' crossOrigin='anonymous' />
        <link rel='dns-prefetch' href='https://www.googletagmanager.com' />
        <link rel='dns-prefetch' href='https://www.google.com' />
        {/* JS無効時、スクロール連動で表示する要素が非表示のままにならないようにする */}
        <noscript>
          <style>{'.fade-in-pending{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </head>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <a href='#main-content' className='sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-white focus:rounded-lg'>
            メインコンテンツへスキップ
          </a>
          <ReadingProgress />
          <Header />
          <main id='main-content' className='animate-fadeIn'>
            {children}
          </main>
          <Footer />
          <ScrollToTop />
          <WebVitals />
          <ScrollDepthTracker />
          <OutboundLinkTracker />
        </ThemeProvider>
      </body>
    </html>
  );
}

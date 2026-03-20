import './globals.css';
import { Noto_Sans_JP } from 'next/font/google';
import { Header } from '../../src/components/Header/Header';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
});
import { Footer } from '../../src/components/Footer/Footer';
import { config } from '@fortawesome/fontawesome-svg-core';
import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Favicon from './favicon.ico';
import icon from './icon.png';
import { Metadata } from 'next';
import { ThemeProvider } from './providers/ThemeProvider/theme-provider';
import { ReadingProgress } from '@/components/ReadingProgress/ReadingProgress';
import { ScrollToTop } from '@/components/ScrollToTop/ScrollToTop';
config.autoAddCss = false;

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
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - 技術と創造性が交わる場所`,
    description,
    site: '@meow_koki',
    creator: '@meow_koki',
    images: ['/opengraph-image.png'],
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
    canonical: url,
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
        'https://x.com/meow_koki',
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
        urlTemplate: `${url}/searches?keyword={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang='ja' className={notoSansJP.variable}>
      <head>
        <GoogleAnalytics />
        <link rel='manifest' href='/manifest.json' />
        <meta name='theme-color' content='#0f172a' />
        <meta name='google-adsense-account' content='ca-pub-9002778711554857'></meta>
        <meta name='thumbnail' content={`${process.env.SITE_URL}${Favicon.src}`}></meta>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
        </ThemeProvider>
      </body>
    </html>
  );
}

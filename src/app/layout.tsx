import './globals.css';
import { Header } from '../../src/components/Header/Header';
import { Footer } from '../../src/components/Footer/Footer';
import { config } from '@fortawesome/fontawesome-svg-core';
import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Sidebar from '@/components/SIdebar';
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
    site: '@tech_koki',
    creator: '@tech_koki',
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
        'https://twitter.com/tech_koki',
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
    <html lang='ja'>
      <head>
        <GoogleAnalytics />
        <meta name='google-adsense-account' content='ca-pub-9002778711554857'></meta>
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap'
          rel='stylesheet'
        ></link>
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
          <ReadingProgress />
          <Header />
          <main>
            <div className='m-auto mt-5 rounded-lg'>
              <div className='lg:grid grid-cols-2 lg:grid-cols-3 gap-4'>
                <div className='lg:col-span-2 col-span-3'>{children}</div>
                <div className='lg:col-span-1 lg:block mt-10 lg:mt-0'>
                  <Sidebar />
                </div>
              </div>
            </div>
          </main>
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}

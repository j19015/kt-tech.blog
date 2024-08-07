import './globals.css';
import { Header } from '../../src/components/Header/Header';
import { Footer } from '../../src/components/Footer/Footer';
import { config } from '@fortawesome/fontawesome-svg-core';
import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Sidebar from '@/components/SIdebar/Sidebar';
config.autoAddCss = false;

const siteName = 'kt-tech.blog';
const description = 'ktの技術ブログサイトになります。';
const url = 'https://kt-tech.blog';

export const metadata = {
  title: {
    default: siteName,
    /** `next-seo`の`titleTemplate`に相当する機能 */
    template: `%s - ${siteName}`,
  },
  description,
  openGraph: {
    title: siteName,
    description,
    url,
    siteName,
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description,
    site: '@tech_koki',
    creator: '@tech_koki',
  },
  verification: {
    google: 'IpGviaJMSPR7SL1E-maff_nCUNmuWWBXYRTLcDHZUcw',
  },
  alternates: {
    alternate: url,
    canonical: url,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <head>
        <GoogleAnalytics />
        <meta name='google-adsense-account' content='ca-pub-9002778711554857'></meta>
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap'
          rel='stylesheet'
        ></link>
        <meta name='thumbnail' content='./icon.png'></meta>
      </head>
      <body>
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
      </body>
    </html>
  );
}

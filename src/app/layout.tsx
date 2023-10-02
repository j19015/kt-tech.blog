import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '../../src/components/Header/Header'
import { Footer } from '../../src/components/Footer/Footer'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false


const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'kt-tech.blog',
//   description: 'ktの技術ブログサイトになります。',
// }

const siteName= 'kt-tech.blog';
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


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
      <script src="//cdn.iframe.ly/embed.js"></script>
      </head>
      <body className="bg-gray-900" >
        <div className='bg-gray-900'>
          <Header/>
          <div className='m-1 mt-5 rounded-lg'>
            {children}
          </div>
          <Footer/>
        </div>
      </body>
    </html>
  )
}

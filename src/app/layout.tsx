import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '../../src/components/Header/Header'
import { Footer } from '../../src/components/Footer/Footer'


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
      <body className={inter.className}>
        <div className='bg-gray-100'>
          <Header/>
          <div className='m-4 rounded-lg bg-gray-200'>
            {children}
          </div>
          <Footer/>
        </div>
      </body>
    </html>
  )
}

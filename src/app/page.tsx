import Link from 'next/link';
import { getList } from '../../libs/notion';
import { Blog } from '../../libs/notion';
import Index from '@/components/Index/Index';
import HeroSection from '@/components/HeroSection/HeroSection';

const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';
const description = '実践的な技術記事とエンジニアリングの知見を発信。React, Next.js, TypeScript, Cloudflare, AIなどのモダン技術を中心に。';

export const metadata = {
  title: 'kt-tech.blog - 技術と創造性が交わる場所',
  description,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'kt-tech.blog - 技術と創造性が交わる場所',
    description,
    locale: 'ja_JP',
    type: 'website',
    url: siteUrl,
    siteName: 'kt-tech.blog',
    images: [
      {
        url: `${siteUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'kt-tech.blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'kt-tech.blog - 技術と創造性が交わる場所',
    description,
    site: '@tech_koki',
    creator: '@tech_koki',
    images: [
      {
        url: `${siteUrl}/opengraph-image.png`,
        alt: 'kt-tech.blog',
      },
    ],
  },
};

export default async function StaticPage() {
  const { contents } = await getList();
  //console.log(contents);

  if (!contents || contents.length === 0) {
    return <h1>No Contents</h1>;
  }

  // contentsをBlogの配列として定義
  const latestBlogs: Blog[] = contents
    .filter((article) => article.category?.name !== 'PF')
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'kt-tech.blog',
    url: siteUrl,
    description,
    author: {
      '@type': 'Person',
      name: 'Koki',
      url: `${siteUrl}/about`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/searches?text={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSection />
      <Index contents={latestBlogs} />
      <div className='mt-12 text-center'>
        <Link
          href='/blogs/page/1'
          className='text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-medium'
        >
          すべての記事を見る →
        </Link>
      </div>
    </>
  );
}

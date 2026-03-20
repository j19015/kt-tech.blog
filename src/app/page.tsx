import Link from 'next/link';
import Image from 'next/image';
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
    site: '@meow_koki',
    creator: '@meow_koki',
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
    .slice(0, 6);

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

      {/* フィーチャー記事 */}
      {latestBlogs[0] && (
        <div className='max-w-3xl mx-auto px-4 mb-8'>
          <Link href={`/blogs/${latestBlogs[0].id}`} className='group block'>
            <div className='relative aspect-[2/1] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800'>
              <Image
                src={latestBlogs[0].eyecatch?.url || '/images/no_image_generated.png'}
                alt={latestBlogs[0].title}
                fill
                className='object-cover group-hover:scale-105 transition-transform duration-500'
                priority
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
              <div className='absolute bottom-0 left-0 right-0 p-6'>
                {latestBlogs[0].category && (
                  <span className='inline-block px-2.5 py-1 mb-3 text-xs font-medium bg-white/20 backdrop-blur-sm text-white rounded-full'>
                    {latestBlogs[0].category.name}
                  </span>
                )}
                <h2 className='text-xl sm:text-2xl font-bold text-white leading-snug group-hover:text-blue-200 transition-colors'>
                  {latestBlogs[0].title}
                </h2>
                <p className='text-sm text-white/60 mt-2'>
                  {new Date(latestBlogs[0].createdAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* 残りの記事 */}
      <Index contents={latestBlogs.slice(1)} />
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

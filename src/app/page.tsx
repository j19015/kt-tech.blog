import Link from 'next/link';
import Image from 'next/image';
import { getList, getCategoryList } from '../../libs/notion';
import { Blog } from '../../libs/notion';
import Index from '@/components/Index/Index';
import HeroSection from '@/components/HeroSection/HeroSection';
import { ArrowRight, FolderOpen } from 'lucide-react';

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
  const [{ contents }, categoryData] = await Promise.all([
    getList(),
    getCategoryList(),
  ]);

  if (!contents || contents.length === 0) {
    return <h1>No Contents</h1>;
  }

  const allBlogs: Blog[] = contents.filter((article) => article.category?.name !== 'PF');
  const latestBlogs = allBlogs.slice(0, 9);
  const categories = categoryData.contents.filter(c => c.name !== 'PF');

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

      <div className='max-w-6xl mx-auto px-4'>
        {/* フィーチャー + サブ記事 グリッド */}
        <section className='mb-12'>
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-4'>
            {/* フィーチャー（大） */}
            {latestBlogs[0] && (
              <Link href={`/blogs/${latestBlogs[0].id}`} className='lg:col-span-3 group block'>
                <div className='relative aspect-[16/9] lg:aspect-auto lg:h-full min-h-[280px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800'>
                  <Image
                    src={latestBlogs[0].eyecatch?.url || '/images/no_image_generated.png'}
                    alt={latestBlogs[0].title}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-500'
                    priority
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent' />
                  <div className='absolute bottom-0 left-0 right-0 p-6 lg:p-8'>
                    {latestBlogs[0].category && (
                      <span className='inline-block px-3 py-1 mb-3 text-sm font-medium bg-white/20 backdrop-blur-sm text-white rounded-full'>
                        {latestBlogs[0].category.name}
                      </span>
                    )}
                    <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight group-hover:text-blue-200 transition-colors line-clamp-2'>
                      {latestBlogs[0].title}
                    </h2>
                    <p className='text-sm text-white/50 mt-3'>
                      {new Date(latestBlogs[0].createdAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* サブ記事2件（右縦並び） */}
            <div className='lg:col-span-2 flex flex-col gap-4'>
              {latestBlogs.slice(1, 3).map((blog) => (
                <Link key={blog.id} href={`/blogs/${blog.id}`} className='group block flex-1'>
                  <div className='relative h-full min-h-[160px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800'>
                    <Image
                      src={blog.eyecatch?.url || '/images/no_image_generated.png'}
                      alt={blog.title}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-500'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10' />
                    <div className='absolute bottom-0 left-0 right-0 p-5'>
                      {blog.category && (
                        <span className='inline-block px-2.5 py-0.5 mb-2 text-xs font-medium bg-white/20 backdrop-blur-sm text-white rounded-full'>
                          {blog.category.name}
                        </span>
                      )}
                      <h3 className='text-base font-bold text-white leading-snug group-hover:text-blue-200 transition-colors line-clamp-2'>
                        {blog.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 最新記事セクション */}
        <section className='mb-12'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-lg font-bold text-slate-900 dark:text-slate-100'>最新記事</h2>
            <Link href='/blogs/page/1' className='text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 transition-colors'>
              すべて見る <ArrowRight className='w-3.5 h-3.5' />
            </Link>
          </div>
          <Index contents={latestBlogs.slice(3)} />
        </section>

        {/* カテゴリセクション */}
        <section className='mb-12'>
          <h2 className='text-lg font-bold text-slate-900 dark:text-slate-100 mb-4'>カテゴリ</h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
            {categories.map((cat) => {
              const count = allBlogs.filter(b => b.category?.id === cat.id).length;
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}/page/1`}
                  className='group flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all'
                >
                  <FolderOpen className='w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors' />
                  <div className='min-w-0'>
                    <p className='text-sm font-medium text-slate-700 dark:text-slate-300 truncate'>{cat.name}</p>
                    <p className='text-xs text-slate-400 dark:text-slate-500'>{count}記事</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

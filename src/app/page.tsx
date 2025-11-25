import Link from 'next/link';
import { getList } from '../../libs/microcms';
import { Blog } from '../../libs/microcms';
import Index from '@/components/Index/Index';
import HeroSection from '@/components/HeroSection/HeroSection';

export const metadata = {
  title: 'TOPページ',
  description:
    '基本的には技術記事を投稿しています。たまに勉強会への感想や最近の技術を触ってみた感想なども投稿します。',
  openGraph: {
    title: 'TOPページ',
    description:
      '基本的には技術記事を投稿しています。たまに勉強会への感想や最近の技術を触ってみた感想なども投稿します。',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: `${process.env.SITE_URL}/opengraph-image.png`,
        alt: 'kt-tech.blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TOPページ',
    description:
      '基本的には技術記事を投稿しています。たまに勉強会への感想や最近の技術を触ってみた感想なども投稿します。',
    site: '@tech_koki',
    creator: '@tech_koki',
    images: [
      {
        url: `${process.env.SITE_URL}/opengraph-image.png`,
        alt: 'kt-tech.blog',
      },
    ],
  },
  other: {
    thumbnail: '/opengraph-image.png',
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

  return (
    <>
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

import Link from 'next/link';
import { getList } from '../../libs/microcms';
import { Blog } from '../../libs/microcms';
import Index from '@/components/Index/Index';

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
};

export default async function StaticPage() {
  const { contents } = await getList();

  const latestBlogs: Blog[] = contents.slice(0, 4);

  const welcomeStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '20px 0',
    animation: 'fadeInSlideIn 2s ease-in-out',
  };

  const keyframes = `
  @keyframes fadeInSlideIn {
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  `;

  return (
    <>
      <div style={welcomeStyle} className='top p-3'>
        <style>{keyframes}</style>
        <h1 className='text-xl lg:text-2xl'>kt-tech.blog にようこそ</h1>
      </div>
      <Index contents={latestBlogs} />
      <div className='mt-8 flex justify-center'>
        <Link
          href='/blogs/page/1'
          className='transition duration-300 ease-in-out font-semibold py-2 px-4 border-b-4 rounded shadow-md theme-button'
        >
          すべての記事を見る
        </Link>
      </div>
    </>
  );
}

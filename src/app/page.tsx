import Link from 'next/link';
import { getList } from '../../libs/microcms';
import Sidebar from '@/components/SIdebar/Sidebar'; // Sidebarのimportを修正
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TOPページ',
    description:
      '基本的には技術記事を投稿しています。たまに勉強会への感想や最近の技術を触ってみた感想なども投稿します。',
    site: '@tech_koki',
    creator: '@tech_koki',
  },
  other: {
    thumbnail: '/opengraph-image.png',
  },
};

export default async function StaticPage() {
  const { contents } = await getList();
  //console.log(contents);

  // ページの生成された時間を取得
  const time = new Date().toString();

  if (!contents || contents.length === 0) {
    return <h1>No Contents</h1>;
  }

  // contentsをBlogの配列として定義
  const latestBlogs: Blog[] = contents
    .filter((article) => article.category?.name !== 'PF')
    .slice(0, 4);

  // スタイル定義
  const welcomeStyle: React.CSSProperties = {
    fontSize: '2rem', // フォントサイズを大きく
    fontWeight: 'bold', // 太字
    textAlign: 'center', // 中央寄せ
    margin: '20px 0', // 上下の余白
    animation: 'fadeIn 2s', // アニメーション効果
  };

  // アニメーション用のキーフレーム（CSS）
  const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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

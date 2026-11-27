import Link from 'next/link';
import type { Metadata } from 'next';
import { Home, BookOpen, Search } from 'lucide-react';

// Edge Runtime ではヘッダーを先に送るので、ページの中で notFound() を呼んでもステータスは 200 のまま。
// せめて noindex を付けて、「見つかりません」のページが検索結果に載らないようにする
export const metadata: Metadata = {
  title: 'ページが見つかりません',
  robots: { index: false, follow: false },
};

export default function Custom404() {
  return (
    <div className='min-h-[80vh] flex items-center justify-center p-4'>
      <div className='max-w-lg w-full text-center space-y-8'>
        <div className='text-8xl font-extrabold text-slate-200 dark:text-slate-800'>
          404
        </div>

        <div className='space-y-3'>
          <h1 className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
            ページが見つかりません
          </h1>
          <p className='text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto'>
            お探しのページは移動したか、削除された可能性があります。
          </p>
        </div>

        {/* 検索 */}
        <form action='/searches' method='get' className='max-w-xs mx-auto'>
          <div className='flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden'>
            <input
              type='text'
              name='text'
              placeholder='記事を検索...'
              className='flex-1 px-4 py-2.5 text-base sm:text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none'
            />
            <button type='submit' className='px-4 py-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'>
              <Search className='w-4 h-4' />
            </button>
          </div>
        </form>

        {/* リンク */}
        <div className='flex justify-center gap-6 pt-2'>
          <Link
            href='/'
            className='flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
          >
            <Home className='w-4 h-4' />
            ホーム
          </Link>
          <Link
            href='/blogs/page/1'
            className='flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
          >
            <BookOpen className='w-4 h-4' />
            記事一覧
          </Link>
        </div>
      </div>
    </div>
  );
}

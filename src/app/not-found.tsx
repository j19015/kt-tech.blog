import Link from 'next/link';

export default function Custom404() {
  return (
    <div className='min-h-[80vh] flex items-center justify-center p-4'>
      <div className='max-w-2xl w-full text-center space-y-8'>
        <div className='text-8xl md:text-9xl font-bold text-slate-900 dark:text-slate-100'>
          404
        </div>

        <div className='space-y-4'>
          <h1 className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100'>
            ページが見つかりません
          </h1>
          <p className='text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto'>
            お探しのページは移動したか、削除された可能性があります。
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
          <Link
            href='/'
            className='px-6 py-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
          >
            ホームに戻る
          </Link>
          <Link
            href='/blogs/page/1'
            className='px-6 py-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
          >
            ブログ一覧を見る
          </Link>
        </div>
      </div>
    </div>
  );
}
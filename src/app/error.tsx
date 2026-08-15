'use client';
import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='min-h-[80vh] flex items-center justify-center p-4'>
      <div className='max-w-2xl w-full text-center space-y-8'>
        <div className='text-7xl md:text-8xl font-bold text-slate-300 dark:text-slate-700'>
          500
        </div>

        <div className='space-y-4'>
          <h1 className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100'>
            エラーが発生しました
          </h1>
          <p className='text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto'>
            一時的な問題が発生しています。しばらく経ってから再度お試しください。
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
          <button
            onClick={reset}
            className='px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors font-medium'
          >
            もう一度試す
          </button>
          <Link
            href='/'
            className='px-6 py-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

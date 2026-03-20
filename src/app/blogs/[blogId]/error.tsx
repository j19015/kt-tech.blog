'use client';
import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='min-h-[60vh] flex items-center justify-center p-4'>
      <div className='max-w-lg w-full text-center space-y-6'>
        <div className='text-5xl'>😵</div>
        <h1 className='text-xl font-bold text-slate-900 dark:text-slate-100'>
          記事の読み込みに失敗しました
        </h1>
        <p className='text-sm text-slate-600 dark:text-slate-400'>
          一時的な問題の可能性があります。再度お試しください。
        </p>
        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          <button
            onClick={reset}
            className='px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors text-sm font-medium'
          >
            再読み込み
          </button>
          <Link
            href='/blogs/page/1'
            className='px-5 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
          >
            記事一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

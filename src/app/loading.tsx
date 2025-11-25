export default function Loading() {
  return (
    <div className='flex items-center justify-center min-h-[60vh]'>
      <div className='text-center'>
        <div className='w-8 h-8 border-2 border-slate-200 dark:border-slate-700 border-t-slate-900 dark:border-t-slate-100 rounded-full animate-spin mx-auto mb-4'></div>
        <p className='text-sm text-slate-500 dark:text-slate-500'>読み込み中...</p>
      </div>
    </div>
  );
}
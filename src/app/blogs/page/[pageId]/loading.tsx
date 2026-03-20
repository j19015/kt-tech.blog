export default function Loading() {
  return (
    <div className='max-w-3xl mx-auto px-4 animate-pulse'>
      <div className='space-y-4'>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className='flex gap-5 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50'>
            <div className='flex-shrink-0 w-28 sm:w-36 aspect-[1200/630] rounded-lg bg-slate-200 dark:bg-slate-700'></div>
            <div className='flex-1 flex flex-col justify-center gap-2.5'>
              <div className='h-5 bg-slate-200 dark:bg-slate-700 rounded w-[85%]'></div>
              <div className='h-5 bg-slate-200 dark:bg-slate-700 rounded w-[60%]'></div>
              <div className='flex gap-2'>
                <div className='h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded'></div>
                <div className='h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded-full'></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

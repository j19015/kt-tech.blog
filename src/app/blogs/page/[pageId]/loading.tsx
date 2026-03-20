export default function Loading() {
  return (
    <div className='animate-pulse'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4'>
        {[...Array(6)].map((_, i) => (
          <div key={i} className='rounded-lg shadow-lg overflow-hidden'>
            <div className='w-full aspect-[16/9] bg-slate-200 dark:bg-slate-700'></div>
            <div className='p-4 space-y-3'>
              <div className='h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4'></div>
              <div className='h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2'></div>
              <div className='flex gap-2'>
                <div className='h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full'></div>
                <div className='h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full'></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className='grid grid-cols-2 lg:grid-cols-3 lg:p-4 animate-pulse'>
      <div className='lg:col-span-1 p-5 pl-7 pt-0 hidden lg:block'>
        <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 mb-4'></div>
        <div className='space-y-3'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='h-3 bg-slate-200 dark:bg-slate-700 rounded' style={{ width: `${60 + Math.random() * 40}%` }}></div>
          ))}
        </div>
      </div>
      <div className='lg:col-span-2 col-span-3 lg:py-5 lg:px-3 rounded-lg shadow-lg'>
        <div className='p-4'>
          <div className='w-full aspect-[16/9] bg-slate-200 dark:bg-slate-700 rounded-lg'></div>
        </div>
        <div className='p-6 space-y-4'>
          <div className='flex gap-3'>
            <div className='h-7 w-24 bg-slate-200 dark:bg-slate-700 rounded-full'></div>
            <div className='h-7 w-32 bg-slate-200 dark:bg-slate-700 rounded-full'></div>
          </div>
          <div className='h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mt-4'></div>
          <div className='space-y-3 mt-8'>
            {[...Array(8)].map((_, i) => (
              <div key={i} className='h-4 bg-slate-200 dark:bg-slate-700 rounded' style={{ width: `${70 + Math.random() * 30}%` }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

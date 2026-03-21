export default function Loading() {
  return (
    <div className='m-auto mt-5 rounded-lg'>
      <div className='lg:grid lg:grid-cols-3 gap-4'>
        {/* Main content skeleton */}
        <div className='lg:col-span-2 animate-pulse'>
          {/* Breadcrumb skeleton */}
          <div className='flex items-center gap-2 mb-6 px-1'>
            <div className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded'></div>
            <div className='h-4 w-3 bg-slate-200 dark:bg-slate-700 rounded'></div>
            <div className='h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded'></div>
          </div>
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

        {/* Sidebar skeleton */}
        <div className='lg:col-span-1 mt-10 lg:mt-0 border-t lg:border-t-0 border-slate-200 dark:border-slate-700 pt-8 lg:pt-0 animate-pulse'>
          <div className='p-4 space-y-6'>
            <div className='border border-slate-200 dark:border-slate-700 rounded-lg p-4'>
              <div className='h-10 bg-slate-200 dark:bg-slate-700 rounded'></div>
            </div>
            <div className='border border-slate-200 dark:border-slate-700 rounded-lg p-4'>
              <div className='h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-4'></div>
              <div className='space-y-3'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className='h-10 bg-slate-200 dark:bg-slate-700 rounded'></div>
                ))}
              </div>
            </div>
            <div className='border border-slate-200 dark:border-slate-700 rounded-lg p-4'>
              <div className='h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-4'></div>
              <div className='space-y-2'>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className='h-8 bg-slate-200 dark:bg-slate-700 rounded'></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

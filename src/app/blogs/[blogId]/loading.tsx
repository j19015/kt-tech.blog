export default function Loading() {
  return (
    <div className='animate-pulse'>
      {/* Breadcrumb skeleton */}
      <div className='flex items-center gap-2 px-4 pt-4 pb-2'>
        <div className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded'></div>
        <div className='h-4 w-3 bg-slate-200 dark:bg-slate-700 rounded'></div>
        <div className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded'></div>
        <div className='h-4 w-3 bg-slate-200 dark:bg-slate-700 rounded'></div>
        <div className='h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded'></div>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 lg:p-4'>
        {/* TOC skeleton - desktop only */}
        <div className='lg:col-span-1 p-5 pl-7 pt-0 hidden lg:block'>
          <div className='sticky top-20 p-4 border border-slate-200 dark:border-slate-700 rounded-lg'>
            <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-4'></div>
            <div className='space-y-3'>
              <div className='h-3 bg-slate-200 dark:bg-slate-700 rounded w-[70%]'></div>
              <div className='h-3 bg-slate-200 dark:bg-slate-700 rounded w-[85%]'></div>
              <div className='h-3 bg-slate-200 dark:bg-slate-700 rounded w-[60%]'></div>
              <div className='h-3 bg-slate-200 dark:bg-slate-700 rounded w-[90%]'></div>
              <div className='h-3 bg-slate-200 dark:bg-slate-700 rounded w-[55%]'></div>
            </div>
          </div>
        </div>

        {/* Main content skeleton */}
        <div className='lg:col-span-2 col-span-1 lg:py-5 lg:px-3'>
          {/* Eyecatch */}
          <div className='p-4'>
            <div className='w-full aspect-[16/9] bg-slate-200 dark:bg-slate-700 rounded-lg'></div>
          </div>

          {/* Meta */}
          <div className='p-6 space-y-4'>
            <div className='flex gap-3'>
              <div className='h-7 w-24 bg-slate-200 dark:bg-slate-700 rounded-full'></div>
              <div className='h-7 w-32 bg-slate-200 dark:bg-slate-700 rounded-full'></div>
            </div>

            {/* Title */}
            <div className='h-8 bg-slate-200 dark:bg-slate-700 rounded w-[80%]'></div>

            {/* Body lines */}
            <div className='space-y-3 mt-8'>
              <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-full'></div>
              <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-[95%]'></div>
              <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-[88%]'></div>
              <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-[92%]'></div>
              <div className='h-4 bg-slate-100 dark:bg-slate-800 rounded w-0'></div>
              <div className='h-6 bg-slate-200 dark:bg-slate-700 rounded w-[40%]'></div>
              <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-full'></div>
              <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-[85%]'></div>
              <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-[78%]'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

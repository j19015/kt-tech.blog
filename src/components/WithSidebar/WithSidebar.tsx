import Sidebar from '@/components/SIdebar';

export const WithSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='m-auto mt-5 rounded-lg'>
      <div className='lg:grid lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-2'>{children}</div>
        <div className='lg:col-span-1 mt-10 lg:mt-0 border-t lg:border-t-0 border-slate-200 dark:border-slate-700 pt-8 lg:pt-0'>
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

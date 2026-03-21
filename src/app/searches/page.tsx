import { Suspense } from 'react';
import ClientIndex from './client_index';
import { getList } from '../../../libs/notion';
import { Metadata } from 'next';
import { WithSidebar } from '@/components/WithSidebar/WithSidebar';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function StaticPage() {
  const { contents } = await getList();

  return (
    <WithSidebar>
      <Suspense fallback={<div className='animate-pulse space-y-4 max-w-3xl mx-auto px-4'>{[1,2,3].map(i => <div key={i} className='h-[140px] bg-slate-200 dark:bg-slate-700 rounded-xl' />)}</div>}>
        <ClientIndex contents={contents} />
      </Suspense>
    </WithSidebar>
  );
}

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
      <Suspense fallback={<div>Loading...</div>}>
        <ClientIndex contents={contents} />
      </Suspense>
    </WithSidebar>
  );
}

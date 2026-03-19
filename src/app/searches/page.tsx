import { Suspense } from 'react';
import ClientIndex from './client_index';
import { getList } from '../../../libs/notion';

export default async function StaticPage() {
  const { contents } = await getList();

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='mt-1 w-full col-span-2'>
          <Suspense fallback={<div>Loading...</div>}>
            <ClientIndex contents={contents} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

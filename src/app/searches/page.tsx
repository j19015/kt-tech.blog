import Sidebar from '@/components/SIdebar/Sidebar'; // Sidebarのimportを修正
import ClientIndex from './client_index';
import { getList } from '../../../libs/microcms';

export default async function StaticPage() {
  const { contents } = await getList();

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='mt-1 w-full col-span-2'>
          <ClientIndex contents={contents} />
        </div>
      </div>
    </>
  );
}

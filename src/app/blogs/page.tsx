import { getList } from '../../../libs/microcms';
import Index from '@/components/Index/Index';
import Sidebar from '@/components/SIdebar/Sidebar'; // Sidebarのimportを修正
import Title from '@/components/Title/Title';

export default async function StaticPage() {
  const { contents } = await getList();
  //console.log(contents);

  if (!contents || contents.length === 0) {
    return <h1>No Contents</h1>;
  }

  return (
    <>
      <div className='text-center mt-1 w-full col-span-2'>
        <Title title={`Blog`} />
      </div>
      <Index contents={contents} />
    </>
  );
}

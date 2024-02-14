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
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 pb-8'>
        {' '}
        {/* グリッドを設定 */}
        <div className='lg:col-span-2'>
          {' '}
          {/* 通常の画面サイズでは2列分のスペースを占有 */}
          <div className='text-center mt-1 w-full col-span-2'>
            <Title title={`Blog`} />
          </div>
          <Index contents={contents} />
        </div>
        <div className='lg:col-span-1'>
          {' '}
          {/* 通常の画面サイズでは1列分のスペースを占有 */}
          <Sidebar />
        </div>
      </div>
    </>
  );
}

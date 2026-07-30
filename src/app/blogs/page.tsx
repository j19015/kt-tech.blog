import { getList } from '../../../libs/notion';
import Index from '@/components/Index/Index';
import Sidebar from '@/components/SIdebar/Sidebar'; // Sidebarのimportを修正
import Title from '@/components/Title/Title';

// Home と同様、ビルド時プリレンダだと新記事がデプロイまで出ないため Edge Runtime にする。
// 鮮度は next.config.js の /blogs/:path* の Cache-Control で制御。
export const runtime = 'edge';

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

import { notFound } from 'next/navigation';
import { getList, getCategoryList, getCategoryDetail } from '../../../../libs/microcms';
import Sidebar from '@/components/SIdebar/Sidebar';
import Index from '@/components/Index/Index';
import Title from '@/components/Title/Title';

export async function generateStaticParams() {
  const { contents } = await getCategoryList();

  const paths = contents.map((category) => {
    return {
      categoryId: category.id,
    };
  });
  return [...paths];
}

export default async function StaticDetailPage({
  params: { categoryId },
}: {
  params: { categoryId: string };
}) {
  //リスト一覧を取得
  const { contents } = await getList();

  //カテゴリの詳細情報を取得
  const category_show = await getCategoryDetail(categoryId);

  //リストを指定のタグで絞り込み
  const filteredContents = contents.filter((blog) => blog.category?.id === categoryId);

  if (!filteredContents) {
    notFound();
  }

  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        {' '}
        {/* グリッドを設定 */}
        <div className='lg:col-span-2'>
          {' '}
          {/* 通常の画面サイズでは2列分のスペースを占有 */}
          <div className='text-center mt-1 w-full col-span-2'>
            <Title title={category_show.name} />
          </div>
          <Index contents={filteredContents} />
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

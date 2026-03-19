import { notFound } from 'next/navigation';
import { getList, getCategoryList, getCategoryDetail } from '../../../../libs/notion';
import Index from '@/components/Index/Index';
import Title from '@/components/Title/Title';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';


export const runtime = 'edge';
export default async function StaticDetailPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  //リスト一覧とカテゴリ詳細を並列取得
  const [{ contents }, category_show] = await Promise.all([
    getList(),
    getCategoryDetail(categoryId),
  ]);

  //リストを指定のタグで絞り込み
  const filteredContents = contents.filter((blog) => blog.category?.id === decodeURIComponent(categoryId));

  if (!filteredContents) {
    notFound();
  }

  return (
    <>
      <BreadcrumbNav 
        items={[
          { label: 'Category', href: '/categories' },
          { label: category_show.name, current: true }
        ]} 
      />
      <div className='text-center mt-1 w-full col-span-2'>
        <Title title={category_show.name} />
      </div>
      <Index contents={filteredContents} />
    </>
  );
}

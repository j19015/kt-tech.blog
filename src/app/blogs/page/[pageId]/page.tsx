import { notFound } from 'next/navigation';
import { getList } from '../../../../../libs/notion';
import Sidebar from '@/components/SIdebar/Sidebar'; // Sidebarのimportを修正
import Paginate from '@/components/Pagination/Paginate';
import Index from '@/components/Index/Index';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';

const ITEMS_PER_PAGE = 6; // 1ページあたりのアイテム数

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export default async function StaticPaginationPage({
  params: { pageId },
}: {
  params: { pageId: string };
}) {
  if (!pageId) {
    notFound();
  }

  // ページ番号からコンテンツの範囲を計算
  const currentPage = parseInt(pageId, 10);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // コンテンツを取得
  try {
    const { contents } = await getList();

    const contentSlice = contents
      .filter((article) => article.category?.name !== 'PF')
      .slice(startIndex, endIndex);

    // コンテンツを表示するロジックをここに追加

    return (
      <>
        <BreadcrumbNav 
          items={[
            { label: 'Blog', current: true }
          ]} 
        />
        <Index contents={contentSlice} />
        <Paginate
          currentPage={Number(pageId)}
          totalPage={Math.ceil(contents.length / ITEMS_PER_PAGE)}
          kind={`/blogs`}
        ></Paginate>
      </>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return (
      <>
        <p>Error fetching data.</p>
      </>
    );
  }
}

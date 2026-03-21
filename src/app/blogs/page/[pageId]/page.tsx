import { notFound } from 'next/navigation';
import { getList } from '../../../../../libs/notion';
import Paginate from '@/components/Pagination/Paginate';
import Index from '@/components/Index/Index';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';
import { WithSidebar } from '@/components/WithSidebar/WithSidebar';
import { Metadata } from 'next';

const ITEMS_PER_PAGE = 6;
const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ pageId: string }> }): Promise<Metadata> {
  const { pageId } = await params;
  const currentPage = parseInt(pageId, 10);
  const { contents } = await getList();
  const totalPages = Math.ceil(contents.filter(a => a.category?.name !== 'PF').length / ITEMS_PER_PAGE);

  const alternates: any = { canonical: `${siteUrl}/blogs/page/${currentPage}` };
  const other: Record<string, string> = {};
  if (currentPage > 1) other['prev'] = `${siteUrl}/blogs/page/${currentPage - 1}`;
  if (currentPage < totalPages) other['next'] = `${siteUrl}/blogs/page/${currentPage + 1}`;

  return {
    title: currentPage === 1 ? 'ブログ記事一覧' : `ブログ記事一覧 - ページ${currentPage}`,
    alternates,
    other,
  };
}

export default async function StaticPaginationPage({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await params;
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
      <WithSidebar>
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
      </WithSidebar>
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

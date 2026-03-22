import { WithSidebar } from '@/components/WithSidebar/WithSidebar';
import { notFound } from 'next/navigation';
import { getList, getCategoryList, getCategoryDetail } from '../../../../../../libs/notion';
import Paginate from '@/components/Pagination/Paginate';
import Index from '@/components/Index/Index';
import Title from '@/components/Title/Title';
import { Metadata } from 'next';

const ITEMS_PER_PAGE = 6;
const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string; pageId: string }>;
}): Promise<Metadata> {
  const { categoryId, pageId } = await params;
  const category = await getCategoryDetail(decodeURIComponent(categoryId)).catch(() => null);
  const name = category?.name || decodeURIComponent(categoryId);
  const title = `${name}の記事一覧${Number(pageId) > 1 ? ` (${pageId}ページ目)` : ''}`;
  const description = `${name}に関する技術記事の一覧です。`;
  const url = `${siteUrl}/categories/${categoryId}/page/${pageId}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export const runtime = 'edge';
export default async function StaticPaginationPage({
  params,
}: {
  params: Promise<{ categoryId: string; pageId: string }>;
}) {
  const { categoryId, pageId } = await params;
  if (!pageId) {
    notFound();
  }

  // ページ番号からコンテンツの範囲を計算
  const currentPage = parseInt(pageId, 10);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // コンテンツを取得
  try {
    //リスト一覧とカテゴリ詳細を並列取得
    const [{ contents }, category] = await Promise.all([
      getList(),
      getCategoryDetail(categoryId),
    ]);

    const filteredContents = contents.filter((blog) => blog.category?.id === decodeURIComponent(categoryId));
    const contentSlice = filteredContents.slice(startIndex, endIndex);

    // コンテンツを表示するロジックをここに追加

    return (
      <WithSidebar>
        <div className='text-center mt-1 w-full'>
          <Title title={category.name} />
        </div>
        <Index contents={contentSlice} />
        <Paginate
          currentPage={Number(pageId)}
          totalPage={Math.ceil(filteredContents.length / 6)}
          kind={`/categories/${categoryId}`}
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

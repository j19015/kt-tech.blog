import { WithSidebar } from '@/components/WithSidebar/WithSidebar';
import { notFound } from 'next/navigation';
import { getList, getCategoryDetail, Blog } from '../../../../../../libs/notion';
import Paginate from '@/components/Pagination/Paginate';
import Index from '@/components/Index/Index';
import Title from '@/components/Title/Title';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';
import { ITEMS_PER_PAGE, isPublic } from '@/lib/blog';
import { Metadata } from 'next';

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
  const currentPage = parseInt(pageId, 10);
  if (!Number.isInteger(currentPage) || currentPage < 1) {
    notFound();
  }

  const [{ contents }, category] = await Promise.all([
    getList().catch(() => ({ contents: [] as Blog[], totalCount: 0, offset: 0, limit: 0 })),
    getCategoryDetail(categoryId).catch(() => null),
  ]);
  if (!category) notFound();

  const filteredContents = contents
    .filter(isPublic)
    .filter((blog) => blog.category?.id === decodeURIComponent(categoryId));

  const totalPage = Math.max(1, Math.ceil(filteredContents.length / ITEMS_PER_PAGE));
  if (filteredContents.length === 0 || currentPage > totalPage) {
    notFound();
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const contentSlice = filteredContents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <WithSidebar>
      <BreadcrumbNav
        items={[
          { label: 'Category', href: '/categories' },
          { label: category.name, current: true },
        ]}
      />
      <Title title={category.name} type='category' count={filteredContents.length} />
      <Index contents={contentSlice} />
      <Paginate
        currentPage={currentPage}
        totalPage={totalPage}
        kind={`/categories/${categoryId}`}
      />
    </WithSidebar>
  );
}

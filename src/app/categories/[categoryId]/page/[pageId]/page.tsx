import { WithSidebar } from '@/components/WithSidebar/WithSidebar';
import { notFound } from 'next/navigation';
import { getList, getCategoryDetail, Blog } from '../../../../../../libs/notionCache';
import Paginate from '@/components/Pagination/Paginate';
import Index from '@/components/Index/Index';
import Title from '@/components/Title/Title';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';
import { ITEMS_PER_PAGE, isIndexableList, isPublic } from '@/lib/blog';
import { Metadata } from 'next';

const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string; pageId: string }>;
}): Promise<Metadata> {
  const { categoryId, pageId } = await params;
  const currentPage = Number.parseInt(pageId, 10);
  const [category, contents] = await Promise.all([
    getCategoryDetail(decodeURIComponent(categoryId)).catch(() => null),
    getList().then((r) => r.contents).catch(() => null),
  ]);
  const name = category?.name || decodeURIComponent(categoryId);
  const title = `${name}の記事一覧${currentPage > 1 ? ` (${currentPage}ページ目)` : ''}`;
  const description = `${name}に関する技術記事の一覧です。`;
  // canonical はリクエストの文字列ではなくカテゴリの id から組む（sitemap と同じ書き方）
  const url = `${siteUrl}/categories/${category ? encodeURIComponent(category.id) : categoryId}/page/${currentPage}`;
  const postCount = category && contents
    ? contents.filter(isPublic).filter((blog) => blog.category?.id === category.id).length
    : null;

  return {
    title,
    description,
    alternates: { canonical: url },
    // 記事が少ない一覧と2ページ目以降は noindex（#587）。件数が取れないときは何も足さない
    ...(postCount !== null && !isIndexableList(postCount, currentPage)
      ? { robots: { index: false, follow: true } }
      : {}),
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
      <div className='max-w-3xl mx-auto px-4'>
        <Index contents={contentSlice} priorityCount={1} />
      </div>
      <Paginate
        currentPage={currentPage}
        totalPage={totalPage}
        kind={`/categories/${categoryId}`}
      />
    </WithSidebar>
  );
}

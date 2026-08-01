import { notFound } from 'next/navigation';
import { getList, Blog } from '../../../../../libs/notion';
import Paginate from '@/components/Pagination/Paginate';
import Index from '@/components/Index/Index';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';
import { WithSidebar } from '@/components/WithSidebar/WithSidebar';
import { Metadata } from 'next';
import { ITEMS_PER_PAGE, isPublic } from '@/lib/blog';

const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ pageId: string }> }): Promise<Metadata> {
  const { pageId } = await params;
  const currentPage = parseInt(pageId, 10);

  return {
    title: currentPage === 1 ? 'ブログ記事一覧' : `ブログ記事一覧 - ページ${currentPage}`,
    description: '技術記事の一覧です。React, Next.js, TypeScript, Cloudflare, AI などのモダン技術を中心に発信しています。',
    alternates: { canonical: `${siteUrl}/blogs/page/${currentPage}` },
    // 2ページ目以降は内容が薄いページが大量にインデックスされるのを避ける
    ...(currentPage > 1 ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function StaticPaginationPage({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await params;
  const currentPage = parseInt(pageId, 10);
  if (!Number.isInteger(currentPage) || currentPage < 1) {
    notFound();
  }

  const { contents } = await getList().catch(() => ({ contents: [] as Blog[], totalCount: 0, offset: 0, limit: 0 }));

  // 表示件数とページ総数は同じ配列から数える。
  // 以前は総数だけ PF を除外していなかったため、末尾に空のページができていた。
  const publicContents = contents.filter(isPublic);
  const totalPage = Math.max(1, Math.ceil(publicContents.length / ITEMS_PER_PAGE));
  if (currentPage > totalPage) {
    notFound();
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const contentSlice = publicContents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <WithSidebar>
      <BreadcrumbNav items={[{ label: 'Blog', current: true }]} />
      <Index contents={contentSlice} />
      <Paginate currentPage={currentPage} totalPage={totalPage} kind='/blogs' />
    </WithSidebar>
  );
}

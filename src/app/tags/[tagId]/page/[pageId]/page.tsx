import { WithSidebar } from '@/components/WithSidebar/WithSidebar';
import { notFound } from 'next/navigation';
import { getList, getTagDetail, Blog } from '../../../../../../libs/notionCache';
import Paginate from '@/components/Pagination/Paginate';
import Index from '@/components/Index/Index';
import Title from '@/components/Title/Title';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';
import { ITEMS_PER_PAGE, isIndexableList, isPublic } from '@/lib/blog';
import { Metadata } from 'next';

const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';

type Props = { params: Promise<{ tagId: string; pageId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tagId, pageId } = await params;
  const currentPage = Number.parseInt(pageId, 10);
  const [tag, contents] = await Promise.all([
    getTagDetail(decodeURIComponent(tagId)).catch(() => null),
    getList().then((r) => r.contents).catch(() => null),
  ]);
  const name = tag?.name || decodeURIComponent(tagId);
  const title = `${name}の記事一覧${currentPage > 1 ? ` (${currentPage}ページ目)` : ''}`;
  const description = `${name}タグが付けられた技術記事の一覧です。`;
  // canonical はリクエストの文字列ではなくタグの id から組む（sitemap・リンクと同じ書き方）
  const url = `${siteUrl}/tags/${tag ? encodeURIComponent(tag.id) : tagId}/page/${currentPage}`;
  const postCount = tag && contents
    ? contents.filter(isPublic).filter((blog) => blog.tags?.some((t) => t.id === tag.id)).length
    : null;

  return {
    title,
    description,
    alternates: { canonical: url },
    // 記事が少ない一覧と2ページ目以降は noindex（#587）。件数が取れないときは何も足さない
    ...(postCount !== null && !isIndexableList(postCount, currentPage)
      ? { robots: { index: false, follow: true } }
      : {}),
    openGraph: { title, description, url, type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

export const runtime = 'edge';

export default async function TagPaginationPage({ params }: Props) {
  const { tagId, pageId } = await params;
  const currentPage = Number.parseInt(pageId, 10);
  if (!Number.isInteger(currentPage) || currentPage < 1) notFound();

  const [{ contents }, tag] = await Promise.all([
    getList().catch(() => ({ contents: [] as Blog[], totalCount: 0, offset: 0, limit: 0 })),
    getTagDetail(tagId).catch(() => null),
  ]);
  if (!tag) notFound();

  const filteredContents = contents
    .filter(isPublic)
    .filter((blog) => blog.tags?.some((t) => t.id === decodeURIComponent(tagId)));

  const totalPage = Math.max(1, Math.ceil(filteredContents.length / ITEMS_PER_PAGE));
  if (filteredContents.length === 0 || currentPage > totalPage) notFound();

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const contentSlice = filteredContents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <WithSidebar>
      <BreadcrumbNav
        items={[
          { label: 'Tag', href: '/tags' },
          { label: tag.name, current: true },
        ]}
      />
      <Title title={tag.name} type='tag' count={filteredContents.length} />
      <div className='max-w-3xl mx-auto px-4'>
        <Index contents={contentSlice} priorityCount={1} />
      </div>
      <Paginate currentPage={currentPage} totalPage={totalPage} kind={`/tags/${tagId}`} />
    </WithSidebar>
  );
}

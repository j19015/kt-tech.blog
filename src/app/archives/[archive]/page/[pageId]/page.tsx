import { WithSidebar } from '@/components/WithSidebar/WithSidebar';
import { notFound } from 'next/navigation';
import { getList, Blog } from '../../../../../../libs/notion';
import Paginate from '@/components/Pagination/Paginate';
import Index from '@/components/Index/Index';
import Title from '@/components/Title/Title';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';
import { ITEMS_PER_PAGE, isPublic, formatArchive } from '@/lib/blog';
import { Metadata } from 'next';

const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';

type Props = { params: Promise<{ archive: string; pageId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { archive, pageId } = await params;
  const label = formatArchive(archive);
  const title = `${label}のアーカイブ${Number(pageId) > 1 ? ` (${pageId}ページ目)` : ''}`;
  const description = `${label}に公開された技術記事の一覧です。`;
  const url = `${siteUrl}/archives/${archive}/page/${pageId}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

export const runtime = 'edge';

export default async function ArchivePaginationPage({ params }: Props) {
  const { archive, pageId } = await params;
  const currentPage = Number.parseInt(pageId, 10);
  if (!Number.isInteger(currentPage) || currentPage < 1) notFound();

  const { contents } = await getList().catch(() => ({
    contents: [] as Blog[],
    totalCount: 0,
    offset: 0,
    limit: 0,
  }));

  const filteredContents = contents
    .filter(isPublic)
    .filter((item) => item.createdAt.slice(0, 7) === archive);

  const totalPage = Math.max(1, Math.ceil(filteredContents.length / ITEMS_PER_PAGE));
  if (filteredContents.length === 0 || currentPage > totalPage) notFound();

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const contentSlice = filteredContents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <WithSidebar>
      <BreadcrumbNav items={[{ label: formatArchive(archive), current: true }]} />
      <Title title={formatArchive(archive)} type='archive' count={filteredContents.length} />
      <div className='max-w-3xl mx-auto px-4'>
        <Index contents={contentSlice} priorityCount={1} />
      </div>
      <Paginate currentPage={currentPage} totalPage={totalPage} kind={`/archives/${archive}`} />
    </WithSidebar>
  );
}

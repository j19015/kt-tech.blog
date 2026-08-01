import { WithSidebar } from '@/components/WithSidebar/WithSidebar';
import { notFound } from 'next/navigation';
import { getList } from '../../../../libs/notion';
import Index from '@/components/Index/Index';
import Title from '@/components/Title/Title';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';
import { isPublic, formatArchive } from '@/lib/blog';
import { Metadata } from 'next';

const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ archive: string }>;
}): Promise<Metadata> {
  const { archive } = await params;
  const [year, month] = archive.split('-');
  const title = `${year}年${parseInt(month)}月のアーカイブ`;
  const description = `${year}年${parseInt(month)}月に公開された技術記事の一覧です。`;
  const url = `${siteUrl}/archives/${archive}`;

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
export default async function StaticDetailPage({
  params,
}: {
  params: Promise<{ archive: string }>;
}) {
  const { archive } = await params;
  const { contents } = await getList().catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 }));

  const filteredContents = contents
    .filter(isPublic)
    .filter((item) => item.createdAt.slice(0, 7) === archive);

  if (filteredContents.length === 0) {
    notFound();
  }

  return (
    <WithSidebar>
      <BreadcrumbNav items={[{ label: formatArchive(archive), current: true }]} />
      <Title title={formatArchive(archive)} type='archive' count={filteredContents.length} />
      <Index contents={filteredContents} />
    </WithSidebar>
  );
}

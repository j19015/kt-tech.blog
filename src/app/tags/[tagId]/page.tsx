import { WithSidebar } from '@/components/WithSidebar/WithSidebar';
import { notFound } from 'next/navigation';
import { getList, getTagDetail } from '../../../../libs/notion';
import Index from '@/components/Index/Index';
import Title from '@/components/Title/Title';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';
import { isPublic } from '@/lib/blog';
import { Metadata } from 'next';

const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tagId: string }>;
}): Promise<Metadata> {
  const { tagId } = await params;
  const tag = await getTagDetail(decodeURIComponent(tagId)).catch(() => null);
  const name = tag?.name || decodeURIComponent(tagId);
  const title = `${name}の記事一覧`;
  const description = `${name}タグが付けられた技術記事の一覧です。`;
  const url = `${siteUrl}/tags/${tagId}`;

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
  params: Promise<{ tagId: string }>;
}) {
  const { tagId } = await params;

  const [{ contents }, tag_show] = await Promise.all([
    getList().catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
    getTagDetail(tagId).catch(() => null),
  ]);
  if (!tag_show) notFound();

  const filteredContents = contents
    .filter(isPublic)
    .filter((blog) => blog.tags?.some((tag) => tag.id === decodeURIComponent(tagId)));

  if (filteredContents.length === 0) {
    notFound();
  }

  return (
    <WithSidebar>
      <BreadcrumbNav
        items={[
          { label: 'Tag', href: '/tags' },
          { label: tag_show.name, current: true },
        ]}
      />
      <Title title={tag_show.name} type='tag' count={filteredContents.length} />
      <div className='max-w-3xl mx-auto px-4'>
        <Index contents={filteredContents} />
      </div>
    </WithSidebar>
  );
}

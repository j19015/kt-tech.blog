import { WithSidebar } from '@/components/WithSidebar/WithSidebar';
import { notFound } from 'next/navigation';
import { getList, getTagList, getTagDetail } from '../../../../libs/notion';
import Sidebar from '@/components/SIdebar/Sidebar';
import Index from '@/components/Index/Index';
import Title from '@/components/Title/Title';
import Link from 'next/link';
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

  const filteredContents = contents.filter((blog) => blog.tags?.some((tag) => tag.id === decodeURIComponent(tagId)));

  if (!filteredContents || filteredContents.length === 0) {
    notFound();
  }

  return (
    <WithSidebar>
      <div className='text-center mt-1 w-full'>
        <Title title={tag_show.name} />
      </div>
      <Index contents={filteredContents} />
    </WithSidebar>
  );
}

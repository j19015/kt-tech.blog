import { WithSidebar } from '@/components/WithSidebar/WithSidebar';
import { notFound } from 'next/navigation';
import { getList } from '../../../../libs/notion';
import Index from '@/components/Index/Index';
import Title from '@/components/Title/Title';


export const runtime = 'edge';
export default async function StaticDetailPage({
  params,
}: {
  params: Promise<{ archive: string }>;
}) {
  const { archive } = await params;
  const { contents } = await getList().catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 }));

  const filteredContents = contents.filter((item) => item.createdAt.slice(0, 7) === archive);

  if (filteredContents.length === 0) {
    notFound();
  }

  return (
    <WithSidebar>
      <div className='text-center mt-1 w-full'>
        <Title title={archive} />
      </div>
      <Index contents={filteredContents} />
    </WithSidebar>
  );
}

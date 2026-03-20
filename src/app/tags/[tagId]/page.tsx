import { notFound } from 'next/navigation';
import { getList, getTagList, getTagDetail } from '../../../../libs/notion';
import Sidebar from '@/components/SIdebar/Sidebar';
import Index from '@/components/Index/Index';
import Title from '@/components/Title/Title';
import Link from 'next/link';


export const runtime = 'edge';
export default async function StaticDetailPage({
  params,
}: {
  params: Promise<{ tagId: string }>;
}) {
  const { tagId } = await params;

  let contents, tag_show;
  try {
    [{ contents }, tag_show] = await Promise.all([
      getList(),
      getTagDetail(tagId),
    ]);
  } catch {
    notFound();
  }

  const filteredContents = contents.filter((blog) => blog.tags?.some((tag) => tag.id === decodeURIComponent(tagId)));

  if (!filteredContents || filteredContents.length === 0) {
    notFound();
  }

  return (
    <>
      <div className='text-center mt-1 w-full col-span-2'>
        <Title title={tag_show.name} />
      </div>
      <Index contents={filteredContents} />
    </>
  );
}

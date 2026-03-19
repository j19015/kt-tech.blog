import { notFound } from 'next/navigation';
import { getList } from '../../../../libs/notion';
import Index from '@/components/Index/Index';
import Title from '@/components/Title/Title';

export const runtime = 'edge';

export async function generateStaticParams() {
  return [];
}

export default async function StaticDetailPage({
  params: { archive },
}: {
  params: { archive: string };
}) {
  //リスト一覧を取得
  const { contents } = await getList();

  //コンテンツを日付でフィルター
  const filteredContents = contents.filter((item) => item.createdAt.slice(0, 7) === archive);

  //コンテンツがない場合
  if (!filteredContents) {
    notFound();
  }

  return (
    <>
      <div className='text-center mt-1 w-full col-span-2'>
        <Title title={archive} />
      </div>
      <Index contents={filteredContents} />
    </>
  );
}

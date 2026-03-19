import { notFound } from 'next/navigation';
import { getList } from '../../../../libs/notion';
import Index from '@/components/Index/Index';
import Title from '@/components/Title/Title';


export const revalidate = 3600;
export async function generateStaticParams() {
  const { contents } = await getList();
  const archives = Array.from(new Set(contents.map((item) => item.createdAt.slice(0, 7))));
  return archives.map((archive) => ({ archive }));
}

export default async function StaticDetailPage({
  params,
}: {
  params: Promise<{ archive: string }>;
}) {
  //リスト一覧を取得
  const { archive } = await params;
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

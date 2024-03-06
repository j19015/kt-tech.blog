import { notFound } from 'next/navigation';
import { getList, getTagList, getTagDetail } from '../../../../libs/microcms';
import Sidebar from '@/components/SIdebar/Sidebar';
import Index from '@/components/Index/Index';
import Title from '@/components/Title/Title';
import Link from 'next/link';

export async function generateStaticParams() {
  const { contents } = await getTagList();

  const paths = contents.map((tag) => {
    return {
      tagId: tag.id,
    };
  });
  return [...paths];
}

export default async function StaticDetailPage({
  params: { tagId },
}: {
  params: { tagId: string };
}) {
  //ページの生成された時間を取得
  const time = new Date().toLocaleString();

  //リスト一覧を取得
  const { contents } = await getList();

  //タグの詳細情報を取得
  const tag_show = await getTagDetail(tagId);

  //リストを指定のタグで絞り込み
  const filteredContents = contents.filter((blog) => blog.tags?.some((tag) => tag.id === tagId));

  //コンテンツがない場合
  if (!filteredContents) {
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

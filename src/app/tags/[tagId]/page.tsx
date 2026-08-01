import { redirect } from 'next/navigation';

export const runtime = 'edge';

// /tags/{id} と /tags/{id}/page/1 は同じ内容なので1本化する。
// 以前は前者にページネーションがなく、タグの付いた記事を全件表示していた。
export default async function TagIndexPage({
  params,
}: {
  params: Promise<{ tagId: string }>;
}) {
  const { tagId } = await params;
  redirect(`/tags/${tagId}/page/1`);
}

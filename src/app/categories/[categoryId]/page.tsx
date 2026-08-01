import { redirect } from 'next/navigation';

export const runtime = 'edge';

// /categories/{id} と /categories/{id}/page/1 は同じ内容なので1本化する。
// 以前は前者だけページネーションがなく全件表示で、遷移元によってどちらに飛ぶかも
// バラバラだった（重複コンテンツ）。
export default async function CategoryIndexPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  redirect(`/categories/${categoryId}/page/1`);
}

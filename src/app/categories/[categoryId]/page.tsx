import { redirect } from 'next/navigation';

export const runtime = 'edge';

// 通常は next.config.js の redirects() が描画の前に 308 で寄せるので、ここには来ない。
// redirects() が効かない環境のための保険として残している（#586）
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

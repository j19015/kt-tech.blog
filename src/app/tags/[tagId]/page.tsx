import { redirect } from 'next/navigation';

export const runtime = 'edge';

// 通常は next.config.js の redirects() が描画の前に 308 で寄せるので、ここには来ない。
// redirects() が効かない環境のための保険として残している（#586）
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

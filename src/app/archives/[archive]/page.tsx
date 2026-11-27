import { redirect } from 'next/navigation';

export const runtime = 'edge';

// 通常は next.config.js の redirects() が描画の前に 308 で寄せるので、ここには来ない。
// redirects() が効かない環境のための保険として残している（#586）
// /archives/{ym} と /archives/{ym}/page/1 は同じ内容なので1本化する。
// 以前は前者にページネーションがなく、その月の記事を全件表示していた。
export default async function ArchiveIndexPage({
  params,
}: {
  params: Promise<{ archive: string }>;
}) {
  const { archive } = await params;
  redirect(`/archives/${archive}/page/1`);
}

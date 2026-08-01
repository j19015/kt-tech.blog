import { redirect } from 'next/navigation';

export const runtime = 'edge';

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

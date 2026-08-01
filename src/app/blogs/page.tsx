import { redirect } from 'next/navigation';

export const runtime = 'edge';

// /blogs と /blogs/page/1 は同じ「ブログ一覧」なのでページネーション付きの方に寄せる。
// 以前の /blogs はサイドバーもページネーションもなく PF 記事も混ざっていて、
// 同じ一覧なのに到達経路によって見た目が別物になっていた。
export default function BlogsIndexPage() {
  redirect('/blogs/page/1');
}

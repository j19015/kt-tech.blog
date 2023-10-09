import Link from "next/link";
import { getList } from "../../libs/microcms";
import Sidebar from "@/components/SIdebar/Sidebar"; // Sidebarのimportを修正
import { Blog } from "../../libs/microcms";
import Index from "@/components/Index/Index";
import Title from "@/components/Title/Title";

export const metadata = {
  title: 'TOPページ',
  description: '基本的には技術記事を投稿していきます。PFの公開ページやIntroduction用ページとしても活用をしています。',
  openGraph: {
    title: 'TOPページ',
    description: '基本的には技術記事を投稿していきます。PFの公開ページやIntroduction用ページとしても活用をしています。',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TOPページ',
    description: '基本的には技術記事を投稿していきます。PFの公開ページやIntroduction用ページとしても活用をしています。',
    site: '@tech_koki',
    creator: '@tech_koki',
  },
};

export default async function StaticPage () {
  const { contents } = await getList();
  //console.log(contents);

  // ページの生成された時間を取得
  const time = new Date().toString();

  if (!contents || contents.length === 0) {
    return <h1>No Contents</h1>;
  }

  // contentsをBlogの配列として定義
  const latestBlogs: Blog[] = contents.slice(0, 4);
  

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-5">
        <div className="lg:col-span-2">
          <Index contents = {latestBlogs}/>
          <div className="mt-8 flex justify-center"> {/* 中央寄せ */}
            <Link href="/blogs/page/1" className="transition duration-300 ease-in-out bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 border-b-4 border-indigo-800 hover:border-indigo-700 rounded shadow-md">
                すべての記事を見る
            </Link>
        </div>
        </div>
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </>
  );
}

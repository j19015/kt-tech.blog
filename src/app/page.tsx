import Link from "next/link";
import { getList } from "../../libs/microcms";
import Image from "next/image";
import Sidebar from "@/components/SIdebar/Sidebar"; // Sidebarのimportを修正

export default async function StaticPage() {
  const { contents } = await getList();
  console.log(contents);

  // ページの生成された時間を取得
  const time = new Date().toString();

  if (!contents || contents.length === 0) {
    return <h1>No Contents</h1>;
  }

  // 最新の4つの記事を取得
  const latestBlogs = contents.slice(0, 4);

  return (
    <>
    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-5">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center mt-1 w-full col-span-2">
              <h1 className="lg:text-6xl md:text-5xl text-4xl font-bold text-blue-700 mb-2">Welcome to</h1>
              <h2 className="lg:text-5xl md:text-4xl text-3xl font-extrabold text-indigo-900 mb-6">Kt Tech Blog</h2>
            </div>
            {latestBlogs.map((blog) => {
              return (
                <div key={blog.id} className="w-full p-2 md:w-full lg:w-full">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-md">
                      <Link href={`/blogs/${blog.id}`}>
                        <img
                          className="rounded-t-lg w-full max-w-full"
                          src={blog.eyecatch?.url}
                          alt=""
                        />
                      </Link>
                    <div className="p-5">
                        <Link href={`/blogs/${blog.id}`}>
                          <h5 className="mb-2 lg:text-lg font-bold tracking-tight text-gray-900 truncate md:text-base sm:text-base">
                            {blog.title}
                          </h5>
                        </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex justify-center lg:justify-center"> {/* 中央寄せまたは右寄せ */}
            <Link href="/blogs/page/1" className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
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

import Link from "next/link";
import { getList } from "../../libs/microcms";
import Image from 'next/image';
import Sidebar from "@/components/SIdebar/Sidebar"; // Sidebarのimportを修正

export default async function StaticPage() {
  const { contents } = await getList();
  console.log(contents);

  // ページの生成された時間を取得
  const time = new Date().toString();

  if (!contents || contents.length === 0) {
    return <h1>No Contents</h1>;
  }

  return (
    <>
      <h1>{time}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* グリッドを設定 */}
        {contents.map((blog) => {
          return (
            <div key={blog.id}>
              <div className="bg-white border border-gray-200 rounded-lg shadow-md">
                <a href={`/blogs/${blog.id}`}>
                  <img className="rounded-t-lg w-full" src={blog.eyecatch?.url} alt="" />
                </a>
                <div className="p-5">
                  <a href={`/blogs/${blog.id}`}>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 truncate">
                      {blog.title}
                    </h5>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Sidebar />
    </>
  );
}

import { notFound } from "next/navigation"
import { getList,getCategoryList } from "../../../../libs/microcms"
import Sidebar from "@/components/SIdebar/Sidebar"
import Link from "next/link";

export async function generateStaticParams(){
  const { contents } = await getCategoryList();

  const paths = contents.map((category)=>{
    return {
      categoryId: category.id,
    };
  });
  return [...paths];
}

export default async function StaticDetailPage({
  params : { categoryId },
}: {
  params: { categoryId : string};
}) {

  //ページの生成された時間を取得
  const time = new Date().toLocaleString();

  //リスト一覧を取得
  const { contents } = await getList();

  //リストを指定のタグで絞り込み
  const filteredContents = contents.filter((blog) => blog.category?.id === categoryId);

  if(!filteredContents){
    notFound();
  }

  return (
    <>
      <h1>{time}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"> {/* グリッドを設定 */}
        <div className="lg:col-span-2"> {/* 通常の画面サイズでは2列分のスペースを占有 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContents.map((blog) => {
              return (
                <div key={blog.id} className="w-full p-2 md:w-full lg:w-full">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-md">
                    <Link href={`/blogs/${blog.id}`}>
                      <img className="rounded-t-lg w-full  max-w-full" src={blog.eyecatch?.url} alt="" /> {/* 画像の高さと幅を指定 */}
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
        </div>
        <div className="lg:col-span-1"> {/* 通常の画面サイズでは1列分のスペースを占有 */}
          <Sidebar />
        </div>
      </div>
    </>
  );
}
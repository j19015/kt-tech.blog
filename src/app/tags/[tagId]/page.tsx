import { notFound } from "next/navigation"
import { getList,getTagList,getTagDetail } from "../../../../libs/microcms"
import Sidebar from "@/components/SIdebar/Sidebar"
import Index from "@/components/Index/Index";
import Link from "next/link";

export async function generateStaticParams(){
  const { contents } = await getTagList();

  const paths = contents.map((tag)=>{
    return {
      tagId: tag.id,
    };
  });
  return [...paths];
}

export default async function StaticDetailPage({
  params : { tagId },
}: {
  params: { tagId : string};
}) {

  //ページの生成された時間を取得
  const time = new Date().toLocaleString();

  //リスト一覧を取得
  const { contents } = await getList();

  //タグの詳細情報を取得
  const tag_show = await getTagDetail(tagId);

  //リストを指定のタグで絞り込み
  const filteredContents = contents.filter((blog) =>
    blog.tags?.some((tag) => tag.id === tagId)
  );

  //コンテンツがない場合
  if(!filteredContents){
    notFound();
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"> {/* グリッドを設定 */}
        <div className="lg:col-span-2"> {/* 通常の画面サイズでは2列分のスペースを占有 */}
          <div className="text-center mt-1 w-full col-span-2">
            <h2 className="lg:text-5xl md:text-4xl text-3xl font-extrabold text-gray-100 mb-6 underline">{tag_show.name}</h2>
          </div>
          <Index contents={filteredContents}/>
        </div>
        <div className="lg:col-span-1"> {/* 通常の画面サイズでは1列分のスペースを占有 */}
          <Sidebar />
        </div>
      </div>
    </>
  );
}
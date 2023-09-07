import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import parse from "html-react-parser"
import { getDetail,getList } from "../../../../libs/microcms"

export async function generateStaticParams(){
  const { contents } = await getList();

  const paths = contents.map((blog)=>{
    return {
      blogId: blog.id,
    };
  });
  return [...paths];
}

export default async function StaticDetailPage({
  params : { blogId },
}: {
  params: { blogId : string};
}) {
  const blog = await getDetail(blogId);

  //ページの生成された時間を取得
  const time = new Date().toLocaleString();

  if(!blog){
    notFound();
  }
  

  return(
    <>
    <h1>{time}</h1>
    <div className='h-screen'>
      <div className="h-full grid grid-cols-12 gap-2 grid-flow-row">
        <div className='col-span-12 md:col-span-8 m-4 rounded-lg bg-gray-300'>
          main
          <div className="p-4">
            <Link href={`/blogs/${blog.id}`}>
              <Image 
                src={ blog.eyecatch?.url ? blog.eyecatch?.url : `../../../public/images/no_image`}
                alt="画像"
                width={1000}
                height={1000}
                className="rounded-lg"
              />
            </Link>
          </div>
          <div className="p-4">
            <h1>{blog.title}</h1>
            <p className="truncate" style={{ "width":"600px"}}>{blog.body}</p>
          </div>
        </div>
        <div className='col-span-12 md:col-span-4 m-4 rounded-lg bg-gray-300'>
          Sidebar
          <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
            検索Form
          </div>
          <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
            注目記事
          </div>
          <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
            最新記事
          </div>
          <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
            カテゴリー
          </div>
          <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
            アーカイブ
          </div>
        </div>
      </div>
    </div>
  </>
  )
}
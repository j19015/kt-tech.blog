import Link from "next/link";
import { getList } from "../../../libs/microcms";

export default async function StaticPage(){
  const { contents } =await getList();

  //ページの生成された時間を取得
  const time = new Date().toString();

  if (!contents || contents.length ===0 ){
    return <h1>No Contents</h1>;
  }

  return (
    <>
      <h1>{time}</h1>
      <div className='h-screen'>
        <div className="h-full grid grid-cols-12 gap-2 grid-flow-row">
          <div className='col-span-12 md:col-span-8 m-4 rounded-lg bg-gray-300'>
            main
            {contents.map((blog)=>{
              return (
                <>
                  <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
                    <h2>{blog.title}</h2>
                    <p>{blog.body}</p>
                  </div>
                </>
              )
            })}
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
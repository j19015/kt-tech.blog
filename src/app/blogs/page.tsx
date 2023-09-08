import Link from "next/link";
import { getList } from "../../../libs/microcms";
import Image from 'next/image';
import Sidebar from '@/components/SIdebar/Sidebar';

export default async function StaticPage(){
  const { contents } =await getList();
  console.log(contents)

  //ページの生成された時間を取得
  const time = new Date().toString();

  if (!contents || contents.length ===0 ){
    return <h1>No Contents</h1>;
  }

  return (
    <>
      <h1>{time}</h1>
      <div>
        <div className="grid grid-cols-12 gap-2 grid-flow-row">
          <div className='col-span-12 md:col-span-8 m-4 rounded-lg bg-gray-300'>
            main
            {contents.map((blog)=>{
              return (
                <div className="bg-gray-500 rounded-lg m-4 p-4" id={blog.id}>
                  <div className="md:flex md:flex-row md:items-center">
                    <div className="md:pr-4 w-full md:w-1/3">
                      <Link href={`/blogs/${blog.id}`}>
                        <Image
                          src={blog.eyecatch?.url ? blog.eyecatch?.url : `../../../public/images/no_image`}
                          alt="画像"
                          width={300} // 同じ値を設定
                          height={300} // 同じ値を設定
                          className="rounded-lg w-full" // 画像を横幅いっぱいにする
                          style={{ minWidth: "180px" }}
                        />
                      </Link>
                    </div>
                    <div className="w-full md:w-2/3 mt-4 md:mt-0">
                      <h1 className="text-2xl md:text-xl font-bold text-gray-800 my-2 md:mt-0 truncate">
                        {blog.title}
                      </h1>
                      <div className="flex flex-wrap space-x-2 mt-2">
                        <span className="text-gray-600 text-sm md:text-base">タグ1</span>
                        <span className="text-gray-600 text-sm md:text-base">タグ2</span>
                      </div>
                      <div className="mt-4 flex items-center space-x-2">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm md:text-base">
                          いいね
                        </button>
                        <span className="text-gray-600 text-sm md:text-base">いいね数: 100</span>
                      </div>
                    </div>
                  </div>
                </div>

              );
            })}
          </div>
          <Sidebar/>
        </div>
      </div>
    </>
  )
}
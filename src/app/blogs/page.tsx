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
          <div className='col-span-12 md:col-span-8 m-4 rounded-lg bg-gray-300 flex flex-wrap justify-center'>
            {contents.map((blog)=>{
              return (
                <div id={blog.id}>
                  <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md mb-4 w-full m-5">
                    <a href={`/blogs/${blog.id}`}>
                      <img className="rounded-t-lg w-full md:h-auto" src={blog.eyecatch?.url} alt="" />
                    </a>
                    <div className="p-5">
                      <a href={`/blogs/${blog.id}`}>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900  truncate">
                          {blog.title}
                        </h5>
                      </a>
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
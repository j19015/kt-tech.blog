"use client"
import Link from "next/link";
import { client } from "@/../libs/client"
import { Blog} from "@/../interface/blog"
import { useParams} from 'next/navigation';
import { useEffect,useState } from "react";



export default async () => {

  //状態管理変数
  const [blog,setBlog] = useState<Blog | null>(null);
  const [id,setId] = useState<Number | null>(null);

  useEffect(()=>{
    //fetchBlog();
  },[])

  const fetchBlog = async() => {
    //URLパラメータ取得用のparamsを定義
    const params = useParams()
    //paramsからidを抜き出し
    setId(Number(params.id))
    try{
      console.log(process.env.API_KEY)
      //APIリクエスト
      const data = await client.get({ endpoint: "blog",contentId: id?.toString() });
      //コンテンツ抽出
      setBlog(data.contents);
      console.log(data)
    }catch(e){
      console.log(e);
    }
    console.log(process.env.API_KEY);
  }

  //表示内容
  return (
    <>
      <div>
        { blog ? (
            <>
              <ul>
                <li key={blog.id}>
                  <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
                  <Link href={`/blog/${blog.id}`}>{blog.body}</Link>
                </li>
              </ul>
            </>
          ):(
            <>
              <p>Loading...</p>
            </>
          ) 
        }
      </div>
    </>
  );
}
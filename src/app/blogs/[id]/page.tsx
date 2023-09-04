"use client"
import Link from "next/link";
import { client } from "@/../libs/client"
import { Blog} from "@/../interface/blog"
import { useParams} from 'next/navigation';
import { useEffect,useState } from "react";

export default () => {

  //URLパラメータ取得用のparamsを定義
  const params = useParams()

  //id抽出
  const {id} = params

  //状態管理変数
  const [blog,setBlog] = useState<Blog | null>(null);

  useEffect(()=>{
    fetchBlog();
  },[])

  const fetchBlog = async() => {
    try{
      //APIリクエスト
      const data :Blog = await client.get({ endpoint: 'blog',contentId: id?.toString() });

      //コンテンツ抽出
      setBlog(data);

    }catch(e){
      console.log(e);
    }
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
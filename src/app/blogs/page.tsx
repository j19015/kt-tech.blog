import Link from "next/link";
import { client } from "@/../libs/client"
import { Blog, Blogs } from "@/../interface/blog"


export default async () => {
  //APIリクエスト
  const data = await client.get({ endpoint: "blog" });
  //コンテンツ抽出
  const blogs: Blogs = data.contents;
  //取得内容
  console.log(blogs);
  //表示内容
  return (
    <div>
      <ul>
        {blogs.map((blog :Blog) => (
          <li key={blog.id}>
            <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
            <Link href={`/blog/${blog.id}`}>{blog.body}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
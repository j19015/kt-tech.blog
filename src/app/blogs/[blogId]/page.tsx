import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getDetail,getList } from "../../../../libs/microcms"
import cheerio from "cheerio";
import hljs from "highlight.js";
import "highlight.js/styles/hybrid.css";
import Sidebar from "@/components/SIdebar/Sidebar"

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

  const body = cheerio.load(blog.body);
  body("pre code").each((_, elm) => {
    const result = hljs.highlightAuto(body(elm).text());
    body(elm).html(result.value);
    body(elm).addClass("hljs");
  });
  console.log(blog.body)
  console.log(body.html())


  if(!blog){
    notFound();
  }
  

  return(
    <>
    <div>
      <div className="grid grid-cols-12 gap-2 grid-flow-row">
        <div className='col-span-12 md:col-span-8 m-4 rounded-lg bg-gray-300'>
          <div className="p-4">
            <Link href={`/blogs/${blog.id}`}>
              <Image 
                src={ blog.eyecatch?.url ? blog.eyecatch?.url : `../../../public/images/no_image`}
                alt="画像"
                width={10000}
                height={10000}
                className="rounded-lg"
              />
            </Link>
          </div>
          <div className="p-4 markdown">
            <h1>{blog.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: body.html() }}>
            </div>
          </div>
        </div>
        <Sidebar/>
      </div>
    </div>
  </>
  )
}
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getDetail,getList } from "../../../../libs/microcms"
import cheerio from "cheerio";
import hljs from "highlight.js";
//import "highlight.js/styles/hybrid.css";
import Sidebar from "@/components/SIdebar/Sidebar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt,faTag } from '@fortawesome/free-solid-svg-icons'
import markdownToHtml from 'zenn-markdown-html';
import 'zenn-content-css';
import '../../../../styles/markdown.css'
import '../../../../styles/default-dark.min.css'
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
  const html = markdownToHtml(blog.body);
  const parse_body = cheerio.load(html);
  parse_body("pre code").each((_, elm) => {
    const result = hljs.highlightAuto(parse_body(elm).text());
    parse_body(elm).html(result.value);
    parse_body(elm).addClass("hljs");
  });
  //console.log(blog.body)
  //console.log(body.html())


  if(!blog){
    notFound();
  }
  

  return(
    <>
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3"> {/* グリッドを設定 */}
        <div className="lg:col-span-3 lg:p-10"> {/* 通常の画面サイズでは2列分のスペースを占有 */}
          <div>
            <div className="p-1">
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
            <div className="text-gray-500 text-lg p-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-gray-400" />
                <span className="mr-2 text-gray-400">
                    投稿日時:
                </span>
                <span className="text-gray-400">
                    {new Date(blog.createdAt).toLocaleDateString("ja-JP", {
                        timeZone: "Asia/Tokyo",
                    })}
                </span>
            </div>
            <div className="p-2">
                <Link key={blog.category?.id} href={`/categories/${blog.category?.id}`} className="text-indigo-400 hover:text-indigo-300 inline">
                    <div className="inline group bg-gray-700 text-gray-100 p-3 rounded-lg transition duration-300 ease-in-out transform hover:bg-indigo-700 hover:text-gray-300 hover:scale-105">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400 mr-2 group-hover:text-indigo-400 inline"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        {blog.category?.name}
                    </div>
                </Link>
            </div>
            <div className="mt-2 p-1">
                <ul className="list-disc list-inside text-gray-400">
                    {blog.tags?.map((tag) => (
                        <span key={tag.id} className="inline-block bg-indigo-700 text-white px-2 py-1 rounded-full text-sm mr-2 mb-2">
                            <Link href={`/tags/${tag.id}`}>
                            <FontAwesomeIcon icon={faTag} /> {tag.name}
                            </Link>
                        </span>
                    ))}
                </ul>
            </div>
            <h1 className="p-4 mt-5 text-xl font-bold lg:text-3xl">{blog.title}</h1>
            <div className="p-4 znc markdown">    
              <div dangerouslySetInnerHTML={{ __html: parse_body.html() }}>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3 lg:p-10 p-3"> {/* 通常の画面サイズでは1列分のスペースを占有 */}
          <Sidebar />
        </div>
      </div>
    </div>
  </>
  )
}
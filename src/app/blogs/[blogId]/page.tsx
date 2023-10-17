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
import type { Metadata, ResolvingMetadata } from 'next'
export async function generateStaticParams(){
  const { contents } = await getList();

  const paths = contents.map((blog)=>{
    return {
      blogId: blog.id,
    };
  });
  return [...paths];
}

type Props = {
  params: { blogId: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  // fetch data
  const blog =  await getDetail(params.blogId);
 
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = blog.eyecatch || []
 
  return {
    title: blog.title,
    description: blog.body.slice(0,100),
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.body.slice(0,100),
      site: '@tech_koki',
      creator: '@tech_koki',
    },
    openGraph: {
      title: blog.title,
      description: blog.body.slice(0,100),
      locale: 'ja_JP',
      type: 'website',
      images: previousImages,
    },
  }
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

  //目次機能
  const $ = cheerio.load(html);
  const headings = $('h1, h2, h3').toArray();
  const toc = headings.map((element) => ({
    text: $(element).text(),
    id: (element as any).attribs.id,
    tag: (element as any).tagName
  }));
  console.log(toc)


  if(!blog){
    notFound();
  }
  

  return(
    <>
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-4"> {/* グリッドを設定 */}
        <div className="lg:col-span-3 lg:p-10 content rounded-lg"> {/* 通常の画面サイズでは2列分のスペースを占有 */}
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
            <div className="text-lg p-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                <span className="mr-2">
                    投稿日時:
                </span>
                <span>
                    {new Date(blog.createdAt).toLocaleDateString("ja-JP", {
                        timeZone: "Asia/Tokyo",
                    })}
                </span>
            </div>
            <div className="p-2">
                <Link key={blog.category?.id} href={`/categories/${blog.category?.id}`} className="text-indigo-500 inline">
                <div className="inline group text-indigo-500 p-2 pl-4 pr-4 rounded-lg border-solid border-2 border-indigo-600">
                        {blog.category?.name}
                    </div>
                </Link>
            </div>
            <div className="mt-2 p-1">
                <ul className="list-disc list-inside">
                    {blog.tags?.map((tag) => (
                        <span key={tag.id} className="inline-block text-indigo-500 px-0.5 py-1 rounded-full  text-sm mr-2 mb-2">
                            <Link href={`/tags/${tag.id}`} className="text-indigo-500">
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
        <div className="lg:col-span-1 p-5 pt-10 hidden lg:block"> {/* 通常の画面サイズでは1列分のスペースを占有 */}
          <div className="flex justify-center">
            <div className="lg:fixed p-5" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto'}}>
              <h1 className="text-2xl mb-5 font-bold">目次</h1>
              <ul className="pl-2 scroll_bar">
                  {toc.map(data => (
                      <li key={data.id} className={`${data.tag == 'h2' ? 'ml-5' : (data.tag == 'h3' ? 'ml-10': 'ml-1')} mb-2 hover:bg-gray-500 rounded p-0.5`}>
                          <a href={`#${data.id}`}>
                              {data.text}
                          </a>
                      </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}
import {BlogProps} from "../../../libs/microcms";
import Link from "next/link";

export  const Index = ({contents} :BlogProps) => {
  return (
    <>
        {contents.map((blog) => {
            return (
            <div key={blog.id} className="w-full p-2 md:w-full lg:w-full">
                <div className="bg-white border border-gray-200 rounded-lg shadow-md">
                    <Link href={`/blogs/${blog.id}`}>
                        <img className="rounded-t-lg w-full  max-w-full" src={blog.eyecatch?.url} alt="" /> {/* 画像の高さと幅を指定 */}
                    </Link>
                <div className="p-5">
                    <Link href={`/blogs/${blog.id}`}>
                        <h5 className="mb-2 lg:text-lg font-bold tracking-tight text-gray-900 truncate md:text-base sm:text-base">
                            {blog.title}
                        </h5>
                    </Link>
                </div>
                </div>
            </div>
            );
        })}
    </>
  );
}

export default Index;

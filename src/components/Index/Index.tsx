import { BlogProps } from "../../../libs/microcms";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt,faTag } from '@fortawesome/free-solid-svg-icons'
import Link from "next/link";
export const Index = ({ contents }: BlogProps) => {

    return (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contents.map((blog) => {
                return (
                <div key={blog.id} className="w-full p-1 md:w-full lg:w-full">
                    <div className="bg-gray-800 border-gray-700 rounded-lg shadow-md text-white">
                        <Link href={`/blogs/${blog.id}`}>
                            <img
                            className="rounded-t-lg w-full max-w-full index_img"
                            src={blog.eyecatch?.url}
                            alt=""
                            />
                        </Link>
                        <div className="p-5">
                            <Link href={`/blogs/${blog.id}`}>
                            <h5 className="mb-2 lg:text-lg font-bold tracking-tight text-white truncate md:text-base sm:text-base">
                                {blog.title}
                            </h5>
                            </Link>
                            <div className="mt-2" style={{width: "130px"}}>
                                <Link key={blog.category?.id} href={`/categories/${blog.category?.id}`} className="text-indigo-400 hover:text-indigo-300">
                                    <span className="group bg-gray-700 text-gray-100 p-2 rounded-lg flex items-center transition duration-300 ease-in-out transform hover:bg-indigo-700 hover:text-gray-300 hover:scale-105">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-gray-400 mr-2 group-hover:text-indigo-400"
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
                                    </span>
                                </Link>
                            </div>
                            <div className="mt-2">
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
                            <div className="text-gray-500 text-sm float-right float-right">
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
                        </div>
                    </div>
                </div>
                );
            })}
        </div>
        </>
    );
}

export default Index;
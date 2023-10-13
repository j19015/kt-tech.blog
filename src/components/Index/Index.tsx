import { BlogProps } from "../../../libs/microcms";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt,faTag } from '@fortawesome/free-solid-svg-icons'
import Link from "next/link";

export const Index = ({ contents }: BlogProps) => {
    return (
        <div className="bg-gray-900 p-4">
            <div className="grid grid-cols-1 gap-6 font-sans">
                {contents.map((blog) => {
                    return (
                    <div key={blog.id} className="flex flex-col md:flex-row p-4 transition-transform duration-300 ease-in-out transform hover:scale-105 bg-gray-800 rounded-lg">
                        <div className="flex-none w-full md:w-1/3 mb-4 md:mb-0 md:pr-4">
                            <Link href={`/blogs/${blog.id}`}>
                                <img
                                className="rounded-lg w-full h-full"
                                src={blog.eyecatch?.url}
                                alt=""
                                />
                            </Link>
                        </div>
                        <div className="w-full md:w-2/3 text-gray-300">
                            <Link href={`/blogs/${blog.id}`}>
                            <h5 className="mb-2 text-lg font-bold tracking-tight">
                                {blog.title}
                            </h5>
                            </Link>
                            <div className="p-2 mb-2">
                                <Link key={blog.category?.id} href={`/categories/${blog.category?.id}`} className="text-indigo-400 hover:text-indigo-500 inline">
                                    <div className="inline text-white hover:text-gray-300 p-2 rounded-lg border-solid border-2 border-indigo-400">
                                        {blog.category?.name}
                                    </div>
                                </Link>
                            </div>
                            <div className="mb-2">
                                <ul className="list-disc list-inside">
                                    {blog.tags?.map((tag) => (
                                        <Link key={tag.id} href={`/tags/${tag.id}`}>
                                            <span className="inline-block text-indigo-400 px-2 py-1 rounded-full text-sm mr-2 mb-2 cursor-pointer hover:text-indigo-500">
                                                <FontAwesomeIcon icon={faTag} className="text-indigo-500" /> {tag.name}
                                            </span>
                                        </Link>
                                    ))}
                                </ul>
                            </div>
                            <div className="text-gray-400 text-sm">
                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                                <span className="mr-2">
                                    投稿日時:
                                </span>
                                <span>
                                    {new Date(blog.createdAt).toLocaleDateString("ja-JP", {
                                        timeZone: "Asia/Tokyo",
                                    }).replace(/\//g, '-')}
                                </span>
                            </div>
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Index;

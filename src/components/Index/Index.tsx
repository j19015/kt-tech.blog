import { BlogProps } from "../../../libs/microcms";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt,faTag } from '@fortawesome/free-solid-svg-icons'
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";

export const Index = ({ contents }: BlogProps) => {
    return (
        <div className="p-4">
            <div className="grid grid-cols-1 gap-6">
                {contents.map((blog) => (
                    <div key={blog.id} className="flex flex-col md:flex-row p-2 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg content shadow-lg">
                        <div className="flex-none w-full md:w-1/3 mb-4 md:mb-0 md:pr-4">
                            <Link href={`/blogs/${blog.id}`}>
                                <Image
                                    className="rounded-lg"
                                    src={blog.eyecatch?.url ? blog.eyecatch?.url : `../../../public/images/no_image`}
                                    alt=""
                                    width={1200}
                                    height={630}
                                />
                            </Link>
                        </div>
                        <div className="w-full md:w-2/3 content">
                            <Link href={`/blogs/${blog.id}`}>
                                <h5 className="lg:mb-2 text-base sm:text-lg lg:text-xl font-bold ">
                                    {blog.title}
                                </h5>
                            </Link>
                            <div className="p-0 sm:p-1 lg:p-2 pl-2">
                                <Link key={blog.category?.id} href={`/categories/${blog.category?.id}`}>
                                    <div className="inline rounded-lg text-xs sm:text-base lg:text-base sub-text-color">
                                        <FontAwesomeIcon icon={faFolderOpen} /> {blog.category?.name}
                                    </div>
                                </Link>
                            </div>
                            <div className="p-0 sm:p-1 lg:p-2 pl-2">
                                <ul className="list-disc list-inside">
                                    {blog.tags?.map((tag) => (
                                        <Link key={tag.id} href={`/tags/${tag.id}`}>
                                            <span className="inline-block rounded-full text-xs sm:text-base lg:text-base mr-2 sub-text-color">
                                                <FontAwesomeIcon icon={faTag} /> {tag.name}
                                            </span>
                                        </Link>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-0 sm:p-1 lg:p-2 pl-2 sub-text-color">
                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                                <span className="mr-2 text-xs sm:text-base lg:text-base">
                                    投稿日時:
                                </span>
                                <span className="text-xs sm:text-sm lg:text-base">
                                    {new Date(blog.createdAt).toLocaleDateString("ja-JP", {
                                        timeZone: "Asia/Tokyo",
                                    }).replace(/\//g, '-')}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Index;

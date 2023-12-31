"use client"
import Link from "next/link";
import { useEffect,useState } from 'react';
import { useSearchParams } from "next/navigation";
import { Blog, getList } from "../../../libs/microcms";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt,faTag } from '@fortawesome/free-solid-svg-icons'
import { BlogProps } from "../../../libs/microcms";
import Title from "@/components/Title/Title";
export const ClientIndex = ({ contents }: BlogProps) => {
    const searchParams = useSearchParams();
    const text = searchParams.get("text");
    const [blogContents, setBlogContents] = useState<Blog[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            if (text) {
                const filteredContents = await filterData(contents)
                setBlogContents(filteredContents);
            } else {
                setBlogContents(null);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };

        const filterData= async(contents: Blog[])=>{
            if(text){
                const filteredContents = contents.filter(content => content.body.includes(text));
                return filteredContents
            }
            else{
                return null;
            }
        }

        fetchData();
        setBlogContents(null)
    }, [text]);

    useEffect(() => {
        console.log("検索結果", blogContents);
    }, [blogContents]);

    return (
        <>
        <div className="text-center">
            <Title title={text ? text : "No Keyword"} />
        </div>
        <div className="p-4">
            <div className="grid grid-cols-1 gap-6 font-sans">
            {blogContents?.map((blog) => {
                return (
                    <div key={blog.id} className="flex flex-col md:flex-row p-2 transition-transform duration-300 ease-in-out transform hover:scale-105 rounded-lg content">
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
                                <Link key={blog.category?.id} href={`/categories/${blog.category?.id}`} className="text-indigo-500 inline">
                                    <div className="inline p-2 rounded-lg border-solid border-2 border-indigo-500 text-indigo-500">
                                        {blog.category?.name}
                                    </div>
                                </Link>
                            </div>
                            <div>
                                <ul className="list-disc list-inside">
                                    {blog.tags?.map((tag) => (
                                        <Link key={tag.id} href={`/tags/${tag.id}`}>
                                            <span className="inline-block text-indigo-500 px-2 py-1 rounded-full text-base mr-2 mb-2 cursor-pointer">
                                                <FontAwesomeIcon icon={faTag} className="text-indigo-500" /> {tag.name}
                                            </span>
                                        </Link>
                                    ))}
                                </ul>
                            </div>
                            <div className="text-gray-500 p-2 pt-0 lg:fixed lg:bottom-0 lg:right-0">
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
        </>
    );
}

export default ClientIndex;
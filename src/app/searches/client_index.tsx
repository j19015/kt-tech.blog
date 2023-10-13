"use client"
import Link from "next/link";
import { useEffect,useState } from 'react';
import { useSearchParams } from "next/navigation";
import { Blog, getList } from "../../../libs/microcms";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt,faTag } from '@fortawesome/free-solid-svg-icons'
import Title from "@/components/Title/Title";
export const ClientIndex = () => {
    const searchParams = useSearchParams();
    const text = searchParams.get("text");
    const [blogContents, setBlogContents] = useState<Blog[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const { contents } = await getList();

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogContents?.map((blog) => {
                return (
                    <div key={blog.id} className="w-full p-1 md:w-full lg:w-full transition duration-300 ease-in-out transform hover:scale-105">
                        <div className="bg-gray-800 border-gray-700 rounded-lg shadow-md text-white">
                            <Link href={`/blogs/${blog.id}`}>
                                <img
                                className="rounded-t-lg w-full max-w-full"
                                src={blog.eyecatch?.url}
                                alt=""
                                />
                            </Link>
                            <div className="p-5">
                                <Link href={`/blogs/${blog.id}`}>
                                <h5 className="mb-2 lg:text-lg font-bold tracking-tight truncate text-white md:text-base sm:text-base">
                                    {blog.title}
                                </h5>
                                </Link>
                                <div className="p-2">
                                    <Link key={blog.category?.id} href={`/categories/${blog.category?.id}`} className="text-indigo-400 hover:text-indigo-300 inline">
                                        <div className="inline group text-gray-100 p-2 pl-4 pr-4 rounded-lg border-solid border-2 border-indigo-500">
                                            {blog.category?.name}
                                        </div>
                                    </Link>
                                </div>
                                <div className="mt-2">
                                    <ul className="list-disc list-inside text-gray-400">
                                        {blog.tags?.map((tag) => (
                                            <>
                                                 <span key={tag.id} className="inline-block border-solid  text-indigo-400 px-2 py-1 rounded-full text-sm mr-2 mb-2">
                                                    <Link href={`/tags/${tag.id}`}>
                                                        <FontAwesomeIcon icon={faTag} /> {tag.name}
                                                    </Link>
                                                </span>
                                            </>
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
                                        }).replace(/\//g, '-')}
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

export default ClientIndex;
import Link from 'next/link';
import React from 'react';
import Form from '../Form/Form';
import { getList, getTagList, getCategoryList } from '../../../libs/microcms';

export const Sidebar = async () => {
    const { contents } = await getList();
    const tagList = (await getTagList()).contents;
    const categoryList = (await getCategoryList()).contents;

    // 最新記事を取得
    const latestArticles = contents.slice(0, 3);

    // アーカイブを取得
    const archives = Array.from(new Set(contents.map((item) => item.createdAt.slice(0, 7))));

    return (
        <div className="col-span-12 md:col-span-4 m-4 rounded-lg bg-gray-300 p-6">
            <Form/>

            <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">最新記事</h3>
                <ul className="list-disc text-black">
                    {latestArticles.map((article) => (
                        <li key={article.id} className="mb-2 truncate">
                            <Link href={`/blogs/${article.id}`} className="text-indigo-500 hover:text-indigo-700">
                                <strong>・</strong>{article.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">カテゴリー</h3>
                <div className="flex flex-wrap gap-2">
                    {categoryList.map((category) => (
                        <Link key={category.id} href={`/categories/${category.id}`} className="text-indigo-500">
                            <div className="group bg-gray-100 p-2 rounded-lg flex items-center transition duration-300 ease-in-out transform hover:bg-indigo-100 hover:text-indigo-500 hover:scale-105">
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
                                {category.name}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>



            <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">タグ</h3>
                <ul className="list-disc list-inside text-gray-300">
                {tagList.map((tag) => (
                    <span key={tag.id} className="inline-block bg-indigo-500 text-white px-2 py-1 rounded-full text-sm mr-2 mb-2">
                        <Link href={`/tags/${tag.id}`}>
                            {tag.name}
                        </Link>
                    </span>
                ))}
                </ul>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">アーカイブ</h3>
                <ul className="text-gray-300">
                    {archives.map((archive) => (
                        <li key={archive} className="mb-2">
                            <Link href={`/`} className="text-indigo-500 hover:text-indigo-700 truncate">
                                <strong>・</strong>{archive}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;

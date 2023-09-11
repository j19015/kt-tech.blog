import Link from 'next/link';
import React from 'react';
import { getList, getTagList,getCategoryList } from '../../../libs/microcms';

export const Sidebar = async () => {
    const { contents } = await getList();

    const tagList = (await getTagList()).contents;

    const categoryList = (await getCategoryList()).contents;

    console.log("コンテンツ",contents);
    console.log("タグリスト",tagList);
    console.log("カテゴリリスト",categoryList)

    // 注目記事を取得
    //const popularArticles = contents.filter((item) => item.isPopular);

    // 最新記事を取得
    //const latestArticles = contents.slice(0, 3); // 最新の3つの記事を表示

    // アーカイブを取得
    //const archives = Array.from(new Set(contents.map((item) => item.date.slice(0, 7))));

    return (
        <>
            <div className='col-span-12 md:col-span-4 m-4 rounded-lg bg-gray-300'>
                Sidebar
                <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
                    <h3 className="text-white font-bold mb-2">検索フォーム</h3>
                    <form className="bg-white rounded-lg shadow-md p-4">
                        <div className="flex items-center border-b border-b-2 border-gray-300 py-2">
                            <input
                                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                type="text"
                                placeholder="キーワードを入力"
                                aria-label="検索フォーム"
                            />
                            <button
                                className="flex-shrink-0 bg-indigo-500 hover:bg-indigo-700 border-indigo-500 hover:border-indigo-700 text-sm border-4 text-white py-1 px-2 rounded"
                                type="button"
                            >
                            検索
                            </button>
                        </div>
                    </form>
                </div>
                
                <div className='bg-gray-500 h-1/6 rounded-lg m-4 p-4'>
                    <h3 className="text-white font-bold mb-2">注目記事</h3>
                    <ul className="list-disc list-inside text-gray-300">
                        {/* {popularArticles.map((article) => (
                            <li key={article.id}>
                                <Link href={`/article/${article.id}`}>
                                    <a className="text-indigo-500 hover:text-indigo-700">{article.title}</a>
                                </Link>
                            </li>
                        ))} */}
                    </ul>
                </div>

                <div className='bg-gray-500 h-1/6 rounded-lg m-4 p-4'>
                    <h3 className="text-white font-bold mb-2">最新記事</h3>
                    <ul className="list-disc list-inside text-gray-300">
                        {/* {latestArticles.map((article) => (
                            <li key={article.id}>
                                <Link href={`/article/${article.id}`}>
                                    <a className="text-indigo-500 hover:text-indigo-700">{article.title}</a>
                                </Link>
                            </li>
                        ))} */}
                    </ul>
                </div>

                <div className='bg-gray-500 h-1/6 rounded-lg m-4 p-4'>
                    <h3 className="text-white font-bold mb-2">カテゴリー</h3>
                    <ul className="list-disc list-inside text-gray-300">
                        {categoryList.map((category) => (
                            <li key={category?.id}>
                                <Link href="/" className="text-indigo-500 hover:text-indigo-700">
                                    {category.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className='bg-gray-500 h-1/6 rounded-lg m-4 p-4'>
                    <h3 className="text-white font-bold mb-2">カテゴリー</h3>
                    <ul className="list-disc list-inside text-gray-300">
                        {tagList.map((tag) => (
                            <li key={tag?.id}>
                                <Link href="/" className="text-indigo-500 hover:text-indigo-700">
                                    {tag.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className='bg-gray-500 h-1/6 rounded-lg m-4 p-4'>
                    <h3 className="text-white font-bold mb-2">アーカイブ</h3>
                    <ul className="list-disc list-inside text-gray-300">
                        {/* {archives.map((archive) => (
                            <li key={archive}>
                                <Link href={`/archive/${archive}`}>
                                    <a className="text-indigo-500 hover:text-indigo-700">{archive}</a>
                                </Link>
                            </li>
                        ))} */}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Sidebar;

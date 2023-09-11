import Link from 'next/link';
import React from 'react';

export const Sidebar = () => {
  return (
    <>
        <div className='h-screen col-span-12 md:col-span-4 m-4 rounded-lg bg-gray-300'>
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
                    <li>
                        <a href="/popular-article" className="text-indigo-500 hover:text-indigo-700">注目記事1</a>
                    </li>
                    <li>
                        <a href="/popular-article" className="text-indigo-500 hover:text-indigo-700">注目記事2</a>
                    </li>
                    <li>
                        <a href="/popular-article" className="text-indigo-500 hover:text-indigo-700">注目記事3</a>
                    </li>
                </ul>
            </div>

            <div className='bg-gray-500 h-1/6 rounded-lg m-4 p-4'>
                <h3 className="text-white font-bold mb-2">最新記事</h3>
                <ul className="list-disc list-inside text-gray-300">
                    <li>
                        <a href="/new-article" className="text-indigo-500 hover:text-indigo-700">最新記事1</a>
                    </li>
                    <li>
                        <a href="/new-article" className="text-indigo-500 hover:text-indigo-700">最新記事2</a>
                    </li>
                    <li>
                        <a href="/new-article" className="text-indigo-500 hover:text-indigo-700">最新記事3</a>
                    </li>
                </ul>
            </div>

            <div className='bg-gray-500 h-1/6 rounded-lg m-4 p-4'>
                <h3 className="text-white font-bold mb-2">カテゴリー</h3>
                <ul className="list-disc list-inside text-gray-300">
                    <li>
                        <a href="/category" className="text-indigo-500 hover:text-indigo-700">カテゴリー1</a>
                    </li>
                    <li>
                        <a href="/category" className="text-indigo-500 hover:text-indigo-700">カテゴリー2</a>
                    </li>
                    <li>
                        <a href="/category" className="text-indigo-500 hover:text-indigo-700">カテゴリー3</a>
                    </li>
                </ul>
            </div>

            <div className='bg-gray-500 h-1/6 rounded-lg m-4 p-4'>
                <h3 className="text-white font-bold mb-2">アーカイブ</h3>
                <ul className="list-disc list-inside text-gray-300">
                    <li>
                        <a href="/archive" className="text-indigo-500 hover:text-indigo-700">年月1</a>
                    </li>
                    <li>
                        <a href="/archive" className="text-indigo-500 hover:text-indigo-700">年月2</a>
                    </li>
                    <li>
                        <a href="/archive" className="text-indigo-500 hover:text-indigo-700">年月3</a>
                    </li>
                </ul>
            </div>
        </div>
    </>

  );
};

export default Sidebar;
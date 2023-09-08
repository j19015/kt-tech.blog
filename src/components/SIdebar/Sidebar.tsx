import Link from 'next/link';
import React from 'react';

export const Sidebar = () => {
  return (
    <>
        <div className='h-screen col-span-12 md:col-span-4 m-4 rounded-lg bg-gray-300'>
            Sidebar
            <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
                検索Form
            </div>
            <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
                注目記事
            </div>
            <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
                最新記事
            </div>
            <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
                カテゴリー
            </div>
            <div className='bg-gray-500 h-1/6 rounded-lg m-4'>
                アーカイブ
            </div>
        </div>
    </>

  );
};

export default Sidebar;
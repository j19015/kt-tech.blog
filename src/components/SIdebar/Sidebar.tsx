import Link from 'next/link';
import React from 'react';
import Form from '../Form/Form';
import { getList, getTagList, getCategoryList } from '../../../libs/microcms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';

export const Sidebar = async () => {
  const { contents } = await getList();
  const tagList = (await getTagList()).contents;
  const categoryList = (await getCategoryList()).contents;

  // 最新記事を取得
  const latestArticles = contents.slice(0, 3);

  // アーカイブを取得
  const archives = Array.from(new Set(contents.map((item) => item.createdAt.slice(0, 7))));

  return (
    <div className='col-span-12 md:col-span-4 rounded-lg p-6 pt-4'>
      <Form />

      <div className='mb-10'>
        <h3 className='text-xl font-bold mb-4 border-b border-gray-600 pb-2'>最新記事</h3>
        {latestArticles.map((article) => (
          <>
            <div
              key={article.id}
              className='grid grid-cols-12 mb-3 transition duration-300 ease-in-out transform hover:scale-105'
            >
              <div className='col-span-4 p-1'>
                <Link href={`/blogs/${article.id}`}>
                  <img className='rounded-md' src={article.eyecatch?.url} alt='' />
                </Link>
              </div>

              <div className='col-span-8 p-2 flex items-center'>
                <div className='flex-1'>
                  <Link href={`/blogs/${article.id}`}>
                    <p className='line-clamp-2 hover:text-indigo-500'>{article.title}</p>
                  </Link>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>

      <div className='mb-10'>
        <h3 className='text-xl font-bold mb-4 border-b border-gray-600 pb-2'>カテゴリー</h3>
        <div className='flex flex-wrap gap-2'>
          {categoryList.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}/page/1`}
              className='px-0.5 py-1 transition duration-300 ease-in-out transform hover:scale-105 hover:text-indigo-500 '
            >
              <div className='inline group p-2 pl-4 pr-4 rounded-lg border-solid border-2 border-gray-500 hover:border-indigo-500'>
                {category.name}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className='mb-10'>
        <h3 className='text-xl font-bold mb-4 border-b border-gray-600 pb-2'>タグ</h3>
        <div className='flex flex-wrap gap-2'>
          {tagList.map((tag) => (
            <span
              key={tag.id}
              className='inline-block px-0.5 py-1 rounded-full hover:text-indigo-500 text-sm mr-2 mb-2 transition duration-300 ease-in-out transform hover:scale-105'
            >
              <Link href={`/tags/${tag.id}`} className='hover:text-indigo-500'>
                <FontAwesomeIcon icon={faTag} /> {tag.name}
              </Link>
            </span>
          ))}
        </div>
      </div>

      <div className='mb-10'>
        <h3 className='text-xl font-bold mb-4 border-b border-gray-600 pb-2'>アーカイブ</h3>
        <ul>
          {archives.map((archive) => (
            <li key={archive} className='mb-2'>
              <Link
                href={`/archives/${archive}`}
                className='hover:text-indigo-500 flex items-center transition duration-300 ease-in-out transform hover:scale-105'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  className='w-5 h-5 mr-2'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 5l7 7-7 7'
                  />
                </svg>
                {archive.replace(/-/g, ' - ')}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

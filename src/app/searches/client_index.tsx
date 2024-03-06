'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Blog } from '../../../libs/microcms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { BlogProps } from '../../../libs/microcms';
import Title from '@/components/Title/Title';
import Image from 'next/image';
export const ClientIndex = ({ contents }: BlogProps) => {
  const searchParams = useSearchParams();
  const text = searchParams.get('text');
  const [blogContents, setBlogContents] = useState<Blog[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (text) {
          const filteredContents = await filterData(contents);
          setBlogContents(filteredContents);
        } else {
          setBlogContents(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const filterData = async (contents: Blog[]) => {
      if (text) {
        const filteredContents = contents.filter((content) => content.body.includes(text));
        return filteredContents;
      } else {
        return null;
      }
    };

    fetchData();
    setBlogContents(null);
  }, [text]);

  useEffect(() => {
    console.log('検索結果', blogContents);
  }, [blogContents]);

  return (
    <>
      <div className='text-center'>
        <Title title={text ? text : 'No Keyword'} />
      </div>
      <div className='p-4'>
        <div className='grid grid-cols-1 gap-6'>
          {blogContents?.map((blog) => (
            <div
              key={blog.id}
              className='flex flex-col md:flex-row p-2 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg content shadow-lg'
            >
              <div className='flex-none w-full md:w-1/3 mb-4 md:mb-0 md:pr-4'>
                <Link href={`/blogs/${blog.id}`}>
                  <Image
                    className='rounded-lg'
                    src={blog.eyecatch?.url ? blog.eyecatch?.url : `/images/no_image.jpeg`}
                    alt=''
                    width={1200}
                    height={630}
                    style={{ height: '100%' }}
                  />
                </Link>
              </div>
              <div className='w-full md:w-2/3 content'>
                <Link href={`/blogs/${blog.id}`}>
                  <h5 className='lg:mb-2 text-base sm:text-lg lg:text-xl font-bold hover:underline'>
                    {blog.title}
                  </h5>
                </Link>
                <div className='p-0 sm:p-1 lg:p-2 pl-2'>
                  <Link key={blog.category?.id} href={`/categories/${blog.category?.id}`}>
                    <div className='inline rounded-lg text-xs sm:text-base lg:text-base sub-text-color'>
                      <FontAwesomeIcon icon={faFolderOpen} /> {blog.category?.name}
                    </div>
                  </Link>
                </div>
                <div className='p-0 sm:p-1 lg:p-2 pl-2'>
                  <ul className='list-disc list-inside'>
                    {blog.tags?.map((tag) => (
                      <Link key={tag.id} href={`/tags/${tag.id}`}>
                        <span className='inline-block rounded-full text-xs sm:text-base lg:text-base mr-2 sub-text-color'>
                          <FontAwesomeIcon icon={faTag} /> {tag.name}
                        </span>
                      </Link>
                    ))}
                  </ul>
                </div>
                <div className='p-0 sm:p-1 lg:p-2 pl-2 sub-text-color'>
                  <FontAwesomeIcon icon={faCalendarAlt} className='mr-1' />
                  <span className='mr-2 text-xs sm:text-base lg:text-base'>投稿日時:</span>
                  <span className='text-xs sm:text-sm lg:text-base'>
                    {new Date(blog.createdAt)
                      .toLocaleDateString('ja-JP', {
                        timeZone: 'Asia/Tokyo',
                      })
                      .replace(/\//g, '-')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClientIndex;

'use client';
import { BlogProps } from '../../../libs/notion';
import Link from 'next/link';
import Image from 'next/image';

export const Index = ({ contents }: BlogProps) => {
  return (
    <div className='max-w-3xl mx-auto px-4'>
      <div className='space-y-4'>
        {contents.map((blog) => (
          <article key={blog.id} className='group'>
            <Link href={`/blogs/${blog.id}`} className='block'>
              <div className='flex gap-5 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300'>
                {/* サムネイル画像 */}
                <div className='flex-shrink-0 relative w-28 sm:w-36 aspect-[1200/630] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700'>
                  <Image
                    src={blog.eyecatch?.url || '/images/no_image_generated.png'}
                    alt={blog.title}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                  {Date.now() - new Date(blog.createdAt).getTime() < 72 * 60 * 60 * 1000 && (
                    <span className='absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded'>
                      NEW
                    </span>
                  )}
                </div>

                {/* コンテンツ */}
                <div className='flex-1 min-w-0 flex flex-col justify-center gap-2'>
                  <h2 className='text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug'>
                    {blog.title}
                  </h2>

                  <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 dark:text-slate-400'>
                    <time className='font-medium whitespace-nowrap'>
                      {new Date(blog.createdAt).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </time>
                    <span className='text-slate-300 dark:text-slate-600'>·</span>
                    <span className='whitespace-nowrap'>{Math.max(1, Math.ceil(blog.body.length / 600))}min</span>
                    {blog.category && (
                      <span className='px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium truncate max-w-[120px]'>
                        {blog.category.name}
                      </span>
                    )}
                  </div>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className='flex flex-wrap gap-1.5 mt-0.5'>
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className='text-xs text-slate-400 dark:text-slate-500'
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* 記事がない場合 */}
      {contents.length === 0 && (
        <div className='text-center py-16 text-slate-500 dark:text-slate-300'>
          記事が見つかりませんでした
        </div>
      )}
    </div>
  );
};

export default Index;
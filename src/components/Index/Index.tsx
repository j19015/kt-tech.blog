'use client';
import { BlogProps } from '../../../libs/notion';
import Link from 'next/link';
import Image from 'next/image';

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return '今日';
  if (days === 1) return '昨日';
  if (days < 7) return `${days}日前`;
  if (days < 30) return `${Math.floor(days / 7)}週間前`;
  if (days < 365) return `${Math.floor(days / 30)}ヶ月前`;
  return `${Math.floor(days / 365)}年前`;
};

export const Index = ({ contents }: BlogProps) => {
  return (
    <div className='max-w-3xl mx-auto px-4'>
      <div className='space-y-4'>
        {contents.map((blog) => (
          <article key={blog.id} className='group'>
            <Link href={`/blogs/${blog.id}`} className='block'>
              <div className='flex gap-4 p-4 h-[140px] sm:h-[150px] rounded-xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-600 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden'>
                {/* サムネイル画像 */}
                <div className='flex-shrink-0 relative w-24 sm:w-32 h-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700'>
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
                <div className='flex-1 min-w-0 flex flex-col justify-between py-0.5'>
                  <h2 className='text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug'>
                    {blog.title}
                  </h2>

                  <div className='space-y-1.5'>
                    <div className='flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500'>
                      <time className='whitespace-nowrap' title={new Date(blog.createdAt).toLocaleDateString('ja-JP')}>
                        {new Date(blog.createdAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                      </time>
                      <span className='text-slate-300 dark:text-slate-600'>|</span>
                      <span className='whitespace-nowrap'>{Math.max(1, Math.ceil(blog.body.length / 600))}分で読める</span>
                      {blog.category && (
                        <>
                          <span className='text-slate-300 dark:text-slate-600'>|</span>
                          <span className='whitespace-nowrap truncate'>{blog.category.name}</span>
                        </>
                      )}
                    </div>

                    {blog.tags && blog.tags.length > 0 && (
                      <div className='flex gap-1.5 overflow-hidden h-4'>
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className='text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap'
                          >
                            #{tag.name}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className='text-[11px] text-slate-400 dark:text-slate-500'>...</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {contents.length === 0 && (
        <div className='text-center py-16 text-slate-500 dark:text-slate-300'>
          記事が見つかりませんでした
        </div>
      )}
    </div>
  );
};

export default Index;

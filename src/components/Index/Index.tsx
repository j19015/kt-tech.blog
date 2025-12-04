'use client';
import { BlogProps } from '../../../libs/microcms';
import Link from 'next/link';
import Image from 'next/image';

export const Index = ({ contents }: BlogProps) => {
  return (
    <div className='max-w-3xl mx-auto px-4'>
      <div className='space-y-6'>
        {contents.map((blog) => (
          <article key={blog.id} className='group'>
            <Link href={`/blogs/${blog.id}`} className='block'>
              <div className='flex gap-4'>
                {/* サムネイル画像 */}
                <div className='flex-shrink-0 relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800'>
                  <Image
                    src={blog.eyecatch?.url || '/images/no_image.jpeg'}
                    alt={blog.title}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                </div>

                {/* コンテンツ */}
                <div className='flex-1 min-w-0 space-y-2'>
                  <h2 className='text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors line-clamp-2'>
                    {blog.title}
                  </h2>

                  <div className='flex items-center gap-3 text-sm text-slate-500 dark:text-slate-300'>
                    <time>
                      {new Date(blog.createdAt).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </time>
                    {blog.category && (
                      <>
                        <span>·</span>
                        <span>{blog.category.name}</span>
                      </>
                    )}
                  </div>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className='text-xs text-slate-500 dark:text-slate-300'
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
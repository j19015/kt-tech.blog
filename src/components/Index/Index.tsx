'use client';
import { BlogProps } from '../../../libs/microcms';
import Link from 'next/link';

export const Index = ({ contents }: BlogProps) => {
  return (
    <div className='max-w-3xl mx-auto px-4'>
      <div className='space-y-8'>
        {contents.map((blog) => (
          <article key={blog.id} className='group'>
            <Link href={`/blogs/${blog.id}`} className='block'>
              <div className='space-y-2'>
                <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors line-clamp-2'>
                  {blog.title}
                </h2>

                <div className='flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400'>
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
                  <div className='flex flex-wrap gap-2 pt-1'>
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className='text-xs text-slate-500 dark:text-slate-400'
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* 記事がない場合 */}
      {contents.length === 0 && (
        <div className='text-center py-16 text-slate-500 dark:text-slate-400'>
          記事が見つかりませんでした
        </div>
      )}
    </div>
  );
};

export default Index;
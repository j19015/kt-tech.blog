'use client';
import { BlogProps } from '../../../libs/microcms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const Index = ({ contents }: BlogProps) => {
  return (
    <div className='p-4'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {contents.map((blog, index) => (
          <article
            key={blog.id}
            className='group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all duration-300 hover:shadow-lg'
          >
            <Link href={`/blogs/${blog.id}`}>
              <div className='relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900'>
                <Image
                  src={blog.eyecatch?.url || '/images/no_image.jpeg'}
                  alt={blog.title}
                  fill
                  className='object-cover group-hover:scale-105 transition-transform duration-300'
                />

                {/* カテゴリバッジ */}
                {blog.category && (
                  <div className='absolute top-4 left-4'>
                    <span className='px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-slate-100 shadow-md border border-slate-200 dark:border-slate-700'>
                      <FontAwesomeIcon icon={faFolderOpen} className='mr-1.5 w-3 h-3' />
                      {blog.category.name}
                    </span>
                  </div>
                )}

                {/* 日付 */}
                <div className='absolute bottom-4 left-4 flex items-center gap-2'>
                  <div className='px-3 py-1.5 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-sm rounded-lg text-xs text-white flex items-center gap-1.5'>
                    <Clock className='w-3 h-3' />
                    {new Date(blog.createdAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className='p-6'>
                <h3 className='font-bold text-lg mb-3 line-clamp-2 text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors'>
                  {blog.title}
                </h3>

                {/* タグ */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className='flex flex-wrap gap-2 mb-4'>
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className='inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs text-slate-600 dark:text-slate-300'
                      >
                        <FontAwesomeIcon icon={faTag} className='w-2.5 h-2.5' />
                        {tag.name}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className='px-2.5 py-1 text-xs text-slate-500 dark:text-slate-400'>
                        +{blog.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* 記事を読むリンク */}
                <div className='flex items-center justify-end'>
                  <span className='inline-flex items-center gap-2 text-sm font-medium text-cyan-600 dark:text-cyan-400'>
                    続きを読む
                    <ArrowRight className='w-4 h-4' />
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* 記事がない場合 */}
      {contents.length === 0 && (
        <div className='text-center py-12'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4'>
            <FontAwesomeIcon icon={faFolderOpen} className='w-10 h-10 text-slate-400 dark:text-slate-500' />
          </div>
          <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2'>
            記事が見つかりませんでした
          </h3>
          <p className='text-slate-600 dark:text-slate-400'>
            現在表示できる記事がありません
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;
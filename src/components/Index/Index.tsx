'use client';
import { BlogProps } from '../../../libs/microcms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const Index = ({ contents }: BlogProps) => {
  return (
    <div className='p-4'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {contents.map((blog, index) => (
          <motion.article
            key={blog.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className='group bg-card rounded-2xl overflow-hidden border border-border shadow-lg hover:shadow-xl transition-all duration-300'
          >
            <Link href={`/blogs/${blog.id}`}>
              <div className='relative h-48 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20'>
                <Image
                  src={blog.eyecatch?.url || '/images/no_image.jpeg'}
                  alt={blog.title}
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />
                
                {/* カテゴリバッジ */}
                {blog.category && (
                  <div className='absolute top-4 left-4'>
                    <span className='px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800 dark:text-gray-200 shadow-md'>
                      <FontAwesomeIcon icon={faFolderOpen} className='mr-1.5 w-3 h-3' />
                      {blog.category.name}
                    </span>
                  </div>
                )}
                
                {/* 日付 */}
                <div className='absolute bottom-4 left-4 flex items-center gap-2'>
                  <div className='px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white flex items-center gap-1.5'>
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
                <h3 className='font-bold text-lg mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
                  {blog.title}
                </h3>

                {/* タグ */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className='flex flex-wrap gap-2 mb-4'>
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className='inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-400'
                      >
                        <FontAwesomeIcon icon={faTag} className='w-2.5 h-2.5' />
                        {tag.name}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className='px-2.5 py-1 text-xs text-gray-500 dark:text-gray-400'>
                        +{blog.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* 記事を読むリンク */}
                <div className='flex items-center justify-end'>
                  <span className='inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:gap-3 transition-all'>
                    続きを読む
                    <ArrowRight className='w-4 h-4' />
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      {/* 記事がない場合 */}
      {contents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='text-center py-12'
        >
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full mb-4'>
            <FontAwesomeIcon icon={faFolderOpen} className='w-10 h-10 text-indigo-500' />
          </div>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
            記事が見つかりませんでした
          </h3>
          <p className='text-gray-600 dark:text-gray-400'>
            現在表示できる記事がありません
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Index;
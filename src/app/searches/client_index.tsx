'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Blog } from '../../../libs/microcms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag, faFolderOpen, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { BlogProps } from '../../../libs/microcms';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Search, BookOpen, Hash } from 'lucide-react';

export const ClientIndex = ({ contents }: BlogProps) => {
  const searchParams = useSearchParams();
  const text = searchParams.get('text');
  const [blogContents, setBlogContents] = useState<Blog[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (text) {
          const filteredContents = await filterData(contents);
          setBlogContents(filteredContents);
        } else {
          setBlogContents(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const filterData = async (contents: Blog[]) => {
      if (text) {
        const filteredContents = contents.filter((content) => 
          content.body.toLowerCase().includes(text.toLowerCase()) ||
          content.title.toLowerCase().includes(text.toLowerCase()) ||
          content.tags?.some(tag => tag.name.toLowerCase().includes(text.toLowerCase())) ||
          content.category?.name.toLowerCase().includes(text.toLowerCase())
        );
        return filteredContents;
      } else {
        return null;
      }
    };

    fetchData();
  }, [text, contents]);

  return (
    <div className='min-h-screen'>
      {/* Search Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900/50 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-2xl mx-4 mb-8 p-8 border border-indigo-100 dark:border-indigo-900'
      >
        <div className='text-center'>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className='inline-block mb-4'
          >
            <div className='w-16 h-16 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center'>
              <Search className='w-8 h-8 text-white' />
            </div>
          </motion.div>
          
          <h1 className='text-3xl font-bold text-foreground mb-2'>
            検索結果
          </h1>
          
          {text ? (
            <div className='flex items-center justify-center gap-2 text-lg'>
              <span className='text-muted-foreground'>キーワード:</span>
              <span className='px-4 py-2 bg-white dark:bg-gray-800 rounded-full font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'>
                "{text}"
              </span>
              <span className='text-muted-foreground'>
                {blogContents ? `(${blogContents.length}件)` : ''}
              </span>
            </div>
          ) : (
            <p className='text-muted-foreground'>
              検索キーワードを入力してください
            </p>
          )}
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className='flex justify-center items-center py-12'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className='w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full'
          />
        </div>
      )}

      {/* Search Results */}
      <AnimatePresence mode='wait'>
        {!isLoading && blogContents && blogContents.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='p-4'
          >
            <div className='grid grid-cols-1 gap-6 max-w-5xl mx-auto'>
              {blogContents.map((blog, index) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className='group bg-card rounded-2xl overflow-hidden border border-border shadow-lg hover:shadow-xl transition-all duration-300'
                >
                  <Link href={`/blogs/${blog.id}`}>
                    <div className='flex flex-col md:flex-row'>
                      {/* Thumbnail */}
                      <div className='relative w-full md:w-1/3 h-48 md:h-auto overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20'>
                        <Image
                          src={blog.eyecatch?.url || '/images/no_image.jpeg'}
                          alt={blog.title}
                          fill
                          className='object-cover group-hover:scale-110 transition-transform duration-500'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent' />
                        
                        {/* Category Badge */}
                        {blog.category && (
                          <div className='absolute top-4 left-4'>
                            <span className='px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800 dark:text-gray-200 shadow-md'>
                              <FontAwesomeIcon icon={faFolderOpen} className='mr-1.5 w-3 h-3' />
                              {blog.category.name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className='flex-1 p-6'>
                        <h2 className='text-xl font-bold mb-3 text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2'>
                          {blog.title}
                        </h2>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className='flex flex-wrap gap-2 mb-4'>
                            {blog.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag.id}
                                className='inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-xs text-indigo-700 dark:text-indigo-300'
                              >
                                <Hash className='w-3 h-3' />
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

                        {/* Meta Info */}
                        <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                          <div className='flex items-center gap-1'>
                            <Clock className='w-4 h-4' />
                            <time>
                              {new Date(blog.createdAt).toLocaleDateString('ja-JP', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </time>
                          </div>
                          <div className='flex items-center gap-1'>
                            <BookOpen className='w-4 h-4' />
                            <span>続きを読む →</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </motion.div>
        ) : !isLoading && blogContents && blogContents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='text-center py-16'
          >
            <div className='inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full mb-6'>
              <Search className='w-12 h-12 text-gray-400' />
            </div>
            <h3 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3'>
              検索結果が見つかりませんでした
            </h3>
            <p className='text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6'>
              キーワード "{text}" に一致する記事が見つかりませんでした。
              他のキーワードで検索してみてください。
            </p>
            <Link href='/blogs/page/1'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all'
              >
                ブログ一覧を見る
              </motion.button>
            </Link>
          </motion.div>
        ) : !text ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-center py-16'
          >
            <div className='inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full mb-6'>
              <Search className='w-12 h-12 text-indigo-500' />
            </div>
            <h3 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3'>
              キーワードを入力してください
            </h3>
            <p className='text-gray-600 dark:text-gray-400 max-w-md mx-auto'>
              上部の検索フォームからキーワードを入力して、
              記事を検索することができます。
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default ClientIndex;
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '../../../libs/microcms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

interface RelatedPostsProps {
  posts: Blog[];
  currentPostId: string;
}

export const RelatedPosts = ({ posts, currentPostId }: RelatedPostsProps) => {
  const relatedPosts = posts.filter(post => post.id !== currentPostId).slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className='mt-20 relative'
    >
      {/* 背景のグラデーション */}
      <div className='absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 rounded-3xl blur-3xl' />
      
      <div className='relative p-8 bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-xl'>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='flex items-center gap-3 mb-8'
        >
          <div className='w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xl'>
            📖
          </div>
          <h2 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
            おすすめの記事
          </h2>
        </motion.div>

        <div className='grid gap-6 md:grid-cols-3'>
          {relatedPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className='group'
            >
              <Link href={`/blogs/${post.id}`}>
                <div className='relative overflow-hidden rounded-xl bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 border border-border hover:border-indigo-500/50 transition-all duration-300'>
                  <div className='relative h-48 overflow-hidden'>
                    <Image
                      src={post.eyecatch?.url || '/images/no_image.jpeg'}
                      alt={post.title}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />
                    
                    {post.category && (
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className='absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-medium shadow-lg text-gray-800 dark:text-gray-200'
                      >
                        {post.category.name}
                      </motion.span>
                    )}
                  </div>

                  <div className='p-5'>
                    <h3 className='font-bold text-sm line-clamp-2 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
                      {post.title}
                    </h3>
                    
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                        <FontAwesomeIcon icon={faCalendarAlt} className='w-3 h-3' />
                        <time>
                          {new Date(post.createdAt).toLocaleDateString('ja-JP')}
                        </time>
                      </div>
                      
                      <motion.div 
                        className='flex items-center gap-1 text-indigo-600 dark:text-indigo-400'
                        whileHover={{ x: 5 }}
                      >
                        <span className='text-xs font-medium'>読む</span>
                        <FontAwesomeIcon icon={faArrowRight} className='w-3 h-3' />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className='mt-8 text-center'
        >
          <Link 
            href='/blogs/page/1' 
            className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105'
          >
            <span className='font-medium'>もっと記事を見る</span>
            <FontAwesomeIcon icon={faArrowRight} className='w-4 h-4' />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};
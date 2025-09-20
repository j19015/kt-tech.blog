'use client';
import Link from 'next/link';
import React from 'react';
import Form from '../Form/Form';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faFolder, faCalendarDays, faNewspaper, faClock } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

interface SidebarProps {
  latestArticles: any[];
  tagList: any[];
  categoryList: any[];
  archives: string[];
}

const SidebarClient = ({ latestArticles, tagList, categoryList, archives }: SidebarProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className='space-y-6 p-4 pt-6'
    >
      {/* 検索フォーム */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 p-6 rounded-2xl border border-border backdrop-blur-sm'
      >
        <Form />
      </motion.div>

      {/* 最新記事 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='bg-card/80 backdrop-blur-sm p-6 rounded-2xl border border-border shadow-lg'
      >
        <h3 className='text-lg font-bold mb-5 flex items-center gap-2 text-foreground'>
          <div className='w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white'>
            <FontAwesomeIcon icon={faNewspaper} className='w-4 h-4' />
          </div>
          最新記事
        </h3>
        <div className='space-y-4'>
          {latestArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className='group'
            >
              <Link href={`/blogs/${article.id}`} className='flex gap-3'>
                <div className='relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden'>
                  <Image
                    src={article.eyecatch?.url || '/images/no_image.jpeg'}
                    alt={article.title}
                    fill
                    className='object-cover group-hover:scale-110 transition-transform duration-300'
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm line-clamp-2 text-muted-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
                    {article.title}
                  </p>
                  <p className='text-xs text-muted-foreground mt-1 flex items-center gap-1'>
                    <FontAwesomeIcon icon={faClock} className='w-3 h-3' />
                    {new Date(article.createdAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* カテゴリー */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='bg-card/80 backdrop-blur-sm p-6 rounded-2xl border border-border shadow-lg'
      >
        <h3 className='text-lg font-bold mb-5 flex items-center gap-2 text-foreground'>
          <div className='w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white'>
            <FontAwesomeIcon icon={faFolder} className='w-4 h-4' />
          </div>
          カテゴリー
        </h3>
        <div className='flex flex-wrap gap-2'>
          {categoryList.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href={`/categories/${category.id}/page/1`}
                className='inline-block px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-800/30 dark:hover:to-purple-800/30 rounded-full text-sm text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all duration-300 border border-indigo-200 dark:border-indigo-800/50'
              >
                {category.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* タグ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className='bg-card/80 backdrop-blur-sm p-6 rounded-2xl border border-border shadow-lg'
      >
        <h3 className='text-lg font-bold mb-5 flex items-center gap-2 text-foreground'>
          <div className='w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white'>
            <FontAwesomeIcon icon={faTag} className='w-4 h-4' />
          </div>
          タグ
        </h3>
        <div className='flex flex-wrap gap-2'>
          {tagList.map((tag, index) => (
            <motion.span
              key={tag.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.03 }}
              whileHover={{ y: -2 }}
              className='inline-block'
            >
              <Link 
                href={`/tags/${tag.id}`} 
                className='inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700/50 dark:to-gray-600/50 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600/60 dark:hover:to-gray-500/60 rounded-full text-xs text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all duration-300 border border-gray-300 dark:border-gray-600/50'
              >
                <FontAwesomeIcon icon={faTag} className='w-3 h-3' />
                {tag.name}
              </Link>
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* アーカイブ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className='bg-card/80 backdrop-blur-sm p-6 rounded-2xl border border-border shadow-lg'
      >
        <h3 className='text-lg font-bold mb-5 flex items-center gap-2 text-foreground'>
          <div className='w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white'>
            <FontAwesomeIcon icon={faCalendarDays} className='w-4 h-4' />
          </div>
          アーカイブ
        </h3>
        <ul className='space-y-2'>
          {archives.map((archive, index) => (
            <motion.li 
              key={archive}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              whileHover={{ x: 5 }}
            >
              <Link
                href={`/archives/${archive}`}
                className='flex items-center gap-2 text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm'
              >
                <FontAwesomeIcon icon={faCalendarDays} className='w-3 h-3' />
                {archive.replace('-', '年')}月
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default SidebarClient;
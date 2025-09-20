'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, Compass } from 'lucide-react';

export default function Custom404() {
  return (
    <div className='min-h-[80vh] flex items-center justify-center p-4'>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className='max-w-2xl w-full text-center'
      >
        {/* 404 Number Animation */}
        <motion.div 
          className='relative mb-8'
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
        >
          <div className='text-[150px] md:text-[200px] font-bold leading-none'>
            <span className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
              404
            </span>
          </div>
          <motion.div 
            className='absolute inset-0 text-[150px] md:text-[200px] font-bold leading-none opacity-20 blur-3xl'
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity 
            }}
          >
            <span className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
              404
            </span>
          </motion.div>
        </motion.div>

        {/* Lost Animation Icon */}
        <motion.div 
          className='flex justify-center mb-6'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              y: [0, -10, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className='relative'
          >
            <Compass className='w-20 h-20 text-indigo-500' />
            <motion.div 
              className='absolute inset-0'
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <div className='absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full' />
              <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full' />
              <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-indigo-500 rounded-full' />
              <div className='absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-purple-500 rounded-full' />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='mb-8'
        >
          <h1 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
            ページが見つかりません
          </h1>
          <p className='text-lg text-muted-foreground max-w-md mx-auto'>
            お探しのページは移動したか、削除された可能性があります。
            URLをご確認いただくか、下記のボタンからお戻りください。
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className='flex flex-col sm:flex-row gap-4 justify-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href='/'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='group px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center'
            >
              <Home className='w-5 h-5' />
              ホームに戻る
              <motion.span
                className='inline-block'
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </Link>
          
          <Link href='/blogs/page/1'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center'
            >
              <Search className='w-5 h-5' />
              ブログ一覧を見る
            </motion.button>
          </Link>
        </motion.div>

        {/* Decorative Background */}
        <div className='absolute inset-0 -z-10 overflow-hidden'>
          <motion.div 
            className='absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20'
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div 
            className='absolute bottom-20 right-10 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20'
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, delay: 5 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
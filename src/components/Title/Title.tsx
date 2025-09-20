'use client';
import { motion } from 'framer-motion';
import { Search, Hash, Tag, FolderOpen, Calendar, TrendingUp } from 'lucide-react';

export const Title = (props: { 
  title: string;
  type?: 'search' | 'category' | 'tag' | 'archive' | 'blog' | 'default';
  count?: number;
}) => {
  const getIcon = () => {
    switch (props.type) {
      case 'search':
        return <Search className='w-8 h-8' />;
      case 'category':
        return <FolderOpen className='w-8 h-8' />;
      case 'tag':
        return <Tag className='w-8 h-8' />;
      case 'archive':
        return <Calendar className='w-8 h-8' />;
      case 'blog':
        return <TrendingUp className='w-8 h-8' />;
      default:
        return <Hash className='w-8 h-8' />;
    }
  };

  const getGradient = () => {
    switch (props.type) {
      case 'search':
        return 'from-blue-500 to-cyan-500';
      case 'category':
        return 'from-purple-500 to-pink-500';
      case 'tag':
        return 'from-green-500 to-teal-500';
      case 'archive':
        return 'from-orange-500 to-red-500';
      case 'blog':
        return 'from-indigo-500 to-purple-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='py-8 px-6 mb-6 text-center'
    >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
          className='inline-flex items-center justify-center mb-4'
        >
          <div className={`w-16 h-16 bg-gradient-to-r ${getGradient()} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
            {getIcon()}
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='text-3xl md:text-4xl lg:text-5xl font-bold mb-2'
        >
          {props.title === 'No Keyword' ? (
            <span className='bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent'>
              キーワードが入力されていません
            </span>
          ) : (
            <span className='bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
              {props.title}
            </span>
          )}
        </motion.h1>
        
        {props.type === 'search' && props.title !== 'No Keyword' && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className='text-muted-foreground'
          >
            「{props.title}」の検索結果
          </motion.p>
        )}
        
        {props.count !== undefined && props.count > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className='inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md'
          >
            <span className='text-sm font-medium text-muted-foreground'>
              {props.count}件の記事
            </span>
          </motion.div>
        )}
    </motion.div>
  );
};

export default Title;
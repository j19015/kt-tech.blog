'use client';
import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Form = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    return (
        <motion.form 
            action={`/searches`} 
            method='get'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className='relative group'>
                {/* グラデーションボーダー効果 */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300 ${isFocused ? 'opacity-100' : ''}`} />
                
                {/* メインコンテナ */}
                <div className='relative bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300'>
                    <div className='flex items-center px-4 py-3'>
                        {/* 左側アイコン */}
                        <div className='flex items-center justify-center mr-3'>
                            <motion.div
                                animate={{ rotate: isFocused ? 360 : 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Search className={`w-5 h-5 transition-colors duration-300 ${
                                    isFocused 
                                        ? 'text-indigo-500' 
                                        : 'text-gray-400 dark:text-gray-500'
                                }`} />
                            </motion.div>
                        </div>
                        
                        {/* 入力フィールド */}
                        <input
                            className='flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none'
                            type='text'
                            name='text'
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder='記事を検索...'
                            aria-label='検索フォーム'
                        />
                        
                        {/* 検索ボタン */}
                        <motion.button
                            type='submit'
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`ml-2 px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                                searchValue || isFocused
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white opacity-100'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 opacity-50'
                            }`}
                        >
                            <span className='flex items-center gap-1'>
                                <Sparkles className='w-3 h-3' />
                                検索
                            </span>
                        </motion.button>
                    </div>
                    
                    {/* フォーカス時の下部アクセント */}
                    <motion.div 
                        className='h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500'
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isFocused ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ transformOrigin: 'left' }}
                    />
                </div>
                
            </div>
        </motion.form>
    );
};

export default Form;
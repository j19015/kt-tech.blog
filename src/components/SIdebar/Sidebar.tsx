'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import Form from '../Form/Form';
import { Clock, FolderOpen, Tag, Calendar, ChevronDown } from 'lucide-react';

interface SidebarProps {
  latestArticles: any[];
  tagList: any[];
  categoryList: any[];
  archives: string[];
}

const SidebarClient = ({ latestArticles, tagList, categoryList, archives }: SidebarProps) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const visibleTags = showAllTags ? tagList : tagList.slice(0, 15);

  return (
    <div className='space-y-8 p-4'>
      {/* 検索フォーム */}
      <div className='border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900'>
        <Form />
      </div>

      {/* 最新記事 */}
      <div className='border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900'>
        <h3 className='flex items-center gap-2 text-sm font-bold mb-4 text-slate-900 dark:text-slate-100'>
          <Clock className='w-4 h-4' />
          最新記事
        </h3>
        <ul className='space-y-3'>
          {latestArticles.map((article) => (
            <li key={article.id}>
              <Link
                href={`/blogs/${article.id}`}
                className='block text-sm text-slate-600 dark:text-slate-300 line-clamp-2 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
              >
                {article.title}
              </Link>
              <p className='text-xs text-slate-500 dark:text-slate-300 mt-1'>
                {new Date(article.createdAt).toLocaleDateString('ja-JP')}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* カテゴリー */}
      <div className='border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900'>
        <h3 className='flex items-center gap-2 text-sm font-bold mb-4 text-slate-900 dark:text-slate-100'>
          <FolderOpen className='w-4 h-4' />
          カテゴリー
        </h3>
        <div className='flex flex-wrap gap-2'>
          {categoryList.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}/page/1`}
              className='text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* タグ */}
      <div className='border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900'>
        <h3 className='flex items-center gap-2 text-sm font-bold mb-4 text-slate-900 dark:text-slate-100'>
          <Tag className='w-4 h-4' />
          タグ
        </h3>
        <div className='flex flex-wrap gap-1.5'>
          {visibleTags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.id}`}
              className='text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
            >
              #{tag.name}
            </Link>
          ))}
        </div>
        {tagList.length > 15 && (
          <button
            onClick={() => setShowAllTags(!showAllTags)}
            className='mt-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 transition-colors'
          >
            <ChevronDown className={`w-3 h-3 transition-transform ${showAllTags ? 'rotate-180' : ''}`} />
            {showAllTags ? '閉じる' : `他${tagList.length - 15}件を表示`}
          </button>
        )}
      </div>

      {/* アーカイブ */}
      <div className='border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900'>
        <h3 className='flex items-center gap-2 text-sm font-bold mb-4 text-slate-900 dark:text-slate-100'>
          <Calendar className='w-4 h-4' />
          アーカイブ
        </h3>
        <ul className='space-y-2'>
          {archives.map((archive) => (
            <li key={archive}>
              <Link
                href={`/archives/${archive}`}
                className='text-sm text-slate-600 dark:text-slate-300'
              >
                {archive.replace('-', '年')}月
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarClient;
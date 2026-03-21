'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import Form from '../Form/Form';
import { Clock, FolderOpen, Tag, Calendar, ChevronDown, Shuffle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReadingStats } from '../ReadingStats/ReadingStats';

interface SidebarProps {
  latestArticles: any[];
  tagList: any[];
  categoryList: any[];
  archives: string[];
  totalCount?: number;
}

const SidebarClient = ({ latestArticles, tagList, categoryList, archives, totalCount }: SidebarProps) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const visibleTags = showAllTags ? tagList : tagList.slice(0, 15);
  const router = useRouter();

  const handleRandomArticle = () => {
    const randomIndex = Math.floor(Math.random() * latestArticles.length);
    router.push(`/blogs/${latestArticles[randomIndex].id}`);
  };

  return (
    <div className='p-4'>
      {/* 記事数 + ランダム記事 */}
      <div className='flex items-center justify-center gap-3 mb-4'>
        {totalCount && (
          <p className='text-xs text-slate-400 dark:text-slate-500'>
            <span className='text-lg font-bold text-slate-900 dark:text-slate-100'>{totalCount}</span> 記事
          </p>
        )}
        <ReadingStats />
        <button
          onClick={handleRandomArticle}
          className='flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors'
          aria-label='ランダムな記事を読む'
        >
          <Shuffle className='w-3 h-3' />
          ランダム
        </button>
      </div>

      {/* 検索フォーム - always full width */}
      <div className='border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900 mb-6'>
        <Form />
      </div>

      {/* SP: 2-column grid / Desktop: stacked */}
      <div className='grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6'>

        {/* 最新記事 - SP: full width on top */}
        <div className='col-span-2 lg:col-span-1 border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900'>
          <h3 className='flex items-center gap-2 text-sm font-bold mb-4 text-slate-900 dark:text-slate-100'>
            <Clock className='w-4 h-4' />
            最新記事
          </h3>
          {/* SP: horizontal scroll / Desktop: vertical list */}
          <div className='flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 snap-x snap-mandatory'>
            {latestArticles.slice(0, 5).map((article) => (
              <Link
                key={article.id}
                href={`/blogs/${article.id}`}
                className='flex-shrink-0 w-[200px] lg:w-auto snap-start group'
              >
                <p className='text-sm text-slate-600 dark:text-slate-300 line-clamp-2 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors'>
                  {article.title}
                </p>
                <p className='text-xs text-slate-400 dark:text-slate-500 mt-1'>
                  {new Date(article.createdAt).toLocaleDateString('ja-JP')}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* カテゴリー */}
        <div className='col-span-1 border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900'>
          <h3 className='flex items-center gap-2 text-sm font-bold mb-3 text-slate-900 dark:text-slate-100'>
            <FolderOpen className='w-4 h-4' />
            カテゴリー
          </h3>
          <div className='flex flex-wrap gap-1.5'>
            {categoryList.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}/page/1`}
                className='text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* アーカイブ */}
        <div className='col-span-1 border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900'>
          <h3 className='flex items-center gap-2 text-sm font-bold mb-3 text-slate-900 dark:text-slate-100'>
            <Calendar className='w-4 h-4' />
            アーカイブ
          </h3>
          <div className='flex flex-wrap gap-1.5'>
            {archives.map((archive) => (
              <Link
                key={archive}
                href={`/archives/${archive}`}
                className='text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
              >
                {archive.replace('-', '年')}月
              </Link>
            ))}
          </div>
        </div>

        {/* タグ - full width */}
        <div className='col-span-2 lg:col-span-1 border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900'>
          <h3 className='flex items-center gap-2 text-sm font-bold mb-3 text-slate-900 dark:text-slate-100'>
            <Tag className='w-4 h-4' />
            タグ
          </h3>
          <div className='flex flex-wrap gap-1.5'>
            {visibleTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.id}`}
                className='text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
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
      </div>
    </div>
  );
};

export default SidebarClient;

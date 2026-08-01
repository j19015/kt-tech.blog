'use client';
import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { addBookmark, removeBookmark, isBookmarked as checkBookmarked } from '@/lib/bookmarks';

export const BookmarkButton = ({ articleId, title }: { articleId: string; title: string }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    setIsBookmarked(checkBookmarked(articleId));
  }, [articleId]);

  const toggle = () => {
    try {
      if (isBookmarked) {
        removeBookmark(articleId);
        setIsBookmarked(false);
      } else {
        addBookmark({ id: articleId, title, savedAt: new Date().toISOString() });
        setIsBookmarked(true);
      }
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border whitespace-nowrap transition-colors ${
        isBookmarked
          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
      }`}
      aria-label={isBookmarked ? 'ブックマークを解除' : 'ブックマークに追加'}
    >
      {isBookmarked ? <BookmarkCheck className='w-3.5 h-3.5' aria-hidden='true' /> : <Bookmark className='w-3.5 h-3.5' aria-hidden='true' />}
      {isBookmarked ? '保存済み' : 'あとで読む'}
    </button>
  );
};

'use client';
import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

const STORAGE_KEY = 'kt-tech-bookmarks';

export const BookmarkButton = ({ articleId, title }: { articleId: string; title: string }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as { id: string }[];
      setIsBookmarked(stored.some(b => b.id === articleId));
    } catch {}
  }, [articleId]);

  const toggle = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as { id: string; title: string; savedAt: string }[];
      if (isBookmarked) {
        const filtered = stored.filter(b => b.id !== articleId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        setIsBookmarked(false);
      } else {
        stored.unshift({ id: articleId, title, savedAt: new Date().toISOString() });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored.slice(0, 50)));
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
      {isBookmarked ? <BookmarkCheck className='w-3.5 h-3.5' /> : <Bookmark className='w-3.5 h-3.5' />}
      {isBookmarked ? '保存済み' : 'あとで読む'}
    </button>
  );
};

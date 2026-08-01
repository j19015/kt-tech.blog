'use client';
import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { READ_ARTICLES_KEY, getReadArticles } from '@/lib/readArticles';

export const useReadingTracker = (articleId?: string) => {
  useEffect(() => {
    if (!articleId || typeof window === 'undefined') return;
    try {
      const stored = getReadArticles();
      if (!stored.includes(articleId)) {
        localStorage.setItem(READ_ARTICLES_KEY, JSON.stringify([...stored, articleId]));
      }
    } catch {}
  }, [articleId]);
};

export const ReadingStats = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    try {
      setCount(getReadArticles().length);
    } catch {}
  }, []);

  if (count === 0) return null;

  return (
    <div className='flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500'>
      <BookOpen className='w-3.5 h-3.5' />
      <span>{count}記事読了</span>
    </div>
  );
};

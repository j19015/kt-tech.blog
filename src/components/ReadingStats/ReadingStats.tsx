'use client';
import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';

const STORAGE_KEY = 'kt-tech-read-articles';

export const useReadingTracker = (articleId?: string) => {
  useEffect(() => {
    if (!articleId || typeof window === 'undefined') return;
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[];
      if (!stored.includes(articleId)) {
        stored.push(articleId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      }
    } catch {}
  }, [articleId]);
};

export const ReadingStats = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[];
      setCount(stored.length);
    } catch {}
  }, []);

  if (count === 0) return null;

  return (
    <div className='flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500'>
      <BookOpen className='w-3.5 h-3.5' />
      <span>{count}記事読了</span>
    </div>
  );
};

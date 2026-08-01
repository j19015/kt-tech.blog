'use client';
import { useEffect } from 'react';
import { READ_ARTICLES_KEY, getReadArticles } from '@/lib/readArticles';

export const ReadingTracker = ({ articleId }: { articleId: string }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = getReadArticles();
      if (!stored.includes(articleId)) {
        localStorage.setItem(READ_ARTICLES_KEY, JSON.stringify([...stored, articleId]));
      }
    } catch {}
  }, [articleId]);

  return null;
};

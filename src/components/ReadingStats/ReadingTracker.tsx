'use client';
import { useEffect } from 'react';

const STORAGE_KEY = 'kt-tech-read-articles';

export const ReadingTracker = ({ articleId }: { articleId: string }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[];
      if (!stored.includes(articleId)) {
        stored.push(articleId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      }
    } catch {}
  }, [articleId]);

  return null;
};

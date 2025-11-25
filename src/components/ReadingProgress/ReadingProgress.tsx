'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const isBlogPost = pathname?.includes('/blogs/') && !pathname?.includes('/page/');

  useEffect(() => {
    if (!isBlogPost) {
      setProgress(0);
      return;
    }

    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBlogPost, pathname]);

  if (!isBlogPost) return null;

  return (
    <div className='fixed top-0 left-0 w-full h-1 z-50 bg-slate-200 dark:bg-slate-800'>
      <div
        className='h-full bg-slate-900 dark:bg-slate-100 transition-all duration-150 ease-out'
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
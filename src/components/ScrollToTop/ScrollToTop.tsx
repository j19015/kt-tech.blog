'use client';
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-slate-900/80 dark:bg-slate-100/80 text-white dark:text-slate-900 backdrop-blur-sm shadow-lg hover:bg-slate-900 dark:hover:bg-slate-100 hover:scale-110 active:scale-95 transition-all duration-200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label='トップへ戻る'
    >
      <ArrowUp className='w-5 h-5' />
    </button>
  );
};

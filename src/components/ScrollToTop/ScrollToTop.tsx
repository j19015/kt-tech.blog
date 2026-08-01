'use client';
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { FAB_BASE, FAB_SLOT, FAB_Z } from '@/lib/fab';

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
      className={`${FAB_BASE} ${FAB_SLOT.first} ${FAB_Z.scrollTop} bg-slate-900/80 text-white backdrop-blur-sm hover:scale-110 hover:bg-slate-900 dark:bg-slate-100/80 dark:text-slate-900 dark:hover:bg-slate-100 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label='トップへ戻る'
      // 非表示のときは支援技術からも隠し、Tabでフォーカスが飛ばないようにする。
      // opacity-0 だけでは「見えないボタン」が読み上げ・タブ順に残ってしまう。
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      <ArrowUp className='w-5 h-5' aria-hidden='true' />
    </button>
  );
};

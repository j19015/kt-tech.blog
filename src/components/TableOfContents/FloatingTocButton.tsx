'use client';
import { useState } from 'react';
import { List, X } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  tag: string;
}

export const FloatingTocButton = ({ toc }: { toc: TocItem[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (toc.length === 0) return null;

  return (
    <div className='lg:hidden'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        // 右下のFABは ScrollToTop → 目次 → 共有 の順に 2.5rem 間隔で並べる
        className='fixed bottom-[4.5rem] right-6 z-40 w-11 h-11 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 active:scale-95 transition-all'
        aria-label={isOpen ? '目次を閉じる' : '目次を開く'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className='w-5 h-5' /> : <List className='w-5 h-5' />}
      </button>

      {isOpen && (
        <>
          <div className='fixed inset-0 z-30 bg-black/20' onClick={() => setIsOpen(false)} />
          <nav aria-label='目次' className='fixed bottom-[7.5rem] left-4 right-4 z-40 max-h-[60vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-4'>
            <h3 className='text-sm font-bold text-slate-900 dark:text-slate-100 mb-3'>目次</h3>
            <ul className='space-y-2'>
              {toc.map((item) => (
                <li key={item.id} className={item.tag === 'h2' ? 'ml-2' : item.tag === 'h3' ? 'ml-5' : ''}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setIsOpen(false)}
                    className='block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

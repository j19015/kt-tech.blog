'use client';
import { useState } from 'react';
import { List, X } from 'lucide-react';
import { tocDepth, type TocItem } from '@/lib/toc';
import { FAB_BASE, FAB_SLOT, FAB_Z, FAB_PANEL_Z, FAB_OVERLAY_Z } from '@/lib/fab';

export const FloatingTocButton = ({ toc }: { toc: TocItem[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (toc.length === 0) return null;

  return (
    <div className='lg:hidden'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${FAB_BASE} ${FAB_SLOT.second} ${FAB_Z.toc} bg-blue-500 text-white hover:bg-blue-600`}
        aria-label={isOpen ? '目次を閉じる' : '目次を開く'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className='w-5 h-5' aria-hidden='true' /> : <List className='w-5 h-5' aria-hidden='true' />}
      </button>

      {isOpen && (
        <>
          <div className={`fixed inset-0 ${FAB_OVERLAY_Z} bg-black/20`} onClick={() => setIsOpen(false)} />
          <nav
            aria-label='目次'
            className={`fixed bottom-[11rem] left-4 right-4 ${FAB_PANEL_Z} max-h-[60vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900`}
          >
            <h3 className='text-sm font-bold text-slate-900 dark:text-slate-100 mb-3'>目次</h3>
            <ul className='space-y-2'>
              {toc.map((item) => (
                <li key={item.id} className={['', 'ml-3', 'ml-6'][tocDepth(item.tag)]}>
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

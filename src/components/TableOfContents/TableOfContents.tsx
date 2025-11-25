'use client';
import { useState, useRef, useEffect } from 'react';

export const TableOfContents = ({ toc }: { toc: any }) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = isOpen ? `${contentRef.current.scrollHeight}px` : '0px';
    }
  }, [isOpen]);

  return (
    <div className='lg:hidden border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 my-8 mx-4'>
      <button
        onClick={() => setOpen(!isOpen)}
        className='w-full flex justify-between items-center px-4 py-3 text-left'
      >
        <span className='font-bold text-slate-900 dark:text-slate-100'>目次</span>
        <span className='text-slate-500 dark:text-slate-300 text-sm'>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        ref={contentRef}
        className='overflow-hidden transition-all duration-200'
        style={{ height: '0px' }}
      >
        <ul className='px-4 pb-4 space-y-2'>
          {toc.map((data: any) => (
            <li
              key={data.id}
              className={`${
                data.tag === 'h2' ? 'ml-4' : data.tag === 'h3' ? 'ml-8' : ''
              }`}
            >
              <a
                href={`#${data.id}`}
                className='text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
              >
                {data.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TableOfContents;

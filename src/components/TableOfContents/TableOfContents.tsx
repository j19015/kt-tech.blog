'use client';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

export const TableOfContents = ({ toc }: { toc: any }) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = isOpen ? `${contentRef.current.scrollHeight}px` : '0px';
    }
  }, [isOpen]);

  return (
    <div className='lg:hidden border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 m-5 mt-10 p-1 shadow-md'>
      <div className='flex justify-between px-3 py-2 cursor-pointer' onClick={() => setOpen(!isOpen)}>
        <h1 className='text-lg font-bold text-slate-900 dark:text-slate-100' style={{ marginTop: '0px !important' }}>
          目次
        </h1>
        <span className='text-lg text-cyan-600 dark:text-cyan-400'>
          <FontAwesomeIcon icon={isOpen ? faMinus : faPlus} />
        </span>
      </div>
      <div
        ref={contentRef}
        className='overflow-hidden transition-all duration-300 ease-in-out'
        style={{ height: '0px' }}
      >
        <ul className='pl-2 mt-3 pb-2'>
          {toc.map((data: any) => (
            <a key={data.id} href={`#${data.id}`}>
              <li
                className={`${
                  data.tag === 'h2' ? 'ml-5' : data.tag === 'h3' ? 'ml-10' : 'ml-1'
                } mb-2 py-2 px-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-lg transition-colors duration-200`}
              >
                <div className='flex'>
                  <span>{data.tag === 'h1' ? '・' : '-'}</span>
                  <span className='ml-2'>{data.text}</span>
                </div>
              </li>
            </a>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TableOfContents;

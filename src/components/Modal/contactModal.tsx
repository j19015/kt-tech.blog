'use client';
import React from 'react';
import { X, Github } from 'lucide-react';
import Link from 'next/link';

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
);

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} className='fixed inset-0 z-50 bg-black/40' />
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden'>
          <div className='border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between'>
            <h2 className='text-lg font-bold text-slate-900 dark:text-slate-100'>
              お問い合わせ
            </h2>
            <button onClick={onClose} className='p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors'>
              <X className='w-4 h-4 text-slate-500' />
            </button>
          </div>

          <div className='px-6 py-6 space-y-5'>
            <p className='text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
              お問い合わせは以下のSNSからお気軽にどうぞ。
            </p>

            <div className='space-y-3'>
              <Link
                href='https://x.com/meow_koki'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-3 px-4 py-3 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
              >
                <XIcon className='w-5 h-5 text-slate-700 dark:text-slate-300' />
                <div>
                  <p className='text-sm font-medium text-slate-800 dark:text-slate-200'>X (Twitter)</p>
                  <p className='text-xs text-slate-500'>@meow_koki</p>
                </div>
              </Link>

              <Link
                href='https://github.com/j19015'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-3 px-4 py-3 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
              >
                <Github className='w-5 h-5 text-slate-700 dark:text-slate-300' />
                <div>
                  <p className='text-sm font-medium text-slate-800 dark:text-slate-200'>GitHub</p>
                  <p className='text-xs text-slate-500'>j19015</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactModal;

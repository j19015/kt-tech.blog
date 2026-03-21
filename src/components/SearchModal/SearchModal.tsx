'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/searches?text=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]'>
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={() => { setIsOpen(false); setQuery(''); }} />
      <div className='relative w-full max-w-lg mx-4 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden'>
        <div className='flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-700'>
          <Search className='w-5 h-5 text-slate-400 flex-shrink-0' />
          <input
            ref={inputRef}
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='記事を検索... (Cmd+K)'
            className='flex-1 py-3.5 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none text-base'
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <button onClick={() => { setIsOpen(false); setQuery(''); }} className='p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'>
            <X className='w-4 h-4' />
          </button>
        </div>
        <div className='px-4 py-2.5 flex items-center gap-4 text-[11px] text-slate-400'>
          <span><kbd className='px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px]'>Enter</kbd> で検索</span>
          <span><kbd className='px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px]'>Esc</kbd> で閉じる</span>
        </div>
      </div>
    </div>
  );
};

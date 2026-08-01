'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useDialog } from '@/lib/useDialog';

type Props = { isOpen: boolean; onClose: () => void };

export const SearchModal = ({ isOpen, onClose }: Props) => {
  const [query, setQuery] = useState('');
  const [isMac, setIsMac] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const close = useCallback(() => {
    setQuery('');
    onClose();
  }, [onClose]);

  const dialogRef = useDialog<HTMLDivElement>(isOpen, close);

  // ショートカット表記をOSに合わせる。Windows/Linuxでも ⌘K と出ていた
  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform));
  }, []);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/searches?text=${encodeURIComponent(query.trim())}`);
      close();
    }
  };

  if (!isOpen) return null;

  const modKey = isMac ? '⌘' : 'Ctrl+';

  return (
    <div className='fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]'>
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={close} />
      <div
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-label='記事を検索'
        className='relative w-full max-w-lg mx-4 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden'
      >
        <div className='flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-700'>
          <Search className='w-5 h-5 text-slate-400 flex-shrink-0' aria-hidden='true' />
          <input
            ref={inputRef}
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='記事を検索...'
            aria-label='検索キーワード'
            className='flex-1 py-3.5 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none text-base'
            onKeyDown={(e) => {
              // IMEの変換確定のEnterで検索が走らないようにする。
              // これが無いと日本語を入力しても未確定の読みで検索されてしまう。
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSearch();
            }}
          />
          <button onClick={close} aria-label='閉じる' className='p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'>
            <X className='w-4 h-4' aria-hidden='true' />
          </button>
        </div>
        <div className='px-4 py-2.5 flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400'>
          <span>
            <kbd className='px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px]'>Enter</kbd> で検索
          </span>
          <span>
            <kbd className='px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px]'>Esc</kbd> で閉じる
          </span>
          <span className='ml-auto'>
            <kbd className='px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px]'>{modKey}K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
};

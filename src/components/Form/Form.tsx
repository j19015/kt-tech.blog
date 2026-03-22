'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export const Form = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/searches?text=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex items-center gap-2'>
        <input
          className='flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all'
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='記事を検索'
          aria-label='検索フォーム'
        />
        <button
          type='submit'
          className='px-4 py-2 text-sm bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors font-medium'
        >
          検索
        </button>
      </div>
    </form>
  );
};

export default Form;

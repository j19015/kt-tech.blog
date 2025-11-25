'use client';
import React from 'react';

export const Form = () => {
    return (
        <form action={`/searches`} method='get'>
            <div className='flex items-center gap-2'>
                <input
                    className='flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors'
                    type='text'
                    name='text'
                    placeholder='記事を検索'
                    aria-label='検索フォーム'
                />
                <button
                    type='submit'
                    className='px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
                >
                    検索
                </button>
            </div>
        </form>
    );
};

export default Form;
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark as BookmarkIcon, Trash2, ArrowRight } from 'lucide-react';
import { getBookmarks, removeBookmark, type Bookmark } from '@/lib/bookmarks';

/**
 * 保存した記事の一覧。
 *
 * 「あとで読む」で保存はできるのに見返す画面がなく、
 * 保存した記事に二度とたどり着けない状態だった。
 */
export const BookmarkList = () => {
  // null は「まだ localStorage を読んでいない」。
  // 初期値を [] にすると、読み込む前に一瞬「まだありません」が出る。
  const [bookmarks, setBookmarks] = useState<Bookmark[] | null>(null);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const remove = (id: string) => {
    removeBookmark(id);
    setBookmarks(getBookmarks());
  };

  if (bookmarks === null) {
    return (
      <div className='space-y-3 px-2' aria-hidden='true'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800' />
        ))}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className='py-16 text-center'>
        <BookmarkIcon className='mx-auto mb-4 h-12 w-12 text-slate-300 dark:text-slate-600' aria-hidden='true' />
        <h2 className='mb-2 text-lg font-normal text-slate-900 dark:text-slate-100'>保存した記事はありません</h2>
        <p className='mb-6 text-slate-500 dark:text-slate-400'>
          記事ページの「あとで読む」から保存すると、ここに並びます。
        </p>
        <Link
          href='/blogs/page/1'
          className='inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-normal text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
        >
          ブログ一覧を見る
          <ArrowRight className='h-4 w-4' aria-hidden='true' />
        </Link>
      </div>
    );
  }

  return (
    <ul className='space-y-3 px-2'>
      {bookmarks.map((bookmark) => (
        <li
          key={bookmark.id}
          className='flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800'
        >
          <Link href={`/blogs/${bookmark.id}`} className='min-w-0 flex-1 group'>
            <span className='block truncate font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400'>
              {bookmark.title}
            </span>
            <time dateTime={bookmark.savedAt} className='mt-1 block text-xs text-slate-400 dark:text-slate-500'>
              {bookmark.savedAt.slice(0, 10).replace(/-/g, '/')} に保存
            </time>
          </Link>
          <button
            onClick={() => remove(bookmark.id)}
            aria-label={`「${bookmark.title}」を保存から削除`}
            className='shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-700 dark:hover:text-red-400'
          >
            <Trash2 className='h-4 w-4' aria-hidden='true' />
          </button>
        </li>
      ))}
    </ul>
  );
};

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Library, Check } from 'lucide-react';
import { getReadArticles } from '@/lib/readArticles';

export type SeriesNavItem = { id: string; title: string };

type Props = {
  seriesName: string;
  seriesHref: string;
  posts: SeriesNavItem[];
  /** 現在表示中の記事の位置（0始まり） */
  currentIndex: number;
};

/**
 * 記事本文の前に置く連載の目次。
 *
 * 連載の途中から流入した読者に「これは何回目で、前に何があるのか」を
 * 最初に伝えるのが目的なので、本文より前に置いている。
 * 既読の印だけはクライアントでしか分からないため Client Component。
 */
export const SeriesNav = ({ seriesName, seriesHref, posts, currentIndex }: Props) => {
  const [read, setRead] = useState<string[]>([]);

  useEffect(() => {
    setRead(getReadArticles());
  }, []);

  return (
    <nav
      aria-label={`連載「${seriesName}」の記事一覧`}
      className='my-6 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'
    >
      <div className='flex items-center gap-2 border-b border-slate-200 px-4 py-2.5 dark:border-slate-700'>
        <Library className='h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400' aria-hidden='true' />
        <Link
          href={seriesHref}
          className='min-w-0 flex-1 truncate text-sm font-semibold text-slate-800 hover:underline dark:text-slate-100'
        >
          {seriesName}
        </Link>
        <span className='shrink-0 text-xs text-slate-500 dark:text-slate-400'>
          {currentIndex + 1} / {posts.length}
        </span>
      </div>

      <ol className='py-1'>
        {posts.map((post, i) => {
          const isCurrent = i === currentIndex;
          // 現在地は既読の印を出さない。今読んでいる記事にチェックが付くのは紛らわしい
          const isRead = !isCurrent && read.includes(post.id);
          return (
            <li key={post.id}>
              {isCurrent ? (
                <span
                  aria-current='page'
                  className='flex items-baseline gap-2 border-l-2 border-blue-500 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-slate-900 dark:bg-blue-950/40 dark:text-slate-100'
                >
                  <span className='shrink-0 tabular-nums text-slate-500 dark:text-slate-400'>{i + 1}.</span>
                  <span className='min-w-0'>{post.title}</span>
                </span>
              ) : (
                <Link
                  href={`/blogs/${post.id}`}
                  className='flex items-baseline gap-2 border-l-2 border-transparent px-4 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-slate-100'
                >
                  <span className='shrink-0 tabular-nums text-slate-400 dark:text-slate-500'>{i + 1}.</span>
                  <span className='min-w-0'>{post.title}</span>
                  {isRead && (
                    <Check
                      className='ml-auto h-3.5 w-3.5 shrink-0 self-center text-green-600 dark:text-green-500'
                      aria-label='読了済み'
                    />
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { getReadArticles } from '@/lib/readArticles';

export type SeriesPost = { id: string; title: string; publishedAt: string };

/**
 * 連載詳細ページの記事リスト。
 *
 * 既読の印は localStorage にしかないので Client Component にしている。
 * リンクとタイトルはサーバー側から props で受け取るため、
 * JS が動かなくても一覧としては成立する。
 */
export const SeriesPostList = ({ posts }: { posts: SeriesPost[] }) => {
  const [read, setRead] = useState<string[]>([]);

  useEffect(() => {
    setRead(getReadArticles());
  }, []);

  return (
    <ol className='space-y-3 px-2'>
      {posts.map((post, i) => {
        const isRead = read.includes(post.id);
        return (
          <li key={post.id}>
            <Link
              href={`/blogs/${post.id}`}
              className='flex items-baseline gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500'
            >
              <span className='shrink-0 tabular-nums text-sm font-bold text-slate-400 dark:text-slate-500'>
                {i + 1}
              </span>
              <span className='min-w-0 flex-1'>
                <span className='block font-semibold text-slate-900 dark:text-slate-100'>{post.title}</span>
                <time
                  dateTime={post.publishedAt}
                  className='mt-1 block text-xs text-slate-400 dark:text-slate-500'
                >
                  {post.publishedAt.slice(0, 10).replace(/-/g, '/')}
                </time>
              </span>
              {isRead && (
                <span className='flex shrink-0 items-center gap-1 self-center text-xs text-green-600 dark:text-green-500'>
                  <Check className='h-3.5 w-3.5' aria-hidden='true' />
                  読了
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ol>
  );
};

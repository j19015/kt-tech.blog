import { Pin, Info } from 'lucide-react';
import type { Blog } from '../../../libs/notion';

/**
 * 記事冒頭の「この記事でわかること」。
 *
 * 検索から来た読者は「自分の課題が解決するか」を数秒で判断する。
 * 目次は見出しの羅列であって、結論も対象読者も分からない。
 * 特に「前提知識」「動作環境」が冒頭にないと、読み進めてから
 * 「バージョンが違って動かない」と気づくことになる。
 *
 * Notion の Summary / Prerequisites プロパティが空の記事では何も出さない。
 */
export const ArticleSummary = ({ blog }: { blog: Blog }) => {
  if (!blog.summary?.length && !blog.prerequisites) return null;

  return (
    <section
      aria-label='この記事の要約'
      className='my-6 rounded-xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900 dark:bg-blue-950/30'
    >
      {blog.summary && blog.summary.length > 0 && (
        <>
          <h2 className='mb-3 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100'>
            <Pin className='h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400' aria-hidden='true' />
            この記事でわかること
          </h2>
          <ul className='space-y-1.5 text-sm text-slate-700 dark:text-slate-200'>
            {blog.summary.map((line) => (
              <li key={line} className='flex gap-2'>
                <span aria-hidden='true' className='select-none text-blue-500 dark:text-blue-400'>
                  •
                </span>
                <span className='min-w-0'>{line}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {blog.prerequisites && (
        <p
          className={`flex gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 ${
            blog.summary?.length ? 'mt-4 border-t border-blue-200 pt-3 dark:border-blue-900' : ''
          }`}
        >
          <Info className='mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500' aria-hidden='true' />
          <span className='min-w-0'>{blog.prerequisites}</span>
        </p>
      )}
    </section>
  );
};

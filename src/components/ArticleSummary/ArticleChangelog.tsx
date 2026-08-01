import { History } from 'lucide-react';
import type { ChangelogEntry } from '../../../libs/notion';

/**
 * 記事末尾の更新履歴。
 *
 * 日付だけでは「何が更新されたか」が分からない。誤字修正なのか、
 * Next.js 15 対応で内容が大きく変わったのかで、再読すべきかの判断が変わる。
 *
 * しかも `updatedAt` は Notion の last_edited_time なので、
 * タグを1つ足しただけでも更新日が動く。書き手が明示した履歴があれば、
 * 実質的な変更だけを読者に伝えられる。
 */
export const ArticleChangelog = ({ entries }: { entries: ChangelogEntry[] }) => {
  if (entries.length === 0) return null;

  return (
    <section className='mt-12 mx-4'>
      <h2 className='mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
        <History className='h-3.5 w-3.5' aria-hidden='true' />
        更新履歴
      </h2>
      <ol className='space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800/50'>
        {entries.map((entry) => (
          <li key={`${entry.date}-${entry.description}`} className='flex flex-wrap gap-x-3 gap-y-0.5'>
            <time
              dateTime={entry.date}
              className='shrink-0 tabular-nums text-slate-500 dark:text-slate-400'
            >
              {entry.date.replace(/-/g, '/')}
            </time>
            <span className='min-w-0 text-slate-700 dark:text-slate-200'>{entry.description}</span>
          </li>
        ))}
      </ol>
    </section>
  );
};

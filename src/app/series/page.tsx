import Link from 'next/link';
import { Metadata } from 'next';
import { Library } from 'lucide-react';
import { getList } from '../../../libs/notion';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';
import { groupBySeries } from '@/lib/series';
import { formatArchive } from '@/lib/blog';

const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';

export const metadata: Metadata = {
  title: '連載一覧',
  description: '複数回に分けて書いた連載記事の一覧です。第1回から順に読めます。',
  alternates: { canonical: `${siteUrl}/series` },
};

export const runtime = 'edge';

export default async function SeriesIndexPage() {
  const { contents } = await getList().catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 }));
  const seriesList = groupBySeries(contents);

  return (
    <div className='max-w-4xl mx-auto px-4 pb-16'>
      <BreadcrumbNav items={[{ label: 'Series', current: true }]} />

      <h1 className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 px-2'>連載</h1>
      <p className='mt-2 mb-8 px-2 text-sm text-slate-500 dark:text-slate-400'>
        {seriesList.length}件の連載・全{seriesList.reduce((n, s) => n + s.posts.length, 0)}記事
      </p>

      {seriesList.length === 0 ? (
        <p className='px-2 text-slate-500 dark:text-slate-400'>連載記事はまだありません。</p>
      ) : (
        <ul className='space-y-4 px-2'>
          {seriesList.map((series) => (
            <li key={series.slug}>
              <Link
                href={`/series/${encodeURIComponent(series.slug)}`}
                className='block rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500'
              >
                <div className='flex items-center gap-2'>
                  <Library className='h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400' aria-hidden='true' />
                  <h2 className='min-w-0 flex-1 font-bold text-slate-900 dark:text-slate-100'>{series.name}</h2>
                  <span className='shrink-0 text-xs text-slate-500 dark:text-slate-400'>全{series.posts.length}回</span>
                </div>
                {/* 第1回のタイトルまで見せると、何の話の連載かが一覧で分かる */}
                <p className='mt-2 truncate text-sm text-slate-600 dark:text-slate-300'>
                  1. {series.posts[0].title}
                </p>
                <p className='mt-1 text-xs text-slate-400 dark:text-slate-500'>
                  最終更新 {formatArchive(series.updatedAt.slice(0, 7))}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

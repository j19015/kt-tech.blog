import Link from 'next/link';
import { Metadata } from 'next';
import { FolderOpen } from 'lucide-react';
import { getList, getCategoryList } from '../../../libs/notionCache';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';
import { isPublic } from '@/lib/blog';

const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';

export const metadata: Metadata = {
  title: 'カテゴリ一覧',
  description: '技術記事のカテゴリ一覧です。興味のあるテーマから記事を探せます。',
  alternates: { canonical: `${siteUrl}/categories` },
};

export const runtime = 'edge';

export default async function CategoriesPage() {
  const [{ contents }, categoryData] = await Promise.all([
    getList().catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
    getCategoryList().catch(() => ({ contents: [] as { id: string; name: string }[] })),
  ]);

  const posts = contents.filter(isPublic);
  const categories = categoryData.contents
    .filter((c) => c.name !== 'PF')
    .map((c) => ({ ...c, count: posts.filter((p) => p.category?.id === c.id).length }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className='max-w-4xl mx-auto px-4 pb-16'>
      <BreadcrumbNav items={[{ label: 'Category', current: true }]} />

      <h1 className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 px-2'>
        カテゴリ
      </h1>
      <p className='mt-2 mb-8 px-2 text-sm text-slate-500 dark:text-slate-400'>
        {categories.length}件のカテゴリ・全{posts.length}記事
      </p>

      {categories.length === 0 ? (
        <p className='px-2 text-slate-500 dark:text-slate-400'>カテゴリがまだありません。</p>
      ) : (
        <ul className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/categories/${category.id}/page/1`}
                className='group flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all'
              >
                <FolderOpen className='w-4 h-4 flex-shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors' />
                <span className='flex-1 min-w-0 text-sm font-normal text-slate-700 dark:text-slate-200 truncate'>
                  {category.name}
                </span>
                <span className='text-xs text-slate-500 dark:text-slate-400'>{category.count}記事</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

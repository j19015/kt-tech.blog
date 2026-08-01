import Link from 'next/link';
import { Metadata } from 'next';
import { getList, getTagList } from '../../../libs/notion';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';
import { isPublic } from '@/lib/blog';

const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';

export const metadata: Metadata = {
  title: 'タグ一覧',
  description: '技術記事のタグ一覧です。使われている技術から記事を探せます。',
  alternates: { canonical: `${siteUrl}/tags` },
};

export const runtime = 'edge';

export default async function TagsPage() {
  const [{ contents }, tagData] = await Promise.all([
    getList().catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 })),
    getTagList().catch(() => ({ contents: [] as { id: string; name: string }[] })),
  ]);

  const posts = contents.filter(isPublic);
  const tags = tagData.contents
    .map((t) => ({ ...t, count: posts.filter((p) => p.tags?.some((pt) => pt.id === t.id)).length }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ja'));

  return (
    <div className='max-w-4xl mx-auto px-4 pb-16'>
      <BreadcrumbNav items={[{ label: 'Tag', current: true }]} />

      <h1 className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 px-2'>タグ</h1>
      <p className='mt-2 mb-8 px-2 text-sm text-slate-500 dark:text-slate-400'>
        {tags.length}件のタグ・全{posts.length}記事
      </p>

      {tags.length === 0 ? (
        <p className='px-2 text-slate-500 dark:text-slate-400'>タグがまだありません。</p>
      ) : (
        <ul className='flex flex-wrap gap-2 px-2'>
          {tags.map((tag) => (
            <li key={tag.id}>
              <Link
                href={`/tags/${encodeURIComponent(tag.id)}/page/1`}
                className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm'
              >
                #{tag.name}
                <span className='text-xs text-slate-500 dark:text-slate-400'>{tag.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

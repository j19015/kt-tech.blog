import Link from 'next/link';
import type { Blog } from '../../../libs/notion';
import { CategoryChip, TagChip } from '../Chip/Chip';

/**
 * 記事詳細の右カラム、目次の下に置く回遊導線。
 *
 * サイドバー（WithSidebar）はトップと記事詳細には出ないので、
 * 記事を読み終えた読者には「関連記事3件 + 前後記事」しか残らず、
 * タグやカテゴリで横に広げる手段がなかった。
 * 記事上部のタグはその頃には画面外に出ている。
 *
 * 目次はスクロール追従なので、その下に置けば本文の邪魔にならない。
 */
export const ArticleAside = ({ blog, latest }: { blog: Blog; latest: Blog[] }) => {
  const hasTaxonomy = Boolean(blog.category) || Boolean(blog.tags?.length);
  if (!hasTaxonomy && latest.length === 0) return null;

  return (
    <div className='mt-6 space-y-6 px-4 text-sm'>
      {hasTaxonomy && (
        <section>
          <h2 className='mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
            この記事のトピック
          </h2>
          <div className='flex flex-wrap gap-2'>
            {blog.category && (
              <CategoryChip
                name={blog.category.name}
                href={`/categories/${encodeURIComponent(blog.category.id)}/page/1`}
                size='sm'
              />
            )}
            {blog.tags?.map((tag) => (
              <TagChip key={tag.id} name={tag.name} href={`/tags/${encodeURIComponent(tag.id)}/page/1`} />
            ))}
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section>
          <h2 className='mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
            最新の記事
          </h2>
          <ul className='space-y-2.5'>
            {latest.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blogs/${post.id}`}
                  className='block text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400'
                >
                  <span className='line-clamp-2 leading-snug'>{post.title}</span>
                  <time
                    dateTime={post.createdAt}
                    className='mt-0.5 block text-xs text-slate-400 dark:text-slate-500'
                  >
                    {post.createdAt.slice(0, 10).replace(/-/g, '/')}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href='/blogs/page/1'
            className='mt-3 inline-block text-xs text-slate-500 underline hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          >
            記事一覧を見る
          </Link>
        </section>
      )}
    </div>
  );
};

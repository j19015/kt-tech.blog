'use client';
import Link from 'next/link';
import { Blog } from '../../../libs/microcms';

interface RelatedPostsProps {
  posts: Blog[];
  currentPostId: string;
}

export const RelatedPosts = ({ posts, currentPostId }: RelatedPostsProps) => {
  const relatedPosts = posts.filter(post => post.id !== currentPostId).slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <div className='mt-16 pt-8 border-t border-slate-200 dark:border-slate-800'>
      <h2 className='text-lg font-bold text-slate-900 dark:text-slate-100 mb-6'>
        関連記事
      </h2>

      <div className='space-y-4'>
        {relatedPosts.map((post) => (
          <article key={post.id}>
            <Link href={`/blogs/${post.id}`} className='block group'>
              <div className='space-y-2'>
                <h3 className='text-base font-medium text-slate-900 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors line-clamp-2'>
                  {post.title}
                </h3>
                <div className='flex items-center gap-3 text-sm text-slate-500 dark:text-slate-300'>
                  <time>
                    {new Date(post.createdAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </time>
                  {post.category && (
                    <>
                      <span>·</span>
                      <span>{post.category.name}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};
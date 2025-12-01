'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '../../../libs/microcms';
import { Clock, FolderOpen, ArrowRight } from 'lucide-react';

interface RelatedPostsProps {
  posts: Blog[];
  currentPostId: string;
}

export const RelatedPosts = ({ posts, currentPostId }: RelatedPostsProps) => {
  const relatedPosts = posts.filter(post => post.id !== currentPostId).slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <div className='mt-16 pt-8 border-t border-slate-200 dark:border-slate-700'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-lg font-bold text-slate-900 dark:text-slate-100'>
          関連記事
        </h2>
        <Link
          href='/blogs/page/1'
          className='text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 transition-colors'
        >
          すべて見る
          <ArrowRight className='w-3.5 h-3.5' />
        </Link>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {relatedPosts.map((post) => (
          <article key={post.id} className='group'>
            <Link href={`/blogs/${post.id}`} className='block'>
              {/* Thumbnail */}
              <div className='relative aspect-[16/9] mb-3 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800'>
                <Image
                  src={post.eyecatch?.url || '/images/no_image.jpeg'}
                  alt={post.title}
                  fill
                  className='object-cover group-hover:scale-105 transition-transform duration-300'
                />
                {post.category && (
                  <div className='absolute bottom-2 left-2'>
                    <span className='px-2 py-0.5 bg-white/90 dark:bg-slate-900/90 rounded text-xs text-slate-700 dark:text-slate-300'>
                      {post.category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <h3 className='text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2'>
                {post.title}
              </h3>

              <div className='flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400'>
                <Clock className='w-3 h-3' />
                <time>
                  {new Date(post.createdAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};
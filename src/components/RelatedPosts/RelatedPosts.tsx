'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '../../../libs/notion';
import { Clock, ArrowRight } from 'lucide-react';
import { CategoryChip } from '../Chip/Chip';
import { mediumUrl } from '@/lib/eyecatch';

interface RelatedPostsProps {
  posts: Blog[];
  currentPostId: string;
}

export const RelatedPosts = ({ posts, currentPostId }: RelatedPostsProps) => {
  const relatedPosts = posts.filter(post => post.id !== currentPostId).slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <div className='mt-16 pt-8 pb-8 px-4 border-t border-slate-200 dark:border-slate-700'>
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

      {/* 件数に応じて列数を決める。3カラム固定だと2件のとき右が空いて
          「読み込みに失敗した」ようにも見えていた。
          モバイルの gap-10(40px) はデスクトップの 20px より広く、
          縦積みしたときに1つのまとまりとして読めなかったので揃える。 */}
      <div
        className={`grid grid-cols-1 gap-5 ${
          relatedPosts.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
        }`}
      >
        {relatedPosts.map((post) => (
          <article key={post.id} className='group'>
            <Link href={`/blogs/${post.id}`} className='block'>
              {/* Thumbnail */}
              <div className='relative aspect-[16/9] mb-3 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800'>
                <Image
                  src={mediumUrl(post.eyecatch?.url) || '/images/no_image_generated.png'}
                  alt=''
                  fill
                  sizes='(max-width: 640px) 100vw, 250px'
                  className='object-cover group-hover:scale-105 transition-transform duration-300'
                />
              </div>

              {/* Content */}
              {/* カテゴリは画像に重ねず下に出す。明るいアイキャッチの上では
                  半透明の背景越しの文字が読めなかった */}
              {post.category && (
                <div className='mb-2'>
                  <CategoryChip name={post.category.name} size='sm' />
                </div>
              )}
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
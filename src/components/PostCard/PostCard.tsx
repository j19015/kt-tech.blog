'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Library } from 'lucide-react';
import type { Blog } from '../../../libs/notion';
import { TagChip } from '../Chip/Chip';
import { getArticleBadge } from '@/lib/articleStatus';

/**
 * 記事一覧のカード。
 *
 * 一覧（Index）と検索結果でほぼ同じマークアップが丸ごと複製されており、
 * 「連載バッジを足す」「抜粋を出す」といった変更のたびに
 * 二重に直す必要があった（そして片方が取り残されていた）。
 */

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return '今日';
  if (days === 1) return '昨日';
  if (days < 7) return `${days}日前`;
  if (days < 30) return `${Math.floor(days / 7)}週間前`;
  if (days < 365) return `${Math.floor(days / 30)}ヶ月前`;
  return `${Math.floor(days / 365)}年前`;
};

/** キーワードに一致した箇所を目立たせる */
export const HighlightText = ({ text, terms }: { text: string; terms?: string[] }) => {
  if (!terms || terms.length === 0) return <>{text}</>;
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).filter(Boolean);
  if (escaped.length === 0) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'));
  const lowered = terms.map((t) => t.toLowerCase());
  return (
    <>
      {parts.map((part, i) =>
        lowered.includes(part.toLowerCase()) ? (
          <mark key={i} className='bg-yellow-200 dark:bg-yellow-800/50 text-inherit rounded px-0.5'>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

type Props = {
  blog: Blog;
  /** 検索結果でハイライトする語 */
  terms?: string[];
  /** カードの下に添える補足（検索結果の一致箇所など） */
  footer?: React.ReactNode;
};

export const PostCard = ({ blog, terms, footer }: Props) => {
  const badge = getArticleBadge(blog);

  return (
    <article className='group'>
      <Link href={`/blogs/${blog.id}`} className='block'>
        {/* 固定高をやめ、内容に応じて伸びるようにした。
            短いタイトルでは余白が間延びし、長いタイトルは切れていた。 */}
        <div className='flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-600 hover:-translate-y-0.5 transition-all duration-300'>
          <div className='flex-shrink-0 relative w-24 sm:w-32 aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700'>
            <Image
              src={blog.eyecatch?.url || '/images/no_image_generated.png'}
              alt=''
              fill
              // 実表示は96〜128px。sizes がないと 100vw 扱いになり原寸が配信される
              sizes='(max-width: 640px) 96px, 128px'
              className='object-cover group-hover:scale-105 transition-transform duration-300'
            />
            {badge === 'new' ? (
              <span className='absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded'>
                NEW
              </span>
            ) : badge === 'updated' ? (
              <span className='absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-blue-500 text-white rounded'>
                更新
              </span>
            ) : null}
          </div>

          <div className='flex-1 min-w-0 space-y-1.5'>
            {/* 連載バッジ。一覧の時点で「これは連載の一部」と分かると、
                途中の回を単発記事だと思って読み始めるのを防げる */}
            {blog.series && (
              <span className='flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400'>
                <Library className='h-3 w-3 shrink-0' aria-hidden='true' />
                <span className='truncate'>{blog.series.name}</span>
                {blog.series.order > 0 && (
                  <span className='shrink-0 tabular-nums text-slate-400 dark:text-slate-500'>
                    #{blog.series.order}
                  </span>
                )}
              </span>
            )}

            <h2 className='text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug'>
              <HighlightText text={blog.title} terms={terms} />
            </h2>

            {/* 抜粋。タイトルだけでは中身が判断できず、一覧で開くかどうかを決められなかった */}
            {blog.ogpDescription && (
              <p className='text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed'>
                <HighlightText text={blog.ogpDescription} terms={terms} />
              </p>
            )}

            <div className='flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400'>
              {/* 相対表記だと「いつの記事か」が直感的に分かる。技術記事は鮮度が重要 */}
              <time
                className='whitespace-nowrap'
                dateTime={blog.createdAt}
                title={new Date(blog.createdAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              >
                {timeAgo(blog.createdAt)}
              </time>
              {blog.category && (
                <>
                  <span className='text-slate-300 dark:text-slate-600'>|</span>
                  <span className='whitespace-nowrap truncate'>{blog.category.name}</span>
                </>
              )}
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className='flex flex-wrap gap-1.5'>
                {/* カード全体がリンクなので、タグは入れ子リンクにせず表示だけにする */}
                {blog.tags.slice(0, 3).map((tag) => (
                  <TagChip key={tag.id} name={tag.name} />
                ))}
                {blog.tags.length > 3 && (
                  <span className='self-center text-[11px] text-slate-500 dark:text-slate-400'>
                    +{blog.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {footer}
          </div>
        </div>
      </Link>
    </article>
  );
};

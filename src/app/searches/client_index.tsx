'use client';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Blog } from '../../../libs/notion';
import { BlogProps } from '../../../libs/notion';
import Image from 'next/image';
import { Search, ArrowRight } from 'lucide-react';

const HighlightText = ({ text: content, query }: { text: string; query: string | null }) => {
  if (!query) return <>{content}</>;
  const parts = content.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return <>{parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className='bg-yellow-200 dark:bg-yellow-800/50 text-inherit rounded px-0.5'>{part}</mark>
      : part
  )}</>;
};

export const ClientIndex = ({ contents }: BlogProps) => {
  const searchParams = useSearchParams();
  const text = searchParams.get('text');
  const [blogContents, setBlogContents] = useState<Blog[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (text) {
          const filteredContents = contents.filter((content) =>
            content.body.toLowerCase().includes(text.toLowerCase()) ||
            content.title.toLowerCase().includes(text.toLowerCase()) ||
            content.tags?.some(tag => tag.name.toLowerCase().includes(text.toLowerCase())) ||
            content.category?.name.toLowerCase().includes(text.toLowerCase())
          ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setBlogContents(filteredContents);
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'search', {
              search_term: text,
              event_category: 'Search',
              event_label: filteredContents.length === 0 ? 'zero_results' : 'has_results',
              value: filteredContents.length,
            });
          }
        } else {
          setBlogContents(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [text, contents]);

  return (
    <div className='min-h-screen px-4'>
      {/* Search Header */}
      <div className='max-w-3xl mx-auto mb-8 pt-4'>
        <h1 className='text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2'>
          検索結果
        </h1>

        {text ? (
          <p className='text-slate-600 dark:text-slate-400'>
            「<span className='font-medium text-slate-900 dark:text-slate-100'>{text}</span>」の検索結果
            {blogContents && (
              <span className='ml-2 text-sm'>
                ({blogContents.length}件)
              </span>
            )}
          </p>
        ) : (
          <p className='text-slate-500 dark:text-slate-400'>
            検索キーワードを入力してください
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className='flex justify-center items-center py-12'>
          <div className='w-6 h-6 border-2 border-slate-300 border-t-slate-600 dark:border-slate-600 dark:border-t-slate-300 rounded-full animate-spin' />
        </div>
      )}

      {/* Search Results - same layout as Index component */}
      <div aria-live='polite' aria-atomic='true' className='sr-only'>
        {!isLoading && blogContents && `${blogContents.length}件の検索結果`}
      </div>
      {!isLoading && blogContents && blogContents.length > 0 ? (
        <div className='max-w-3xl mx-auto px-4'>
          <div className='space-y-4'>
            {blogContents.map((blog) => (
              <article key={blog.id} className='group'>
                <Link href={`/blogs/${blog.id}`} className='block'>
                  <div className='flex gap-4 p-4 h-[140px] sm:h-[150px] rounded-xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-600 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden'>
                    {/* サムネイル画像 */}
                    <div className='flex-shrink-0 relative w-24 sm:w-32 h-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700'>
                      <Image
                        src={blog.eyecatch?.url || '/images/no_image_generated.png'}
                        alt={blog.title}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                      {Date.now() - new Date(blog.createdAt).getTime() < 72 * 60 * 60 * 1000 && (
                        <span className='absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded'>
                          NEW
                        </span>
                      )}
                    </div>

                    {/* コンテンツ */}
                    <div className='flex-1 min-w-0 flex flex-col justify-between py-0.5'>
                      <h2 className='text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug'>
                        <HighlightText text={blog.title} query={text} />
                      </h2>

                      <div className='space-y-1.5'>
                        <div className='flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-400'>
                          <time className='whitespace-nowrap' title={new Date(blog.createdAt).toLocaleDateString('ja-JP')}>
                            {new Date(blog.createdAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                          </time>
                          {blog.category && (
                            <>
                              <span className='text-slate-300 dark:text-slate-600'>|</span>
                              <span className='whitespace-nowrap truncate'>{blog.category.name}</span>
                            </>
                          )}
                        </div>

                        {blog.tags && blog.tags.length > 0 && (
                          <div className='flex gap-1.5 overflow-hidden h-4'>
                            {blog.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag.id}
                                className='text-[11px] text-slate-400 dark:text-slate-400 whitespace-nowrap'
                              >
                                #{tag.name}
                              </span>
                            ))}
                            {blog.tags.length > 3 && (
                              <span className='text-[11px] text-slate-400 dark:text-slate-400'>...</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      ) : !isLoading && blogContents && blogContents.length === 0 ? (
        <div className='max-w-3xl mx-auto text-center py-16'>
          <Search className='w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-slate-900 dark:text-slate-100 mb-2'>
            検索結果が見つかりませんでした
          </h3>
          <p className='text-slate-500 dark:text-slate-400 mb-6'>
            「{text}」に一致する記事がありません。別のキーワードで検索してください。
          </p>
          <Link
            href='/blogs/page/1'
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors'
          >
            ブログ一覧を見る
            <ArrowRight className='w-4 h-4' />
          </Link>
        </div>
      ) : !text ? (
        <div className='max-w-3xl mx-auto text-center py-16'>
          <Search className='w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-slate-900 dark:text-slate-100 mb-2'>
            キーワードを入力してください
          </h3>
          <p className='text-slate-500 dark:text-slate-400'>
            上部の検索フォームからキーワードを入力して、記事を検索できます。
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default ClientIndex;

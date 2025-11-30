'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Blog } from '../../../libs/microcms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { BlogProps } from '../../../libs/microcms';
import Image from 'next/image';
import { Clock, Search, ArrowRight } from 'lucide-react';

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
          const filteredContents = await filterData(contents);
          setBlogContents(filteredContents);
        } else {
          setBlogContents(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const filterData = async (contents: Blog[]) => {
      if (text) {
        const filteredContents = contents.filter((content) =>
          content.body.toLowerCase().includes(text.toLowerCase()) ||
          content.title.toLowerCase().includes(text.toLowerCase()) ||
          content.tags?.some(tag => tag.name.toLowerCase().includes(text.toLowerCase())) ||
          content.category?.name.toLowerCase().includes(text.toLowerCase())
        );
        return filteredContents;
      } else {
        return null;
      }
    };

    fetchData();
  }, [text, contents]);

  return (
    <div className='min-h-screen px-4'>
      {/* Search Header */}
      <div className='max-w-4xl mx-auto mb-8 pt-4'>
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

      {/* Search Results */}
      {!isLoading && blogContents && blogContents.length > 0 ? (
        <div className='max-w-4xl mx-auto'>
          <div className='space-y-4'>
            {blogContents.map((blog) => (
              <article
                key={blog.id}
                className='group bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors overflow-hidden'
              >
                <Link href={`/blogs/${blog.id}`}>
                  <div className='flex flex-col sm:flex-row'>
                    {/* Thumbnail */}
                    <div className='relative w-full sm:w-48 h-40 sm:h-32 flex-shrink-0 bg-slate-100 dark:bg-slate-800'>
                      <Image
                        src={blog.eyecatch?.url || '/images/no_image.jpeg'}
                        alt={blog.title}
                        fill
                        className='object-cover'
                      />
                      {/* Category Badge */}
                      {blog.category && (
                        <div className='absolute bottom-2 left-2'>
                          <span className='px-2 py-1 bg-white/90 dark:bg-slate-900/90 rounded text-xs text-slate-700 dark:text-slate-300'>
                            <FontAwesomeIcon icon={faFolderOpen} className='mr-1 w-3 h-3' />
                            {blog.category.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className='flex-1 p-4'>
                      <h2 className='text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2'>
                        {blog.title}
                      </h2>

                      {/* Tags */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className='flex flex-wrap gap-1.5 mb-3'>
                          {blog.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className='px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-600 dark:text-slate-400'
                            >
                              #{tag.name}
                            </span>
                          ))}
                          {blog.tags.length > 3 && (
                            <span className='text-xs text-slate-500 dark:text-slate-500'>
                              +{blog.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Meta Info */}
                      <div className='flex items-center justify-between text-sm text-slate-500 dark:text-slate-400'>
                        <div className='flex items-center gap-1'>
                          <Clock className='w-3.5 h-3.5' />
                          <time>
                            {new Date(blog.createdAt).toLocaleDateString('ja-JP', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </time>
                        </div>
                        <span className='flex items-center gap-1 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity'>
                          続きを読む
                          <ArrowRight className='w-3.5 h-3.5' />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      ) : !isLoading && blogContents && blogContents.length === 0 ? (
        <div className='max-w-4xl mx-auto text-center py-16'>
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
        <div className='max-w-4xl mx-auto text-center py-16'>
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
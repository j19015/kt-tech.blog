'use client';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BlogProps } from '../../../libs/notion';
import { Search, ArrowRight } from 'lucide-react';
import { PostCard } from '@/components/PostCard/PostCard';
import { parseQuery, searchBlogs, MATCH_LABELS } from '@/lib/search';

export const ClientIndex = ({ contents }: BlogProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  // トップの構造化データが `keyword` を送っていた時期があるので両方受ける
  const text = searchParams.get('text') ?? searchParams.get('keyword') ?? '';
  const [draft, setDraft] = useState(text);

  // 戻る/進むやサジェストからの遷移でURLだけ変わったとき、入力欄も追随させる
  useEffect(() => {
    setDraft(text);
  }, [text]);

  const terms = useMemo(() => parseQuery(text), [text]);
  // 全件を舐めるだけなので同期で済む。以前は useEffect + ローディング状態で
  // 非同期処理のように扱っていたが、待つものが何もなかった。
  const hits = useMemo(() => (text ? searchBlogs(contents, text) : null), [contents, text]);

  useEffect(() => {
    if (!hits || !text) return;
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: text,
        event_category: 'Search',
        event_label: hits.length === 0 ? 'zero_results' : 'has_results',
        value: hits.length,
      });
    }
  }, [hits, text]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    router.push(trimmed ? `/searches?text=${encodeURIComponent(trimmed)}` : '/searches');
  };

  return (
    <div className='min-h-screen px-4'>
      <div className='max-w-3xl mx-auto mb-8 pt-4'>
        <h1 className='text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4'>検索</h1>

        {/* 検索ページ自体に入力欄が無く、「上部の検索フォームから」という
            案内だけがあった。ヘッダーにあるのは検索アイコンで、フォームではない。 */}
        <form onSubmit={submit} role='search' className='flex items-center gap-2'>
          <input
            type='search'
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder='キーワードで記事を検索'
            aria-label='検索キーワード'
            className='flex-1 px-4 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400'
          />
          <button
            type='submit'
            className='px-4 py-2.5 text-sm font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors'
          >
            検索
          </button>
        </form>
        <p className='mt-2 text-xs text-slate-500 dark:text-slate-400'>
          スペース区切りで複数のキーワードを指定すると、すべてを含む記事を探します。
          タイトル・概要・タグ・カテゴリ・連載名が対象です。
        </p>

        {text && (
          <p className='mt-4 text-slate-600 dark:text-slate-400'>
            「<span className='font-medium text-slate-900 dark:text-slate-100'>{text}</span>」の検索結果
            {hits && <span className='ml-2 text-sm'>({hits.length}件)</span>}
          </p>
        )}
      </div>

      <div aria-live='polite' aria-atomic='true' className='sr-only'>
        {hits && `${hits.length}件の検索結果`}
      </div>

      {hits && hits.length > 0 ? (
        <div className='max-w-3xl mx-auto'>
          <div className='space-y-4'>
            {hits.map(({ blog, matched }) => (
              <PostCard
                key={blog.id}
                blog={blog}
                terms={terms}
                footer={
                  // なぜこの記事が出てきたのかを示す。
                  // 一致箇所が本文でないことも多く、示さないと結果が唐突に見える
                  <p className='pt-1 text-[11px] text-slate-400 dark:text-slate-500'>
                    {matched.map((m) => MATCH_LABELS[m]).join('・')}に一致
                  </p>
                }
              />
            ))}
          </div>
        </div>
      ) : hits ? (
        <div className='max-w-3xl mx-auto text-center py-16'>
          <Search className='w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4' aria-hidden='true' />
          <h2 className='text-lg font-medium text-slate-900 dark:text-slate-100 mb-2'>
            検索結果が見つかりませんでした
          </h2>
          <p className='text-slate-500 dark:text-slate-400 mb-6'>
            「{text}」に一致する記事がありません。
            {terms.length > 1 && 'キーワードを減らすと見つかるかもしれません。'}
          </p>
          <Link
            href='/blogs/page/1'
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors'
          >
            ブログ一覧を見る
            <ArrowRight className='w-4 h-4' aria-hidden='true' />
          </Link>
        </div>
      ) : (
        <div className='max-w-3xl mx-auto text-center py-16'>
          <Search className='w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4' aria-hidden='true' />
          <h2 className='text-lg font-medium text-slate-900 dark:text-slate-100 mb-2'>
            キーワードを入力してください
          </h2>
          <p className='text-slate-500 dark:text-slate-400'>
            上の検索フォームにキーワードを入力すると、記事を探せます。
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientIndex;

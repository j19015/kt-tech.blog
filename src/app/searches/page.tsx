import { Suspense } from 'react';
import ClientIndex from './client_index';
import { getList } from '../../../libs/notionCache';
import { Metadata } from 'next';
import { WithSidebar } from '@/components/WithSidebar/WithSidebar';
import { isPublic } from '@/lib/blog';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// これが無いとビルド時に一度だけ getList() が走り、その結果が静的に焼き込まれる。
// 新しく公開した記事は次のデプロイまで検索に出てこなかった。
export const runtime = 'edge';

export default async function StaticPage() {
  const { contents } = await getList().catch(() => ({ contents: [], totalCount: 0, offset: 0, limit: 0 }));

  return (
    <WithSidebar>
      <Suspense
        fallback={
          <div className='animate-pulse space-y-4 max-w-3xl mx-auto px-4'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-[140px] bg-slate-200 dark:bg-slate-700 rounded-xl' />
            ))}
          </div>
        }
      >
        {/* 一覧に出していないPF記事が検索でだけ出てくると導線が破綻する */}
        <ClientIndex contents={contents.filter(isPublic)} />
      </Suspense>
    </WithSidebar>
  );
}

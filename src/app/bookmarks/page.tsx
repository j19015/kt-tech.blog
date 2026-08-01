import { Metadata } from 'next';
import { BookmarkList } from '@/components/Bookmark/BookmarkList';
import { BreadcrumbNav } from '@/components/Breadcrumb/BreadcrumbNav';

export const metadata: Metadata = {
  title: 'あとで読む',
  description: '「あとで読む」で保存した記事の一覧です。',
  // 保存内容は端末ごとに違うので、検索エンジンに拾わせても意味がない
  robots: { index: false, follow: false },
};

export default function BookmarksPage() {
  return (
    <div className='max-w-3xl mx-auto px-4 pb-16'>
      <BreadcrumbNav items={[{ label: 'Bookmarks', current: true }]} />
      <h1 className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 px-2'>あとで読む</h1>
      <p className='mt-2 mb-8 px-2 text-sm text-slate-500 dark:text-slate-400'>
        この端末のブラウザに保存されています。他の端末とは共有されません。
      </p>
      <BookmarkList />
    </div>
  );
}

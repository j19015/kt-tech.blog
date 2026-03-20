import Link from 'next/link';
import { Blog } from '../../../libs/notion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PostNavigationProps {
  currentId: string;
  allPosts: Blog[];
}

export const PostNavigation = ({ currentId, allPosts }: PostNavigationProps) => {
  const currentIndex = allPosts.findIndex((p) => p.id === currentId);
  if (currentIndex === -1) return null;

  const prev = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const next = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  if (!prev && !next) return null;

  return (
    <nav className='mt-12 pt-8 border-t border-slate-200 dark:border-slate-700'>
      <div className='grid grid-cols-2 gap-4'>
        {prev ? (
          <Link
            href={`/blogs/${prev.id}`}
            className='group p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors'
          >
            <span className='flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 mb-1'>
              <ChevronLeft className='w-3 h-3' />
              前の記事
            </span>
            <p className='text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 line-clamp-2 transition-colors'>
              {prev.title}
            </p>
          </Link>
        ) : <div />}
        {next ? (
          <Link
            href={`/blogs/${next.id}`}
            className='group p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors text-right'
          >
            <span className='flex items-center justify-end gap-1 text-xs text-slate-400 dark:text-slate-500 mb-1'>
              次の記事
              <ChevronRight className='w-3 h-3' />
            </span>
            <p className='text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 line-clamp-2 transition-colors'>
              {next.title}
            </p>
          </Link>
        ) : <div />}
      </div>
    </nav>
  );
};

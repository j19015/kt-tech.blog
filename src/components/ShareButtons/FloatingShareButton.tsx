'use client';
import { Share2 } from 'lucide-react';

export const FloatingShareButton = ({ title, url }: { title: string; url: string }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('URLをコピーしました');
      });
    }
  };

  return (
    <button
      onClick={handleShare}
      className='fixed bottom-[8.5rem] right-6 z-30 w-11 h-11 flex items-center justify-center rounded-full bg-slate-700/80 dark:bg-slate-200/80 text-white dark:text-slate-900 backdrop-blur-sm shadow-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors lg:hidden'
      aria-label='この記事を共有'
    >
      <Share2 className='w-5 h-5' />
    </button>
  );
};

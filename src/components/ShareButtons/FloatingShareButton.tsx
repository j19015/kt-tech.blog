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
      className='fixed bottom-20 right-4 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors lg:hidden'
      aria-label='この記事を共有'
    >
      <Share2 className='w-5 h-5' />
    </button>
  );
};

'use client';
import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export const FloatingShareButton = ({ title, url }: { title: string; url: string }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
      return;
    }
    // alert() はページ全体をブロックするモーダルなので使わない。
    // 他のコピー操作と同じくアイコンの変化でフィードバックする。
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  return (
    <button
      onClick={handleShare}
      // ScrollToTop(bottom-6) と 目次FAB(bottom-[4.5rem]) の上に等間隔で並べる
      className='fixed bottom-[8rem] right-6 z-30 w-11 h-11 flex items-center justify-center rounded-full bg-slate-700/80 dark:bg-slate-200/80 text-white dark:text-slate-900 backdrop-blur-sm shadow-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors lg:hidden'
      aria-label={copied ? 'URLをコピーしました' : 'この記事を共有'}
    >
      {copied ? <Check className='w-5 h-5' aria-hidden='true' /> : <Share2 className='w-5 h-5' aria-hidden='true' />}
    </button>
  );
};

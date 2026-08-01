'use client';
import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { FAB_BASE, FAB_SLOT, FAB_Z } from '@/lib/fab';

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
      className={`${FAB_BASE} ${FAB_SLOT.third} ${FAB_Z.share} bg-slate-700/80 text-white backdrop-blur-sm hover:bg-slate-800 dark:bg-slate-200/80 dark:text-slate-900 dark:hover:bg-slate-100 lg:hidden`}
      aria-label={copied ? 'URLをコピーしました' : 'この記事を共有'}
    >
      {copied ? <Check className='w-5 h-5' aria-hidden='true' /> : <Share2 className='w-5 h-5' aria-hidden='true' />}
    </button>
  );
};

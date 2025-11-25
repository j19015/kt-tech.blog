'use client';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    line: `https://line.me/R/msg/text/?${encodedTitle}%20${encodedUrl}`,
    hatena: `https://b.hatena.ne.jp/entry/${shareUrl}`,
  };

  return (
    <div className='my-8 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900'>
      <h3 className='text-sm font-bold text-slate-900 dark:text-slate-100 mb-3'>
        この記事をシェア
      </h3>
      <div className='flex flex-wrap gap-2'>
        <a
          href={shareLinks.twitter}
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
          aria-label='Share on X (Twitter)'
        >
          X
        </a>
        <span className='text-slate-300 dark:text-slate-700'>·</span>
        <a
          href={shareLinks.facebook}
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
          aria-label='Share on Facebook'
        >
          Facebook
        </a>
        <span className='text-slate-300 dark:text-slate-700'>·</span>
        <a
          href={shareLinks.line}
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
          aria-label='Share on LINE'
        >
          LINE
        </a>
        <span className='text-slate-300 dark:text-slate-700'>·</span>
        <a
          href={shareLinks.hatena}
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
          aria-label='Share on Hatena Bookmark'
        >
          はてブ
        </a>
        <span className='text-slate-300 dark:text-slate-700'>·</span>
        <button
          onClick={handleCopyLink}
          className='text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
          aria-label='Copy link'
        >
          {copied ? 'コピーしました' : 'リンクをコピー'}
        </button>
      </div>
    </div>
  );
};
'use client';
import { useState } from 'react';
import { Twitter, Facebook, Link2, Check, BookmarkPlus } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

// LINE icon component
const LineIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314' />
  </svg>
);

// Hatena Bookmark icon component
const HatenaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M20.47 0C22.42 0 24 1.58 24 3.53v16.94c0 1.95-1.58 3.53-3.53 3.53H3.53C1.58 24 0 22.42 0 20.47V3.53C0 1.58 1.58 0 3.53 0h16.94zm-3.705 14.47c-.78 0-1.41.63-1.41 1.41s.63 1.414 1.41 1.414 1.41-.634 1.41-1.414-.63-1.41-1.41-1.41zm.255-9.84h-2.37v7.82h2.37V4.63zm-6.375 0H8.28v4.89H6.165v1.9H8.28v2.91H6.165v1.91h4.47V4.63z' />
  </svg>
);

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
    <div className='my-8 px-4'>
      <div className='flex items-center gap-3'>
        <span className='text-sm text-slate-500 dark:text-slate-400'>Share</span>
        <div className='flex items-center gap-2'>
          <a
            href={shareLinks.twitter}
            target='_blank'
            rel='noopener noreferrer'
            className='w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-black hover:text-white transition-colors'
            aria-label='Share on X (Twitter)'
          >
            <Twitter className='w-4 h-4' />
          </a>
          <a
            href={shareLinks.facebook}
            target='_blank'
            rel='noopener noreferrer'
            className='w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[#1877F2] hover:text-white transition-colors'
            aria-label='Share on Facebook'
          >
            <Facebook className='w-4 h-4' />
          </a>
          <a
            href={shareLinks.line}
            target='_blank'
            rel='noopener noreferrer'
            className='w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[#00B900] hover:text-white transition-colors'
            aria-label='Share on LINE'
          >
            <LineIcon className='w-4 h-4' />
          </a>
          <a
            href={shareLinks.hatena}
            target='_blank'
            rel='noopener noreferrer'
            className='w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[#00A4DE] hover:text-white transition-colors'
            aria-label='Share on Hatena Bookmark'
          >
            <HatenaIcon className='w-4 h-4' />
          </a>
          <button
            onClick={handleCopyLink}
            className='w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-600 hover:text-white transition-colors'
            aria-label='Copy link'
          >
            {copied ? <Check className='w-4 h-4 text-green-500' /> : <Link2 className='w-4 h-4' />}
          </button>
        </div>
      </div>
    </div>
  );
};
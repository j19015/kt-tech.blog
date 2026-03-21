'use client';
import { useState } from 'react';
import { Facebook, Link2, Check, Linkedin, Share2 } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
);

const LineIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314' />
  </svg>
);

const BlueskyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.785 2.627 3.6 3.476 6.243 3.226 .062-.006.124-.012.183-.018-.062.012-.124.024-.183.042-3.89.837-7.332 2.857-3.792 8.964C6.395 21.306 9.573 24.893 12 18.258c2.427 6.635 5.579 3.084 8.925-1.797 3.54-6.107.098-8.127-3.792-8.964-.059-.018-.121-.03-.183-.042.059.006.121.012.183.018 2.643.25 5.458-.599 6.243-3.226C23.622 9.418 24 4.458 24 3.768c0-.69-.139-1.86-.902-2.203-.659-.299-1.664-.621-4.3 1.24C16.046 4.747 13.087 8.686 12 10.8z' />
  </svg>
);

const btnBase = 'w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 transition-colors';

export const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const [canShare] = useState(() => typeof navigator !== 'undefined' && !!navigator.share);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleNativeShare = () => {
    navigator.share({ title, url: shareUrl }).catch(() => {});
  };

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    line: `https://line.me/R/msg/text/?${encodedTitle}%20${encodedUrl}`,
    hatena: `https://b.hatena.ne.jp/entry/${shareUrl}`,
    pocket: `https://getpocket.com/save?url=${encodedUrl}&title=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    bluesky: `https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`,
  };

  return (
    <div className='my-8 px-6'>
      <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
        <span className='text-sm text-slate-500 dark:text-slate-400'>Share</span>
        <div className='flex items-center gap-2 flex-wrap'>
          {canShare && (
            <button
              onClick={handleNativeShare}
              className={`${btnBase} text-slate-600 dark:text-slate-300 hover:bg-slate-600 hover:text-white`}
              aria-label='Share'
            >
              <Share2 className='w-4 h-4' />
            </button>
          )}
          <a href={shareLinks.x} target='_blank' rel='noopener noreferrer' className={`${btnBase} text-slate-900 dark:text-slate-100 hover:bg-black hover:text-white`} aria-label='Share on X'>
            <XIcon className='w-4 h-4' />
          </a>
          <a href={shareLinks.facebook} target='_blank' rel='noopener noreferrer' className={`${btnBase} text-[#1877F2] hover:bg-[#1877F2] hover:text-white`} aria-label='Share on Facebook'>
            <Facebook className='w-4 h-4' />
          </a>
          <a href={shareLinks.linkedin} target='_blank' rel='noopener noreferrer' className={`${btnBase} text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white`} aria-label='Share on LinkedIn'>
            <Linkedin className='w-4 h-4' />
          </a>
          <a href={shareLinks.bluesky} target='_blank' rel='noopener noreferrer' className={`${btnBase} text-[#0085FF] hover:bg-[#0085FF] hover:text-white`} aria-label='Share on Bluesky'>
            <BlueskyIcon className='w-4 h-4' />
          </a>
          <a href={shareLinks.line} target='_blank' rel='noopener noreferrer' className={`${btnBase} text-[#00B900] hover:bg-[#00B900] hover:text-white`} aria-label='Share on LINE'>
            <LineIcon className='w-4 h-4' />
          </a>
          <a href={shareLinks.hatena} target='_blank' rel='noopener noreferrer' className={`${btnBase} text-[#00A4DE] hover:bg-[#00A4DE] hover:text-white text-xs font-bold`} aria-label='Bookmark on Hatena'>
            B!
          </a>
          <a href={shareLinks.pocket} target='_blank' rel='noopener noreferrer' className={`${btnBase} text-[#EF3F56] hover:bg-[#EF3F56] hover:text-white`} aria-label='Save to Pocket'>
            <svg className='w-4 h-4' viewBox='0 0 24 24' fill='currentColor'><path d='M18.813 2.07C21.451 2.276 23 4.031 23 6.653v5.07c0 6.281-5.165 11.372-11.488 11.372S.024 18.004.024 11.723V6.653C.024 4.031 1.572 2.276 4.21 2.07H18.813zM12 16.063l5.406-5.344a1.627 1.627 0 00.012-2.312 1.66 1.66 0 00-2.34.012L12 11.469l-3.078-3.05a1.66 1.66 0 00-2.34-.012 1.627 1.627 0 00.012 2.312L12 16.063z'/></svg>
          </a>
          <button onClick={handleCopyLink} className={`${btnBase} text-slate-500 dark:text-slate-400 hover:bg-slate-600 hover:text-white`} aria-label='Copy link'>
            {copied ? <Check className='w-4 h-4 text-green-500' /> : <Link2 className='w-4 h-4' />}
          </button>
        </div>
      </div>
    </div>
  );
};

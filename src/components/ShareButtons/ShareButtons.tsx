'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faLine } from '@fortawesome/free-brands-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
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
    <div className='my-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700'>
      <div className='flex items-center justify-between flex-wrap gap-4'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
          <span className='text-2xl'>📢</span>
          この記事をシェア
        </h3>
        <div className='flex gap-3'>
          {/* Twitter/X */}
          <a
            href={shareLinks.twitter}
            target='_blank'
            rel='noopener noreferrer'
            className='group relative p-3 bg-black text-white rounded-full hover:scale-110 transition-all duration-200 hover:shadow-lg'
            aria-label='Share on X (Twitter)'
          >
            <FontAwesomeIcon icon={faTwitter} className='w-5 h-5' />
            <span className='absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none'>
              X
            </span>
          </a>

          {/* Facebook */}
          <a
            href={shareLinks.facebook}
            target='_blank'
            rel='noopener noreferrer'
            className='group relative p-3 bg-blue-600 text-white rounded-full hover:scale-110 transition-all duration-200 hover:shadow-lg'
            aria-label='Share on Facebook'
          >
            <FontAwesomeIcon icon={faFacebook} className='w-5 h-5' />
            <span className='absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none'>
              Facebook
            </span>
          </a>

          {/* LINE */}
          <a
            href={shareLinks.line}
            target='_blank'
            rel='noopener noreferrer'
            className='group relative p-3 bg-green-500 text-white rounded-full hover:scale-110 transition-all duration-200 hover:shadow-lg'
            aria-label='Share on LINE'
          >
            <FontAwesomeIcon icon={faLine} className='w-5 h-5' />
            <span className='absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none'>
              LINE
            </span>
          </a>

          {/* はてなブックマーク */}
          <a
            href={shareLinks.hatena}
            target='_blank'
            rel='noopener noreferrer'
            className='group relative p-3 bg-blue-500 text-white rounded-full hover:scale-110 transition-all duration-200 hover:shadow-lg flex items-center justify-center'
            aria-label='Share on Hatena Bookmark'
          >
            <span className='font-bold text-sm'>B!</span>
            <span className='absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none'>
              はてブ
            </span>
          </a>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className='group relative p-3 bg-gray-600 text-white rounded-full hover:scale-110 transition-all duration-200 hover:shadow-lg'
            aria-label='Copy link'
          >
            <FontAwesomeIcon icon={faLink} className='w-5 h-5' />
            <span className='absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none'>
              {copied ? 'コピーしました！' : 'リンクをコピー'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
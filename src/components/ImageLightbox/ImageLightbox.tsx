'use client';
import { useEffect, useState } from 'react';

export const ImageLightbox = () => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && target.closest('.znc')) {
        const imgSrc = (target as HTMLImageElement).src;
        if (imgSrc && !imgSrc.includes('favicon') && !imgSrc.includes('s2/favicons')) {
          setSrc(imgSrc);
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (!src) return null;

  return (
    <div
      className='fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out'
      onClick={() => setSrc(null)}
    >
      <img
        src={src}
        alt=''
        className='max-w-full max-h-[90vh] object-contain rounded-lg'
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={() => setSrc(null)}
        className='absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl transition-colors'
      >
        ✕
      </button>
    </div>
  );
};

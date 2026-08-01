'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

type LightboxImage = { src: string; alt: string };

export const ImageLightbox = () => {
  const [image, setImage] = useState<LightboxImage | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // 閉じたときにフォーカスを戻す先（拡大前にクリックした画像）
  const openerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setImage(null);
    openerRef.current?.focus?.();
    openerRef.current = null;
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'IMG' || !target.closest('.znc')) return;
      const img = target as HTMLImageElement;
      // リンクカードのfaviconやサムネイルは拡大対象にしない
      if (!img.src || img.src.includes('favicon') || img.src.includes('s2/favicons')) return;
      if (img.closest('.link-card')) return;
      openerRef.current = img;
      // 拡大した画像でもaltを引き継ぐ。以前は alt='' で情報が落ちていた
      setImage({ src: img.src, alt: img.alt || '' });
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // 開いている間だけ Esc と背面スクロールを制御する
  useEffect(() => {
    if (!image) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [image, close]);

  if (!image) return null;

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-label='画像を拡大表示'
      className='fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4 cursor-zoom-out'
      onClick={close}
    >
      <img
        src={image.src}
        alt={image.alt}
        className='max-w-full max-h-[85vh] object-contain rounded-lg'
        onClick={(e) => e.stopPropagation()}
      />
      {image.alt && (
        <p
          className='mt-3 max-w-2xl text-center text-sm text-white/80'
          onClick={(e) => e.stopPropagation()}
        >
          {image.alt}
        </p>
      )}
      <button
        ref={closeButtonRef}
        onClick={close}
        aria-label='閉じる'
        className='absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl transition-colors'
      >
        <span aria-hidden='true'>✕</span>
      </button>
    </div>
  );
};

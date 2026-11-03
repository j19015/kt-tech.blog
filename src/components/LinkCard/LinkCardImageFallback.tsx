'use client';
import { useEffect } from 'react';

/**
 * リンクカードのOGP画像が読み込めなかったとき、画像の枠ごと取り除く。
 *
 * 本文は dangerouslySetInnerHTML で描画しているので、img に onError を付けられない。
 * error イベントはバブリングしないため、document でキャプチャして拾う。
 * ハイドレーション前に失敗した画像は error を取りこぼすので、マウント時にも確認する。
 */
const SELECTOR = '.link-card .link-card-thumbnail';

function removeThumbnail(img: HTMLImageElement) {
  img.closest('.link-card')?.classList.add('link-card--no-image');
  img.remove();
}

export const LinkCardImageFallback = () => {
  useEffect(() => {
    document.querySelectorAll<HTMLImageElement>(SELECTOR).forEach((img) => {
      // complete かつ naturalWidth が 0 = 読み込み済みで失敗している
      if (img.complete && img.naturalWidth === 0) removeThumbnail(img);
    });

    const onError = (e: Event) => {
      const target = e.target;
      if (target instanceof HTMLImageElement && target.matches(SELECTOR)) removeThumbnail(target);
    };
    document.addEventListener('error', onError, true);
    return () => document.removeEventListener('error', onError, true);
  }, []);

  return null;
};

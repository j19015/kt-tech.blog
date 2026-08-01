'use client';
import { useEffect } from 'react';

/**
 * YouTube のサムネイルがクリックされたら iframe に差し替える。
 *
 * 記事を開いた時点で iframe を置くと、見られない動画のために
 * YouTube の重いスクリプトを毎回読み込むことになる。
 * サムネイルは画像1枚なので、表示速度への影響がほとんどない。
 */
export const EmbedPlayer = () => {
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    document.querySelectorAll<HTMLElement>('.znc .embed--youtube').forEach((block) => {
      const button = block.querySelector('button');
      const id = block.dataset.youtube;
      if (!button || !id) return;

      const play = () => {
        const iframe = document.createElement('iframe');
        // 再生前の追跡を減らすため nocookie ドメインを使う
        iframe.src = `https://www.youtube-nocookie.com/embed/${id}${block.dataset.start || ''}${
          block.dataset.start ? '&' : '?'
        }autoplay=1`;
        iframe.title = 'YouTube の動画';
        iframe.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen';
        iframe.allowFullscreen = true;
        block.replaceChildren(iframe);
      };
      button.addEventListener('click', play);
      cleanups.push(() => button.removeEventListener('click', play));
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
};

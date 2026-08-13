'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 目次と回遊導線をまとめた sticky なレール。
 *
 * 中身が入りきらないときはレールごとスクロールするが、端が切り立ったままだと
 * 「まだ続きがある」ことが見た目から分からない。隠れている側の端だけを
 * フェードさせて、スクロールできることを示す。
 *
 * 両端とも見切れていないときはマスクを全面不透明にする。常にフェードさせると
 * 最後までスクロールしたのに末尾が薄いままで、読み終えた感じが出ない。
 */
export const TocRail = ({ children }: { children: React.ReactNode }) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState({ top: false, bottom: false });

  const update = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    // 1px 未満の端数でフェードが点滅しないよう、少し余裕を持たせる
    setFade({
      top: scrollTop > 4,
      bottom: scrollTop + clientHeight < scrollHeight - 4,
    });
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    update();

    // 目次の開閉や回遊導線の読み込みで高さが変わるため、
    // リサイズだけでなく中身の変化も見る。
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    for (const child of Array.from(el.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [update]);

  const mask = `linear-gradient(to bottom, ${
    fade.top ? 'transparent 0, #000 20px' : '#000 0'
  }, ${fade.bottom ? '#000 calc(100% - 28px), transparent 100%' : '#000 100%'})`;

  return (
    <div
      ref={railRef}
      data-toc-rail
      onScroll={update}
      className='scrollbar-slim sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain rounded-lg bg-white/50 p-4 backdrop-blur-sm dark:bg-slate-900/50'
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      {children}
    </div>
  );
};

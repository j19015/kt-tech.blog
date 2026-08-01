'use client';
import { useState, useEffect, useRef } from 'react';
import { tocDepth, type TocItem } from '@/lib/toc';



export const StickyTableOfContents = ({ toc }: { toc: TocItem[] }) => {
  const [activeId, setActiveId] = useState<string>('');
  const tocRef = useRef<HTMLUListElement>(null);
  const activeItemRef = useRef<HTMLLIElement>(null);

  // 以前はスクロールイベントごとに getElementById と offsetTop を見出しの数だけ実行していた。
  // offsetTop / scrollHeight の読み取りは強制同期レイアウトを起こすため、
  // スクロール中に毎フレーム走るとジャンクの原因になる。
  useEffect(() => {
    if (toc.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const elements = toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        // 目次の並び順で最初に見えているものを現在地とする
        const current = toc.find((item) => visible.has(item.id));
        if (current) setActiveId(current.id);
      },
      // ヘッダー分を除いた画面上部30%に入った見出しを「現在地」とみなす
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    setActiveId(toc[0].id);
    return () => observer.disconnect();
  }, [toc]);

  // アクティブなアイテムが変更されたときに目次内でスクロール
  useEffect(() => {
    if (activeId && tocRef.current) {
      const activeElement = tocRef.current.querySelector(`[data-toc-id="${activeId}"]`);
      if (activeElement) {
        const tocContainer = tocRef.current;
        const elementTop = (activeElement as HTMLElement).offsetTop;
        const elementHeight = (activeElement as HTMLElement).offsetHeight;
        const containerHeight = tocContainer.offsetHeight;
        const containerScrollTop = tocContainer.scrollTop;

        // アクティブな要素が見えるように目次をスクロール
        const targetScrollTop = elementTop - containerHeight / 2 + elementHeight / 2;
        
        tocContainer.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }
  }, [activeId]);

  // preventDefault + pushState をやめ、ブラウザ標準のアンカー移動に任せる。
  // 以前は目次を押すたびに履歴が積まれ、戻るボタンで前のページに帰れなくなっていた。
  // ヘッダー分のオフセットは globals.css の scroll-padding-top が担当する。
  const handleClick = (id: string) => setActiveId(id);

  if (toc.length === 0) return null;

  return (
    <nav aria-label='目次' className='sticky top-20 p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm'>
      <h2 className='text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4'>
        目次
      </h2>

      <ul ref={tocRef} className='space-y-0.5 max-h-[60vh] overflow-y-auto'>
        {toc.map((item) => (
          <li
            key={item.id}
            data-toc-id={item.id}
            ref={activeId === item.id ? activeItemRef : null}
            // 現在地は左のバーの色だけで示していたが、目次が長いと見つけにくい。
            // 薄い背景を敷いて、視線がすぐ戻れるようにする。
            className={`border-l-2 transition-all ${
              activeId === item.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40'
                : 'border-slate-200 dark:border-slate-700'
            } ${['', 'ml-1', 'ml-2'][tocDepth(item.tag)]}`}
          >
            <a
              href={`#${item.id}`}
              onClick={() => handleClick(item.id)}
              title={item.text}
              // 長い見出しで目次が縦に伸びすぎないよう2行までにする。
              // h3 は字下げを pl で取る。折り返した2行目も一緒に下がるので、
              // ml と違って「h2の2行目」と「h3の1行目」が見分けられる。
              className={`block py-1.5 line-clamp-2 transition-colors ${
                tocDepth(item.tag) === 0
                  ? 'pl-3 text-sm'
                  : tocDepth(item.tag) === 1
                    ? 'pl-7 text-xs'
                    : 'pl-10 text-xs'
              } ${
                activeId === item.id
                  ? 'text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
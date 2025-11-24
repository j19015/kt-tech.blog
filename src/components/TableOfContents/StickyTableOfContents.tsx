'use client';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

interface TocItem {
  id: string;
  text: string;
  tag: string;
}

export const StickyTableOfContents = ({ toc }: { toc: TocItem[] }) => {
  const [activeId, setActiveId] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const tocRef = useRef<HTMLUListElement>(null);
  const activeItemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const headings = toc.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      // 現在表示されているセクションを特定
      let currentActiveId = '';
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading && heading.offsetTop <= scrollPosition) {
          currentActiveId = toc[i].id;
          break;
        }
      }

      // 最初のセクションより上にいる場合は最初のセクションをアクティブに
      if (!currentActiveId && headings[0]) {
        currentActiveId = toc[0].id;
      }

      setActiveId(currentActiveId);

      // スクロール進捗の計算
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // ヘッダーの高さ分のオフセット
      const elementPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      
      // URLを更新
      window.history.pushState(null, '', `#${id}`);
      setActiveId(id);
    }
  };

  return (
    <div className='sticky top-20 p-5 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700'>
      <div className='flex items-center gap-2 mb-5'>
        <FontAwesomeIcon icon={faListUl} className='text-cyan-600 dark:text-cyan-400' />
        <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100'>
          目次
        </h2>
      </div>

      {/* プログレスバー */}
      <div className='mb-4 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden'>
        <div
          className='h-full bg-cyan-500 dark:bg-cyan-400 transition-all duration-300'
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 現在のセクション表示 */}
      {activeId && (
        <div className='mb-3 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600'>
          <p className='text-xs text-slate-600 dark:text-slate-400 font-medium mb-1'>
            現在のセクション
          </p>
          <p className='text-sm font-semibold text-slate-900 dark:text-slate-100 truncate'>
            {toc.find(item => item.id === activeId)?.text}
          </p>
        </div>
      )}

      <ul
        ref={tocRef}
        className='space-y-1 max-h-[50vh] overflow-y-auto scroll-smooth scroll_bar'
      >
        {toc.map((item) => (
          <li
            key={item.id}
            data-toc-id={item.id}
            ref={activeId === item.id ? activeItemRef : null}
            className={`
              transition-all duration-200
              ${item.tag === 'h2' ? 'ml-4' : item.tag === 'h3' ? 'ml-8' : ''}
            `}
          >
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`
                block py-2 px-3 rounded-lg transition-all duration-200
                hover:bg-slate-100 dark:hover:bg-slate-700
                ${
                  activeId === item.id
                    ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-slate-700 font-semibold border-l-3 border-cyan-500 dark:border-cyan-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-l-3 border-transparent'
                }
              `}
            >
              <span className='flex items-center gap-2'>
                <span className='text-xs'>
                  {activeId === item.id ? '●' : '○'}
                </span>
                <span className='line-clamp-2 text-sm'>
                  {item.text}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* スクロールインジケーター */}
      {toc.length > 5 && (
        <div className='mt-3 pt-3 border-t border-slate-200 dark:border-slate-700'>
          <div className='flex items-center justify-between text-xs text-slate-500 dark:text-slate-400'>
            <span>
              {toc.findIndex(item => item.id === activeId) + 1} / {toc.length}
            </span>
            <span>
              スクロールで移動
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
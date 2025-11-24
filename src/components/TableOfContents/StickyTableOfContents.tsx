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
    <div className='sticky top-20 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900'>
      <h2 className='text-sm font-bold text-slate-900 dark:text-slate-100 mb-3'>
        目次
      </h2>

      <ul ref={tocRef} className='space-y-2 max-h-[60vh] overflow-y-auto'>
        {toc.map((item) => (
          <li
            key={item.id}
            data-toc-id={item.id}
            ref={activeId === item.id ? activeItemRef : null}
            className={`${item.tag === 'h2' ? 'ml-3' : item.tag === 'h3' ? 'ml-6' : ''}`}
          >
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`block text-sm transition-colors ${
                activeId === item.id
                  ? 'text-slate-900 dark:text-slate-100 font-medium'
                  : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
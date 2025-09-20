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
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className='sticky top-20 p-5 rounded-xl bg-card/80 backdrop-blur-sm shadow-xl border border-border'
    >
      <div className='flex items-center gap-2 mb-5'>
        <motion.div
          animate={{ rotate: activeId ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <FontAwesomeIcon icon={faListUl} className='text-indigo-500' />
        </motion.div>
        <h2 className='text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
          目次
        </h2>
      </div>
      
      {/* プログレスバー */}
      <div className='mb-4 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
        <motion.div 
          className='h-full bg-gradient-to-r from-indigo-500 to-purple-500'
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* 現在のセクション表示 */}
      <AnimatePresence mode='wait'>
        {activeId && (
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className='mb-3 p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200 dark:border-indigo-800'
          >
            <p className='text-xs text-indigo-600 dark:text-indigo-400 font-medium'>
              現在のセクション:
            </p>
            <p className='text-sm font-semibold text-foreground truncate'>
              {toc.find(item => item.id === activeId)?.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <ul 
        ref={tocRef}
        className='space-y-1 max-h-[50vh] overflow-y-auto scroll-smooth'
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(99 102 241 / 0.3) transparent'
        }}
      >
        {toc.map((item, index) => (
          <motion.li
            key={item.id}
            data-toc-id={item.id}
            ref={activeId === item.id ? activeItemRef : null}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
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
                hover:bg-gray-100 dark:hover:bg-gray-800
                ${
                  activeId === item.id
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 font-semibold border-l-4 border-indigo-500 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground border-l-4 border-transparent'
                }
              `}
            >
              <span className='flex items-center gap-2'>
                <motion.span 
                  className='text-xs'
                  animate={{ 
                    scale: activeId === item.id ? [1, 1.3, 1] : 1,
                    rotate: activeId === item.id ? [0, 360] : 0
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {activeId === item.id ? '●' : '○'}
                </motion.span>
                <span className='line-clamp-2 text-sm'>
                  {item.text}
                </span>
              </span>
            </a>
          </motion.li>
        ))}
      </ul>

      {/* スクロールインジケーター */}
      {toc.length > 5 && (
        <div className='mt-3 pt-3 border-t border-border'>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span>
              {toc.findIndex(item => item.id === activeId) + 1} / {toc.length}
            </span>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              スクロールで移動
            </motion.span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
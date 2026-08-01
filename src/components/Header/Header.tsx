'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { ModeToggle } from '../ModeToggle/modeToggle';
import { Menu, X, Home, BookOpen, User, Search, Github, Library } from 'lucide-react';
import { SearchModal } from '../SearchModal/SearchModal';
import { useDialog } from '@/lib/useDialog';

const MENU_ITEMS = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Blog', href: '/blogs/page/1', icon: BookOpen },
  { name: 'Series', href: '/series', icon: Library },
  { name: 'About', href: '/about', icon: User },
];

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
);

export const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  // 検索モーダルの開閉はここで持つ。
  // 以前は偽のKeyboardEventをdispatchして開いており、既に開いている状態で
  // 押すとトグルで閉じてしまうなど、状態がUIと結びついていなかった。
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const menuRef = useDialog<HTMLDivElement>(isMenuOpen, closeMenu);

  // 依存配列がないと毎レンダーでリスナーを付け外しすることになる
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setHidden(y > 100 && y > lastY.current);
        lastY.current = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ルート変更で state を持たず、現在のパスから判定する。
  // クリック時に state を更新する方式だと、直リンクやブラウザバックで正しくならない。
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href.split('/page')[0]);

  const openSearch = () => {
    closeMenu();
    setSearchOpen(true);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-transform duration-300 ${
          hidden && !isMenuOpen ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className='max-w-6xl mx-auto px-4 py-4 flex justify-between items-center'>
          <Link href='/' onClick={closeMenu} className='flex items-center gap-2.5'>
            {/* favicon.ico は48pxしかなく、Retinaで28px表示するとぼやけていた */}
            <Image src='/images/logo.webp' alt='' width={28} height={28} className='rounded' priority />
            <span className='text-xl font-bold text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-slate-300 transition-colors'>
              kt-tech.blog
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center gap-8'>
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`text-sm transition-colors ${
                  isActive(item.href)
                    ? 'text-slate-900 dark:text-slate-100 font-medium'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => setSearchOpen(true)}
              className='flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
              aria-label='検索'
            >
              <Search className='w-3.5 h-3.5' aria-hidden='true' />
              <kbd className='text-[10px]'>K</kbd>
            </button>
            <ModeToggle />
          </nav>

          {/* Mobile Menu */}
          <div className='flex items-center gap-3 md:hidden'>
            {/* 以前はメニューを開かないと検索できず、モバイルだけ導線が遠かった */}
            <button onClick={() => setSearchOpen(true)} aria-label='検索' className='text-slate-600 dark:text-slate-400'>
              <Search className='w-5 h-5' aria-hidden='true' />
            </button>
            <ModeToggle />
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className='text-slate-600 dark:text-slate-400'
              aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
              aria-expanded={isMenuOpen}
              aria-controls='mobile-menu'
            >
              {isMenuOpen ? <X size={24} aria-hidden='true' /> : <Menu size={24} aria-hidden='true' />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div
          id='mobile-menu'
          ref={menuRef}
          role='dialog'
          aria-modal='true'
          aria-label='メニュー'
          className='fixed inset-0 z-40 md:hidden bg-white dark:bg-slate-900 animate-fadeIn'
        >
          <div className='flex flex-col justify-between h-full pt-24 pb-12 px-8'>
            <nav className='space-y-2'>
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-colors ${
                      isActive(item.href)
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className='w-5 h-5 text-slate-400 dark:text-slate-500' aria-hidden='true' />
                    <span className='text-lg font-medium'>{item.name}</span>
                  </Link>
                );
              })}
              <button
                onClick={openSearch}
                className='flex items-center gap-4 px-4 py-4 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full'
              >
                <Search className='w-5 h-5 text-slate-400 dark:text-slate-500' aria-hidden='true' />
                <span className='text-lg font-medium'>Search</span>
              </button>
            </nav>

            {/* Bottom section */}
            <div className='space-y-6'>
              <div className='border-t border-slate-200 dark:border-slate-700 pt-6'>
                <Link href='/about' onClick={closeMenu} className='flex items-center gap-4 px-4'>
                  <Image
                    src='/images/meow_koki.webp'
                    alt=''
                    width={40}
                    height={40}
                    className='rounded-full object-cover'
                  />
                  <div>
                    <p className='text-sm font-medium text-slate-900 dark:text-slate-100'>Koki</p>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>Full Stack Engineer</p>
                  </div>
                </Link>
              </div>
              <div className='flex items-center gap-4 px-4'>
                <a
                  href='https://github.com/j19015'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='GitHub'
                  className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors'
                >
                  <Github className='w-5 h-5' aria-hidden='true' />
                </a>
                <a
                  href='https://x.com/tech_koki'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='X (Twitter)'
                  className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors'
                >
                  <XIcon className='w-5 h-5' />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      <SearchModal isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;

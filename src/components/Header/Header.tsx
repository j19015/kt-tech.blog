'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ModeToggle } from '../ModeToggle/modeToggle';
import { Menu, X, Home, BookOpen, User, Search, Github } from 'lucide-react';

export const Header = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('Home');
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y > 100 && y > lastY) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastY(y);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const handleMenuClose = (menuName: string) => {
    setOpen(false);
    setSelected(menuName);
  };

  const menuItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Blog', href: '/blogs/page/1', icon: BookOpen },
    { name: 'About', href: '/about', icon: User },
    { name: 'Search', href: '/searches', icon: Search },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-transform duration-300 ${hidden && !isOpen ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className='max-w-6xl mx-auto px-4 py-4 flex justify-between items-center'>
          <Link href='/' onClick={() => handleMenuClose('Home')}>
            <h1 className='text-xl font-bold text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-slate-300 transition-colors'>
              kt-tech.blog
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center gap-8'>
            {menuItems.slice(0, 3).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSelected(item.name)}
                className='text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
              >
                {item.name}
              </Link>
            ))}
            <ModeToggle />
          </nav>

          {/* Mobile Menu */}
          <div className='flex items-center gap-4 md:hidden'>
            <ModeToggle />
            <button
              onClick={() => setOpen(!isOpen)}
              className='text-slate-600 dark:text-slate-400'
              aria-label='Toggle menu'
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className='fixed inset-0 z-40 md:hidden bg-white dark:bg-slate-900'>
          <div className='flex flex-col justify-between h-full pt-24 pb-12 px-8'>
            {/* Menu Items */}
            <nav className='space-y-2'>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => handleMenuClose(item.name)}
                    className='flex items-center gap-4 px-4 py-4 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                  >
                    <Icon className='w-5 h-5 text-slate-400 dark:text-slate-500' />
                    <span className='text-lg font-medium'>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom section */}
            <div className='space-y-6'>
              <div className='border-t border-slate-200 dark:border-slate-700 pt-6'>
                <div className='flex items-center gap-4 px-4'>
                  <img src='/images/meow_koki.webp' alt='Koki' className='w-10 h-10 rounded-full object-cover' />
                  <div>
                    <p className='text-sm font-medium text-slate-900 dark:text-slate-100'>Koki</p>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>Full Stack Engineer</p>
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-4 px-4'>
                <a href='https://github.com/j19015' target='_blank' rel='noopener noreferrer' className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors'>
                  <Github className='w-5 h-5' />
                </a>
                <a href='https://x.com/meow_koki' target='_blank' rel='noopener noreferrer' className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors'>
                  <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'><path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

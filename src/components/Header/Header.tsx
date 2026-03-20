'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ModeToggle } from '../ModeToggle/modeToggle';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('Home');

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

  const handleMenuClose = (menuName: string) => {
    setOpen(false);
    setSelected(menuName);
  };

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blogs/page/1' },
    { name: 'About', href: '/about' }
  ];

  return (
    <>
      <header className='sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800'>
        <div className='max-w-6xl mx-auto px-4 py-4 flex justify-between items-center'>
          <Link href='/' onClick={() => handleMenuClose('Home')}>
            <h1 className='text-xl font-bold text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-slate-300 transition-colors'>
              kt-tech.blog
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center gap-8'>
            {menuItems.map((item) => (
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

      {/* Mobile Menu Panel - Full screen overlay */}
      {isOpen && (
        <div className='fixed inset-0 z-40 md:hidden bg-white dark:bg-slate-900'>
          <div className='flex flex-col items-center justify-center h-full gap-2'>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => handleMenuClose(item.name)}
                className='px-8 py-4 text-lg font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors'
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
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

      {/* Mobile Menu Panel */}
      {isOpen && (
        <>
          <div
            className='fixed inset-0 bg-black/20 dark:bg-black/40 z-40 md:hidden'
            onClick={() => setOpen(false)}
          />
          <nav className='fixed top-[73px] right-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-40 md:hidden'>
            <ul className='p-4 space-y-1'>
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => handleMenuClose(item.name)}
                    className='block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </>
  );
};

export default Header;
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBlog, faUser, faCode } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { ModeToggle } from '../ModeToggle/modeToggle';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('Home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // モバイルメニューが開いているときはスクロールを無効化
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleMenuOpen = () => {
    setOpen(!isOpen);
  };

  const handleMenuClose = (menuName: string) => {
    setOpen(false);
    setSelected(menuName);
  };

  const menuItems = [
    { name: 'Home', href: '/', icon: faHome },
    { name: 'Blog', href: '/blogs/page/1', icon: faBlog },
    { name: 'About', href: '/about', icon: faUser }
  ];

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
          <Link href='/' onClick={() => handleMenuClose('Home')}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='flex items-center gap-2'
            >
              <div className='w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-xl'>K</span>
              </div>
              <h1 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                kt-tech.blog
              </h1>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:block'>
            <ul className='flex items-center gap-2'>
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} onClick={() => setSelected(item.name)}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                        selected === item.name
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                          : scrolled 
                            ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
                            : 'hover:bg-gray-100/10 dark:hover:bg-gray-800/30 text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      <FontAwesomeIcon icon={item.icon} className='w-4 h-4' />
                      <span className='font-medium'>{item.name}</span>
                    </motion.div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className='flex items-center gap-4'>
            <ModeToggle />
            
            {/* Mobile Menu Button */}
            <button
              className='md:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-md'
              onClick={handleMenuOpen}
              aria-label='Toggle navigation menu'
            >
              {isOpen ? (
                <X className='w-6 h-6 text-gray-900 dark:text-gray-100' />
              ) : (
                <Menu className='w-6 h-6 text-gray-900 dark:text-gray-100' />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden'
            />
            
            {/* Menu Panel */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className='fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-40 md:hidden'
            >
              <div className='flex flex-col h-full'>
                {/* Header */}
                <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
                  <h2 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                    Navigation
                  </h2>
                </div>

                {/* Menu Items */}
                <div className='flex-1 overflow-y-auto p-6'>
                  <ul className='space-y-3'>
                    {menuItems.map((item, index) => (
                      <motion.li
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => handleMenuClose(item.name)}
                        >
                          <motion.div
                            whileHover={{ x: 10 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-4 rounded-xl flex items-center gap-3 transition-all duration-300 ${
                              selected === item.name
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              selected === item.name
                                ? 'bg-white/20'
                                : 'bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900'
                            }`}>
                              <FontAwesomeIcon icon={item.icon} className={`w-5 h-5 ${
                                selected === item.name
                                  ? 'text-white'
                                  : 'text-indigo-600 dark:text-indigo-400'
                              }`} />
                            </div>
                            <div>
                              <span className={`font-semibold text-base ${
                                selected === item.name ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                              }`}>
                                {item.name}
                              </span>
                              <p className={`text-xs mt-0.5 ${
                                selected === item.name
                                  ? 'text-white/80'
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {item.name === 'Home' && 'トップページ'}
                                {item.name === 'Blog' && '記事一覧'}
                                {item.name === 'About' && 'このサイトについて'}
                              </p>
                            </div>
                          </motion.div>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className='p-6 border-t border-gray-200 dark:border-gray-700'>
                  <div className='p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl'>
                    <h3 className='font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100'>
                      Follow Me
                    </h3>
                    <div className='flex gap-3'>
                      <a href='https://github.com/j19015' target='_blank' rel='noopener noreferrer'>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className='w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-white'
                        >
                          <FontAwesomeIcon icon={faGithub} className='w-5 h-5' />
                        </motion.div>
                      </a>
                      <a href='https://twitter.com/tech_koki' target='_blank' rel='noopener noreferrer'>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className='w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white'
                        >
                          <FontAwesomeIcon icon={faTwitter} className='w-5 h-5' />
                        </motion.div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
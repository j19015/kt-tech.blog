'use client';
import Link from 'next/link';
import React from 'react';
import { useState } from 'react';
import ContactModal from '../Modal/contactModal';
import PrivacyPolicyModal from '../Modal/privacyPolicy';
import { Github } from 'lucide-react';

// X icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
);

export const Footer = () => {
  const [iscontactOpen, setContactOpen] = useState(false);
  const [isPrivacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);

  return (
    <footer className='mt-20 border-t border-slate-200 dark:border-slate-800'>
      <div className='max-w-4xl mx-auto px-6 py-10'>
        {/* メインコンテンツ */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
          {/* ブランド */}
          <div>
            <Link href='/' className='text-lg font-semibold text-slate-800 dark:text-slate-200'>
              kt-tech.blog
            </Link>
          </div>

          {/* ナビゲーション */}
          <nav className='flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400'>
            <Link href='/'>Home</Link>
            <Link href='/blogs/page/1'>Blog</Link>
            <Link href='/about'>About</Link>
            <button onClick={() => setPrivacyPolicyOpen(true)}>
              Privacy
            </button>
            <button onClick={() => setContactOpen(true)}>
              Contact
            </button>
          </nav>

          {/* ソーシャル */}
          <div className='flex items-center gap-4'>
            <Link
              href='https://github.com/j19015'
              target='_blank'
              rel='noopener noreferrer'
              className='text-slate-500 dark:text-slate-400'
              aria-label='GitHub'
            >
              <Github className='w-5 h-5' />
            </Link>
            <Link
              href='https://twitter.com/tech_koki'
              target='_blank'
              rel='noopener noreferrer'
              className='text-slate-500 dark:text-slate-400'
              aria-label='X (Twitter)'
            >
              <XIcon className='w-5 h-5' />
            </Link>
          </div>
        </div>

        {/* コピーライト */}
        <div className='mt-8 pt-6 border-t border-slate-100 dark:border-slate-800'>
          <p className='text-xs text-slate-400 dark:text-slate-500'>
            © {new Date().getFullYear()} kt-tech.blog
          </p>
        </div>
      </div>

      <ContactModal isOpen={iscontactOpen} onClose={() => setContactOpen(false)} />
      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyOpen}
        onClose={() => setPrivacyPolicyOpen(false)}
      />
    </footer>
  );
};

export default Footer;

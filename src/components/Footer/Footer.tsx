'use client';
import Link from 'next/link';
import React from 'react';
import { useState } from 'react';
import ContactModal from '../Modal/contactModal';
import PrivacyPolicyModal from '../Modal/privacyPolicy';
import { Github, Mail, Rss } from 'lucide-react';

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
);

export const Footer = () => {
  const [iscontactOpen, setContactOpen] = useState(false);
  const [isPrivacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);

  return (
    <footer className='mt-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800'>
      <div className='max-w-6xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-10'>
          {/* ブランド & 説明 */}
          <div className='md:col-span-2'>
            <Link href='/' className='text-xl font-bold text-slate-800 dark:text-slate-100'>
              kt-tech.blog
            </Link>
            <p className='mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md'>
              実践的な技術記事とエンジニアリングの知見を発信。
              React, Next.js, TypeScript, Cloudflare, AIなどのモダン技術を中心に。
            </p>
            <div className='flex items-center gap-4 mt-5'>
              <Link
                href='https://github.com/j19015'
                target='_blank'
                rel='noopener noreferrer'
                className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:scale-110 transition-all duration-200'
                aria-label='GitHub'
              >
                <Github className='w-5 h-5' />
              </Link>
              <Link
                href='https://x.com/meow_koki'
                target='_blank'
                rel='noopener noreferrer'
                className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:scale-110 transition-all duration-200'
                aria-label='X (Twitter)'
              >
                <XIcon className='w-5 h-5' />
              </Link>
              <Link
                href='/feed.xml'
                className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:scale-110 transition-all duration-200'
                aria-label='RSS'
              >
                <Rss className='w-5 h-5' />
              </Link>
            </div>
          </div>

          {/* ナビゲーション */}
          <div>
            <h3 className='text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4'>
              Navigation
            </h3>
            <ul className='space-y-2.5 text-sm'>
              <li>
                <Link href='/' className='text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/blogs/page/1' className='text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors'>
                  Blog
                </Link>
              </li>
              <li>
                <Link href='/about' className='text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors'>
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* リーガル */}
          <div>
            <h3 className='text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4'>
              Legal
            </h3>
            <ul className='space-y-2.5 text-sm'>
              <li>
                <button
                  onClick={() => setPrivacyPolicyOpen(true)}
                  className='text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors'
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setContactOpen(true)}
                  className='text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors'
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className='mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-2'>
          <p className='text-xs text-slate-400 dark:text-slate-500'>
            © {new Date().getFullYear()} kt-tech.blog. All rights reserved.
          </p>
          <p className='text-xs text-slate-400 dark:text-slate-500'>
            Built with Next.js & Cloudflare Pages
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

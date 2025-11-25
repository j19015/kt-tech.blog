'use client';
import Link from 'next/link';
import React from 'react';
import { useState } from 'react';
import ContactModal from '../Modal/contactModal';
import PrivacyPolicyModal from '../Modal/privacyPolicy';

export const Footer = () => {
  const [iscontactOpen, setContactOpen] = useState(false);
  const [isPrivacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);

  return (
    <footer className='mt-20 border-t border-slate-200 dark:border-slate-800'>
      <div className='max-w-6xl mx-auto px-4 py-12'>
        <div className='grid md:grid-cols-3 gap-8 text-sm'>
          {/* ブランド */}
          <div>
            <h3 className='font-bold text-slate-900 dark:text-slate-100 mb-3'>
              kt-tech.blog
            </h3>
            <p className='text-slate-600 dark:text-slate-300 text-sm leading-relaxed'>
              実践的な技術記事とエンジニアリングの知見を発信
            </p>
          </div>

          {/* リンク */}
          <div>
            <h4 className='font-bold text-slate-900 dark:text-slate-100 mb-3'>Links</h4>
            <ul className='space-y-2'>
              <li>
                <Link href='/' className='text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/blogs/page/1' className='text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'>
                  Blog
                </Link>
              </li>
              <li>
                <Link href='/about' className='text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'>
                  About
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setPrivacyPolicyOpen(true)}
                  className='text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* ソーシャル */}
          <div>
            <h4 className='font-bold text-slate-900 dark:text-slate-100 mb-3'>Connect</h4>
            <div className='flex gap-4'>
              <Link
                href='https://github.com/j19015'
                target='_blank'
                className='text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
              >
                GitHub
              </Link>
              <Link
                href='https://twitter.com/tech_koki'
                target='_blank'
                className='text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
              >
                Twitter
              </Link>
              <button
                onClick={() => setContactOpen(true)}
                className='text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
              >
                Contact
              </button>
            </div>
          </div>
        </div>

        {/* コピーライト */}
        <div className='mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center'>
          <p className='text-sm text-slate-500 dark:text-slate-300'>
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
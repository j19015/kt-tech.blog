'use client';
import Link from 'next/link';
import React from 'react';
import { useState } from 'react';
import ContactModal from '../Modal/contactModal';
import PrivacyPolicyModal from '../Modal/privacyPolicy';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faHeart, faEnvelope, faShield } from '@fortawesome/free-solid-svg-icons';

export const Footer = () => {
  const [iscontactOpen, setContactOpen] = useState(false);
  const [isPrivacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
  
  return (
    <footer className='mt-20 relative'>
      {/* 背景グラデーション */}
      <div className='absolute inset-0 bg-gradient-to-t from-indigo-50/50 via-transparent to-transparent dark:from-indigo-950/20' />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className='relative'
      >
        {/* メインフッター */}
        <div className='mx-4 mb-4 p-8 bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-xl'>
          <div className='max-w-7xl mx-auto'>
            <div className='grid md:grid-cols-3 gap-8 mb-8'>
              {/* ブランド */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4'>
                  kt-tech.blog
                </h3>
                <p className='text-muted-foreground text-sm'>
                  技術と創造性が交わる場所。<br />
                  最新の技術トレンドと実践的な知識を共有します。
                </p>
              </motion.div>

              {/* リンク */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='flex flex-col gap-3'
              >
                <h4 className='font-semibold text-foreground mb-2'>Quick Links</h4>
                <Link href='/' className='text-muted-foreground hover:text-indigo-600 transition-colors text-sm'>
                  Home
                </Link>
                <Link href='/blogs/page/1' className='text-muted-foreground hover:text-indigo-600 transition-colors text-sm'>
                  Blog
                </Link>
                <Link href='/about' className='text-muted-foreground hover:text-indigo-600 transition-colors text-sm'>
                  About
                </Link>
                <button 
                  onClick={() => setPrivacyPolicyOpen(true)} 
                  className='text-left text-muted-foreground hover:text-indigo-600 transition-colors text-sm'
                >
                  Privacy Policy
                </button>
              </motion.div>

              {/* ソーシャル & アクション */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h4 className='font-semibold text-foreground mb-4'>Connect</h4>
                <div className='flex gap-3 mb-6'>
                  <Link 
                    href='https://github.com/j19015' 
                    target='_blank'
                    className='w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:scale-110 transition-transform'
                  >
                    <FontAwesomeIcon icon={faGithub} className='w-5 h-5' />
                  </Link>
                  <Link 
                    href='https://twitter.com/tech_koki' 
                    target='_blank'
                    className='w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:scale-110 transition-transform'
                  >
                    <FontAwesomeIcon icon={faTwitter} className='w-5 h-5' />
                  </Link>
                  <button 
                    onClick={() => setContactOpen(true)}
                    className='w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:scale-110 transition-transform'
                  >
                    <FontAwesomeIcon icon={faEnvelope} className='w-5 h-5' />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* 区切り線 */}
            <div className='h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6' />

            {/* コピーライト */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className='text-center'
            >
              <p className='text-sm text-muted-foreground flex items-center justify-center gap-2'>
                © {new Date().getFullYear()} kt-tech.blog. 
                <span className='inline-flex items-center gap-1'>
                  Made with <FontAwesomeIcon icon={faHeart} className='w-3 h-3 text-red-500' /> in Japan
                </span>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <ContactModal isOpen={iscontactOpen} onClose={() => setContactOpen(false)} />
      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyOpen}
        onClose={() => setPrivacyPolicyOpen(false)}
      />
    </footer>
  );
};

export default Footer;
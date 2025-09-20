'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, MessageSquare, Send, Twitter, AlertCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // フォーム送信処理（現在は無効）
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm'
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl'
          >
            <div className='bg-card border border-border rounded-2xl shadow-2xl overflow-hidden'>
              {/* Header */}
              <div className='bg-gradient-to-r from-indigo-500 to-purple-500 p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center'>
                      <Mail className='w-6 h-6 text-white' />
                    </div>
                    <div>
                      <h2 className='text-2xl font-bold text-white'>
                        Contact Us
                      </h2>
                      <p className='text-xs text-white/80 mt-0.5'>お問い合わせ</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className='p-2 hover:bg-white/10 rounded-lg transition-colors'
                  >
                    <X className='w-5 h-5 text-white' />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className='p-6'>
                {/* Notice */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl'
                >
                  <div className='flex items-start gap-3'>
                    <AlertCircle className='w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5' />
                    <div>
                      <p className='text-sm font-medium text-amber-900 dark:text-amber-100'>
                        現在メールフォームは準備中です
                      </p>
                      <p className='text-xs text-amber-700 dark:text-amber-300 mt-1'>
                        お問い合わせは
                        <a 
                          href='https://twitter.com/tech_koki' 
                          target='_blank' 
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-1 ml-1 text-blue-600 dark:text-blue-400 hover:underline'
                        >
                          <Twitter className='w-3 h-3' />
                          Twitter
                        </a>
                        へお願いします。
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit} className='space-y-5 opacity-50 pointer-events-none'>
                  {/* Name Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className='block text-sm font-medium mb-2 text-foreground'>
                      お名前
                    </label>
                    <div className='relative'>
                      <User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                      <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder='山田 太郎'
                        className='w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-indigo-500 transition-colors'
                        required
                        disabled
                      />
                    </div>
                  </motion.div>

                  {/* Email Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className='block text-sm font-medium mb-2 text-foreground'>
                      メールアドレス
                    </label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                      <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder='example@email.com'
                        className='w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-indigo-500 transition-colors'
                        required
                        disabled
                      />
                    </div>
                  </motion.div>

                  {/* Message Textarea */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className='block text-sm font-medium mb-2 text-foreground'>
                      メッセージ
                    </label>
                    <div className='relative'>
                      <MessageSquare className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                      <textarea
                        name='message'
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder='お問い合わせ内容をご記入ください...'
                        rows={5}
                        className='w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-indigo-500 transition-colors resize-none'
                        required
                        disabled
                      />
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    type='submit'
                    disabled
                    className='w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    <Send className='w-4 h-4' />
                    送信する
                  </motion.button>
                </form>

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className='mt-8 pt-6 border-t border-border'
                >
                  <p className='text-center text-sm text-muted-foreground mb-4'>
                    または、SNSでお気軽にご連絡ください
                  </p>
                  <div className='flex justify-center gap-4'>
                    <a
                      href='https://twitter.com/tech_koki'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className='w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow'
                      >
                        <Twitter className='w-5 h-5' />
                      </motion.div>
                    </a>
                    <a
                      href='https://github.com/j19015'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className='w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow'
                      >
                        <span className='text-sm font-bold'>GH</span>
                      </motion.div>
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
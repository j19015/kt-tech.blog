'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  return (
    <div className='relative overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute top-10 left-10 w-72 h-72 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl' />
        <div className='absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 dark:bg-purple-400/5 rounded-full blur-3xl' />
      </div>

      <div className='max-w-3xl mx-auto px-4 py-16 lg:py-20'>
        <div className='space-y-6'>
          {/* Greeting */}
          <p className='text-sm font-medium text-blue-600 dark:text-blue-400 tracking-wide'>
            TECH BLOG
          </p>

          {/* Title */}
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight tracking-tight'>
            技術と創造性が
            <br className='sm:hidden' />
            交わる場所
          </h1>

          {/* Description */}
          <p className='text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed'>
            React, Next.js, TypeScript, Cloudflare, AI などのモダン技術を中心に、実践的な開発ノウハウを共有しています。
          </p>

          {/* CTA */}
          <div className='flex items-center gap-4 pt-2'>
            <Link
              href='/blogs/page/1'
              className='inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors text-sm font-medium'
            >
              記事を読む
              <ArrowRight className='w-4 h-4' />
            </Link>
            <Link
              href='/about'
              className='text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors'
            >
              About →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

'use client';
import Link from 'next/link';

export const HeroSection = () => {
  return (
    <div className='max-w-3xl mx-auto px-4 py-16 lg:py-24'>
      <div className='text-center space-y-6'>
        {/* Site Title */}
        <h1 className='text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100'>
          kt-tech.blog
        </h1>

        {/* Description */}
        <p className='text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed'>
          実践的な技術記事とエンジニアリングの知見を発信しています
        </p>

        {/* Simple Link */}
        <div className='pt-4'>
          <Link
            href='/blogs/page/1'
            className='inline-block text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-medium'
          >
            記事を読む →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
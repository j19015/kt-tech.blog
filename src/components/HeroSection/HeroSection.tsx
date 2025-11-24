'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Code2, Terminal, Layers } from 'lucide-react';
import Link from 'next/link';

export const HeroSection = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const texts = ['Build. Ship. Scale.', 'Modern Web Development', 'Code with Purpose'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className='relative overflow-hidden mx-4 my-8'
    >
      {/* メインコンテンツ */}
      <div className='relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black rounded-3xl overflow-hidden'>
        {/* Background Grid */}
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]' />

        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent' />

        {/* Accent Lines */}
        <div className='absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent' />
        <div className='absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent' />

        {/* Content Container */}
        <div className='relative z-10 px-6 py-20 lg:py-28'>
          {/* Tech Icons */}
          <div className='flex justify-center gap-6 mb-8'>
            {[Code2, Terminal, Layers].map((Icon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center'
              >
                <Icon className='w-6 h-6 text-cyan-400' />
              </motion.div>
            ))}
          </div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='text-center mb-6'
          >
            <h1 className='text-5xl lg:text-7xl font-bold text-white mb-4 tracking-tight'>
              kt-tech<span className='text-cyan-400'>.</span>blog
            </h1>

            {/* Animated Subtitle */}
            <div className='h-10 relative'>
              {texts.map((text, index) => (
                <motion.p
                  key={index}
                  className='text-xl lg:text-2xl font-medium text-slate-300 absolute inset-0 flex items-center justify-center'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: currentTextIndex === index ? 1 : 0,
                    y: currentTextIndex === index ? 0 : 10
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {text}
                </motion.p>
              ))}
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className='text-center text-slate-400 text-base lg:text-lg max-w-2xl mx-auto mb-10'
          >
            実践的な技術記事とエンジニアリングの知見を発信
          </motion.p>

          {/* Tech Stack */}
          <motion.div
            className='flex flex-wrap justify-center gap-3 mb-10'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {['React', 'Next.js', 'TypeScript', 'Tailwind CSS'].map((tech) => (
              <span
                key={tech}
                className='px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300'
              >
                {tech}
              </span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className='flex flex-col sm:flex-row justify-center gap-4'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Link href='/blogs/page/1'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300'
              >
                記事を読む
              </motion.button>
            </Link>
            <Link href='/about'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='px-8 py-4 bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-700 hover:border-slate-600 hover:bg-slate-700 transition-all duration-300'
              >
                About
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            className='grid grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            {[
              { label: 'Articles', value: '50+' },
              { label: 'Tech Stack', value: '15+' },
              { label: 'Years', value: '3+' }
            ].map((stat) => (
              <div
                key={stat.label}
                className='text-center p-6 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm'
              >
                <div className='text-3xl lg:text-4xl font-bold text-white mb-2'>
                  {stat.value}
                </div>
                <div className='text-sm text-slate-400 font-medium uppercase tracking-wider'>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Accent */}
        <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent' />
      </div>
    </motion.div>
  );
};

export default HeroSection;
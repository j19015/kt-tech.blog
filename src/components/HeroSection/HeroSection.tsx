'use client';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sparkles, Code2, Rocket, Brain } from 'lucide-react';
import Link from 'next/link';

export const HeroSection = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const texts = ['技術と創造性が交わる場所', 'Innovation meets Creativity', 'コードで未来を創造する'];
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 100 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [texts.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className='relative overflow-hidden rounded-2xl mx-4 my-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900/50 dark:via-indigo-950/30 dark:to-purple-950/30'
      onMouseMove={handleMouseMove}
    >
      {/* Interactive Background */}
      <div className='absolute inset-0'>
        <motion.div 
          className='absolute inset-0 opacity-30'
          style={{
            background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(99, 102, 241, 0.15), transparent 40%)',
            '--mouse-x': useTransform(x, (value) => `${value}px`),
            '--mouse-y': useTransform(y, (value) => `${value}px`),
          } as any}
        />
      </div>

      {/* Animated Grid Background */}
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]' />
      </div>

      {/* Floating Icons */}
      <div className='absolute inset-0'>
        <motion.div
          className='absolute top-10 left-10 text-indigo-500/20'
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Code2 className='w-12 h-12' />
        </motion.div>
        <motion.div
          className='absolute bottom-10 right-10 text-purple-500/20'
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 10, 0]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Rocket className='w-12 h-12' />
        </motion.div>
        <motion.div
          className='absolute top-20 right-20 text-pink-500/20'
          animate={{ 
            y: [0, -15, 0],
            x: [0, 15, 0]
          }}
          transition={{ duration: 7, repeat: Infinity }}
        >
          <Brain className='w-10 h-10' />
        </motion.div>
      </div>

      <motion.div 
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className='relative z-10 text-center py-16 px-6'
      >
        {/* Sparkle Effect */}
        <motion.div
          className='absolute top-4 right-4'
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles className='w-6 h-6 text-yellow-500' />
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='text-4xl lg:text-6xl font-bold mb-6'
        >
          <span className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]'>
            kt-tech.blog
          </span>
          <motion.span
            className='inline-block ml-2'
            animate={{ rotate: [0, 20, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            ✨
          </motion.span>
        </motion.h1>

        {/* Animated Subtitle */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className='h-8 mb-8 relative'
        >
          {texts.map((text, index) => (
            <motion.p
              key={index}
              className='text-xl text-muted-foreground absolute inset-0 flex items-center justify-center'
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: currentTextIndex === index ? 1 : 0,
                y: currentTextIndex === index ? 0 : 20
              }}
              transition={{ duration: 0.5 }}
            >
              {text}
            </motion.p>
          ))}
        </motion.div>
        
        {/* Tech Stack Pills with Animation */}
        <motion.div 
          className='flex flex-wrap justify-center gap-3 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {['React', 'Next.js', 'TypeScript', 'TailwindCSS'].map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
              }}
              className='relative'
            >
              <span className='px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-indigo-200 dark:border-indigo-800 rounded-full text-sm font-medium text-indigo-700 dark:text-indigo-300 shadow-md cursor-pointer'>
                {tech}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          className='flex justify-center gap-4'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Link href='/blogs/page/1'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2'
            >
              ブログを読む
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </Link>
          <Link href='/about'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 font-medium rounded-xl border-2 border-indigo-200 dark:border-indigo-800 shadow-md hover:shadow-lg transition-all duration-300'
            >
              About Me
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className='grid grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          {[
            { label: '記事数', value: '50+', icon: '📝' },
            { label: '技術スタック', value: '15+', icon: '⚡' },
            { label: '経験年数', value: '3+', icon: '🚀' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -5 }}
              className='bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-indigo-100 dark:border-indigo-900'
            >
              <div className='text-2xl mb-1'>{stat.icon}</div>
              <div className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                {stat.value}
              </div>
              <div className='text-xs text-muted-foreground'>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Animated gradient border */}
      <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse' />
    </motion.div>
  );
};

export default HeroSection;
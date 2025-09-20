'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className='flex items-center justify-center min-h-[60vh] relative'>
      {/* Main Loading Animation */}
      <div className='relative'>
        {/* Center Logo/Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='text-center mb-8'
        >
          <motion.h1 
            className='text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          >
            Loading
          </motion.h1>
        </motion.div>

        {/* Orbital Rings */}
        <div className='relative w-32 h-32 mx-auto'>
          {/* Ring 1 */}
          <motion.div
            className='absolute inset-0 border-2 border-indigo-500/30 rounded-full'
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50' />
          </motion.div>

          {/* Ring 2 */}
          <motion.div
            className='absolute inset-2 border-2 border-purple-500/30 rounded-full'
            animate={{ rotate: -360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          >
            <div className='absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50' />
          </motion.div>

          {/* Ring 3 */}
          <motion.div
            className='absolute inset-4 border-2 border-pink-500/30 rounded-full'
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-pink-500 rounded-full shadow-lg shadow-pink-500/50' />
          </motion.div>

          {/* Center Core */}
          <motion.div
            className='absolute inset-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full'
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Loading Text Animation */}
        <motion.div className='flex justify-center mt-8 gap-1'>
          {['読', '込', 'み', '中'].map((char, i) => (
            <motion.span
              key={i}
              className='text-lg font-medium text-muted-foreground'
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            >
              {char}
            </motion.span>
          ))}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={`dot-${i}`}
              className='text-lg font-medium text-muted-foreground'
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              .
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Background Effects */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <motion.div 
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl'
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
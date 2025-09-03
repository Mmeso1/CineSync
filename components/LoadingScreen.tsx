'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Loading' }: LoadingScreenProps) {
  const [popcornCount, setPopcornCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPopcornCount(prev => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const popcornKernels = ['🌽', '🍿', '🍿', '🍿'];

  return (
    <div className="fixed inset-0 bg-[#0B0C10] flex items-center justify-center z-50">
      <div className="text-center">
        {/* Popcorn Popping Animation */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-8xl mb-6"
        >
          {popcornKernels[popcornCount]}
        </motion.div>
        
        <motion.h2
          animate={{ 
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="heading-font text-3xl font-bold bg-gradient-to-r from-[#00FFF0] via-[#FF6E6C] to-[#FFD16D] bg-clip-text text-transparent mb-4"
        >
          CineSync
        </motion.h2>
        
        <motion.p
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="body-font text-white/80"
        >
          {message}<span className="loading-dots"></span>
        </motion.p>

        {/* Floating Popcorn */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              animate={{
                y: [100, -100],
                x: [0, Math.random() * 100 - 50],
                rotate: [0, 360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeOut",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: '100%',
              }}
            >
              🍿
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, ArrowRight, Film } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function JoinRoom() {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const router = useRouter();

  useState(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  });

  const joinRoom = async () => {
    if (!roomId || !username) return;
    
    setIsJoining(true);
    
    // Simulate joining room with popcorn animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    router.push(`/room/${roomId}?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="heading-font text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00FFF0] to-[#FF6E6C] bg-clip-text text-transparent"
          >
            Join Cinema
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="body-font text-xl opacity-80"
          >
            Enter the cinema details to join your friends
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`rounded-3xl p-8 ${
            isDark ? 'glass-dark' : 'glass-light'
          }`}
        >
          {/* Floating Popcorn Animation */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-4xl text-center mb-6"
          >
            🎬
          </motion.div>

          <div className="mb-6">
            <label className="block text-sm font-medium opacity-80 mb-3">Your Name</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your display name"
              className={`w-full px-4 py-3 rounded-xl border-2 border-transparent transition-all duration-300 input-focus body-font ${
                isDark ? 'bg-[#1A1D23] focus:border-[#00FFF0]' : 'bg-white focus:border-[#FF6E6C]'
              }`}
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium opacity-80 mb-3">Cinema ID</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="Enter cinema ID"
              className={`w-full px-4 py-3 rounded-xl border-2 border-transparent transition-all duration-300 input-focus font-mono text-lg ${
                isDark ? 'bg-[#1A1D23] focus:border-[#00FFF0]' : 'bg-white focus:border-[#FF6E6C]'
              }`}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={joinRoom}
            disabled={!roomId || !username || isJoining}
            className={`w-full px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 btn-press ${
              isDark ? 'neuro-dark glow-cyan disabled:opacity-50' : 'neuro-light glow-coral disabled:opacity-50'
            } disabled:cursor-not-allowed popcorn-cursor`}
          >
            {isJoining ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Entering Cinema<span className="loading-dots"></span>
              </>
            ) : (
              <>
                <Film className="w-5 h-5" />
                Enter Cinema
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
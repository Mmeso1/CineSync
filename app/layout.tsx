"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    if (saved) {
      setIsDark(saved === "dark");
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", isDark ? "dark" : "light");
      document.documentElement.className = isDark ? "dark" : "light";
    }
  }, [isDark, mounted]);

  if (!mounted) {
    return (
      <html lang="en">
        <head>
          <title>CineSync - Watch Movies Together</title>
          <meta
            name="description"
            content="Synchronized movie watching with friends. Watch YouTube videos or upload your own files with voice chat."
          />
        </head>
        <body className="dark">
          <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#00FFF0]/30 border-t-[#00FFF0] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white">Loading CineSync...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={isDark ? "dark" : "light"}>
      <head>
        <title>CineSync - Watch Movies Together</title>
        <meta
          name="description"
          content="Synchronized movie watching with friends. Watch YouTube videos or upload your own files with voice chat."
        />
      </head>
      <body
        className={`${
          isDark
            ? "dark bg-[#0B0C10] text-white"
            : "light bg-[#F7F7F8] text-[#1A1D23]"
        } transition-all duration-300`}
      >
        {/* Theme Toggle */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          onClick={() => setIsDark(!isDark)}
          className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 btn-hover ${
            isDark
              ? "glass-dark hover:glow-cyan"
              : "glass-light hover:glow-coral"
          }`}
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Sun className="w-5 h-5 text-[#FFD16D]" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Moon className="w-5 h-5 text-[#00FFF0]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative z-10"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </body>
    </html>
  );
}

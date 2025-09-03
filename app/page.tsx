"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Share2, Film, PlayCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [isDark, setIsDark] = useState(true);

  const lines = useMemo(
    () => ["Apart by miles...", "Connected by CineSync."],
    []
  );

  // Memoized floating particles so they don't re-render with hero text
  const FloatingParticles = memo(function FloatingParticles() {
    // Generate stable random positions and emojis once
    const particles = useMemo(() => {
      const emojis = ["🍿", "🎬", "🎭", "🎪"];
      return Array.from({ length: 8 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = 10 + Math.random() * 5;
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        return { left, delay, duration, emoji, key: i };
      });
    }, []);
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p) => (
          <div
            key={p.key}
            className="absolute floating-particle text-2xl opacity-20"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>
    );
  });

  // Add throttled scroll handling
  const { scrollY } = useScroll();
  const filmStripY = useTransform(scrollY, [0, 1000], [0, -100]);
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -50]);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (currentLine >= lines.length) return;

    const currentText = lines[currentLine];
    let index = 0;

    const typeText = () => {
      if (index <= currentText.length) {
        setTypedText(currentText.slice(0, index));
        index++;
        setTimeout(typeText, 80);
      } else {
        // If last line, pause longer before stopping
        setTimeout(
          () => {
            if (currentLine < lines.length - 1) {
              setCurrentLine(currentLine + 1);
              setTypedText("");
            }
          },
          currentLine === lines.length - 1 ? 2000 : 1000
        );
      }
    };

    const timeoutId = setTimeout(typeText, 100);
    return () => clearTimeout(timeoutId);
  }, [currentLine, lines]);

  const features = [
    {
      icon: Film,
      title: "Create Room",
      description: "Start your cinema experience",
      color: "from-[#00FFF0] to-[#FF6E6C]",
      delay: 0.2,
    },
    {
      icon: Share2,
      title: "Share Code",
      description: "Invite friends instantly",
      color: "from-[#FF6E6C] to-[#FFD16D]",
      delay: 0.4,
    },
    {
      icon: PlayCircle,
      title: "Watch Together",
      description: "Synchronized movie magic",
      color: "from-[#FFD16D] to-[#00FFF0]",
      delay: 0.6,
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Parallax Film Strip */}
      <motion.div
        style={{ y: filmStripY }}
        className="fixed top-20 left-0 w-full film-strip z-0"
      />
      <motion.div
        style={{ y: filmStripY }}
        className="fixed top-40 left-0 w-full film-strip z-0"
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <FloatingParticles />
        <motion.div
          style={{ y: parallaxY }}
          className="relative z-10 text-center max-w-2xl mx-auto"
        >
          {/* Floating Particles Background (memoized, stable) */}

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12"
          >
            <h1 className="heading-font text-8xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-[#00FFF0] via-[#FF6E6C] to-[#FFD16D] bg-clip-text text-transparent">
              CineSync
            </h1>
          </motion.div>

          {/* Typing Animation */}
          <div className="h-32 flex flex-col items-center justify-center mb-12">
            <motion.p
              key={currentLine}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl body-font font-light typing-cursor"
            >
              {typedText}
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link href="/create-room">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`group px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 btn-hover transition-all duration-300 ${
                  isDark ? "neuro-dark glow-cyan" : "neuro-light glow-coral"
                }`}
              >
                <Play className="w-6 h-6" />
                Start Watching
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </Link>

            <Link href="/join-room">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-full font-semibold text-lg btn-hover transition-all duration-300 ${
                  isDark
                    ? "glass-dark hover:glow-yellow"
                    : "glass-light hover:glow-cyan"
                }`}
              >
                Join Room
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-font text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00FFF0] to-[#FF6E6C] bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="body-font text-xl opacity-80 max-w-2xl mx-auto">
              Three simple steps to your perfect movie night
            </p>
          </motion.div>

          {/* Glassmorphic Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                className={`group p-8 rounded-3xl transition-all duration-500 cursor-pointer ${
                  isDark
                    ? "glass-dark hover:glow-cyan"
                    : "glass-light hover:glow-coral"
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 mx-auto float`}
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <feature.icon className="w-10 h-10 text-white" />
                </motion.div>

                <h3 className="heading-font text-2xl font-bold mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="body-font opacity-80 text-center leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${
                      feature.color.split(" ")[1]
                    }, ${feature.color.split(" ")[3]})`,
                    filter: "blur(20px)",
                    zIndex: -1,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`p-12 rounded-3xl text-center ${
              isDark ? "neuro-dark" : "neuro-light"
            }`}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🍿
            </motion.div>

            <h2 className="heading-font text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#FFD16D] via-[#FF6E6C] to-[#00FFF0] bg-clip-text text-transparent">
              Ready for Movie Magic?
            </h2>

            <p className="body-font text-xl opacity-80 mb-8 max-w-2xl mx-auto">
              Create your first room and invite up to 4 friends for the ultimate
              synchronized cinema experience
            </p>

            <Link href="/create-room">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-12 py-4 rounded-full font-semibold text-xl btn-hover transition-all duration-300 ${
                  isDark
                    ? "neuro-inset-dark glow-cyan"
                    : "neuro-inset-light glow-coral"
                } popcorn-cursor`}
              >
                Create Your Cinema
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

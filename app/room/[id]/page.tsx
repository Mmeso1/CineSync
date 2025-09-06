"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Users,
  Copy,
  UserX,
  Crown,
  Phone,
  PhoneOff,
  Heart,
  Popcorn,
  Film,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import YouTube from "react-youtube";
import { io } from "socket.io-client";

interface User {
  id: string;
  name: string;
  isHost: boolean;
  isMuted: boolean;
  isConnected: boolean;
  isSpeaking: boolean;
}

interface Reaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

const socket = io("https://cinesync-backend.onrender.com");

export default function Room() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.id as string;
  const username = searchParams.get("username") || "Anonymous";
  const mode = searchParams.get("mode") as "youtube" | "upload";
  const youtubeId = searchParams.get("youtube");
  const fileUrl = searchParams.get("file");
  const cinemaName = searchParams.get("name") || "Untitled Cinema";

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isHost] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: username,
      isHost: true,
      isMuted: false,
      isConnected: true,
      isSpeaking: false,
    },
    {
      id: "2",
      name: "Alice",
      isHost: false,
      isMuted: false,
      isConnected: true,
      isSpeaking: true,
    },
    {
      id: "3",
      name: "Bob",
      isHost: false,
      isMuted: true,
      isConnected: true,
      isSpeaking: false,
    },
  ]);
  const [micEnabled, setMicEnabled] = useState(true);
  const [voiceChatConnected, setVoiceChatConnected] = useState(false);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubeRef = useRef<any>(null);

  useState(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  });

  // Mock room data
  const roomData = {
    name: cinemaName,
    mode,
    youtubeId,
    videoUrl: fileUrl,
  };

  useEffect(() => {
    // Cinema curtain opening animation
    const timer = setTimeout(() => {
      setCurtainOpen(true);
    }, 1000);

    // Voice chat connection simulation
    const voiceTimer = setTimeout(() => {
      setVoiceChatConnected(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(voiceTimer);
    };
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to backend:", socket.id);
      socket.emit("join-room", roomId);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection failed:", err.message);
    });

    socket.emit("join-room", roomId);
    socket.on("video-event", ({ action, time }) => {
      if (action === "play") {
        if (roomData.mode === "youtube" && youtubeRef.current) {
          youtubeRef.current.playVideo();
        } else if (videoRef.current) {
          videoRef.current.play();
        }
        setIsPlaying(true);
      }

      if (action === "pause") {
        if (roomData.mode === "youtube" && youtubeRef.current) {
          youtubeRef.current.pauseVideo();
        } else if (videoRef.current) {
          videoRef.current.pause();
        }
        setIsPlaying(false);
      }

      if (action === "seek") {
        if (roomData.mode === "youtube" && youtubeRef.current) {
          youtubeRef.current.seekTo(time);
        } else if (videoRef.current) {
          videoRef.current.currentTime = time;
        }
        setCurrentTime(time);
      }
    });

    return () => {
      socket.off("video-event");
      socket.off("connect_error");
    };
  }, [roomId, roomData.mode]);

  const handlePlayPause = () => {
    if (isPlaying) {
      socket.emit("video-event", { roomId, action: "pause" });
    } else {
      socket.emit("video-event", { roomId, action: "play" });
    }
  };

  const handleSeek = (time: number) => {
    socket.emit("video-event", { roomId, action: "seek", time });
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (roomData.mode === "youtube" && youtubeRef.current) {
      youtubeRef.current.setVolume(newVolume * 100);
    } else if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (roomData.mode === "youtube" && youtubeRef.current) {
      if (isMuted) {
        youtubeRef.current.unMute();
      } else {
        youtubeRef.current.mute();
      }
    } else if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const toggleMic = () => {
    setMicEnabled(!micEnabled);
  };

  const toggleVoiceChat = () => {
    setVoiceChatConnected(!voiceChatConnected);
  };

  const addReaction = (emoji: string) => {
    const newReaction: Reaction = {
      id: Date.now().toString(),
      emoji,
      x: Math.random() * 80 + 10, // 10% to 90% of screen width
      y: Math.random() * 20 + 70, // 70% to 90% of screen height
    };

    setReactions((prev) => [...prev, newReaction]);

    // Remove reaction after animation
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2000);
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const onYouTubeReady = (event: any) => {
    youtubeRef.current = event.target;
    setDuration(event.target.getDuration());
  };

  const onYouTubeStateChange = (event: any) => {
    setIsPlaying(event.data === 1);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isDark ? "bg-[#0B0C10] text-white" : "bg-[#F7F7F8] text-[#1A1D23]"
      }`}
    >
      {/* Floating Reactions */}
      <AnimatePresence>
        {reactions.map((reaction) => (
          <motion.div
            key={reaction.id}
            initial={{ opacity: 1, scale: 1, y: 0 }}
            animate={{ opacity: 0, scale: 1.5, y: -100 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="fixed text-4xl pointer-events-none z-50 emoji-float"
            style={{ left: `${reaction.x}%`, top: `${reaction.y}%` }}
          >
            {reaction.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border-b transition-all duration-300 px-4 py-4 ${
          isDark ? "border-white/10 glass-dark" : "border-black/10 glass-light"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="heading-font text-2xl font-bold bg-gradient-to-r from-[#00FFF0] to-[#FF6E6C] bg-clip-text text-transparent">
              {roomData.name}
            </h1>
            <p className="body-font opacity-60">Cinema ID: {roomId}</p>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyRoomLink}
              className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 btn-hover ${
                isDark
                  ? "glass-dark hover:glow-cyan"
                  : "glass-light hover:glow-coral"
              }`}
            >
              <Copy className="w-4 h-4" />
              Share
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUserPanel(!showUserPanel)}
              className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 btn-hover ${
                isDark
                  ? "glass-dark hover:glow-yellow"
                  : "glass-light hover:glow-coral"
              }`}
            >
              <Users className="w-4 h-4" />
              {users.length}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden">
            {/* Cinema Curtains */}
            <AnimatePresence>
              {!curtainOpen && (
                <>
                  <motion.div
                    initial={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-red-900 to-red-800 z-20 flex items-center justify-end pr-4"
                  >
                    <div className="text-6xl">🎭</div>
                  </motion.div>
                  <motion.div
                    initial={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-900 to-red-800 z-20 flex items-center justify-start pl-4"
                  >
                    <div className="text-6xl">🎭</div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Film Reel Border */}
            <div className="absolute inset-4 film-reel-border rounded-lg z-10 pointer-events-none" />

            {/* Video Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: curtainOpen ? 1 : 0,
                scale: curtainOpen ? 1 : 0.8,
              }}
              transition={{ duration: 1, delay: curtainOpen ? 1 : 0 }}
              className="w-full h-full"
            >
              {roomData.mode === "youtube" ? (
                <YouTube
                  videoId={roomData.youtubeId || undefined}
                  onReady={onYouTubeReady}
                  onStateChange={onYouTubeStateChange}
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: {
                      autoplay: 0,
                      controls: 0,
                      disablekb: 1,
                      fs: 0,
                      modestbranding: 1,
                      rel: 0,
                    },
                  }}
                  className="w-full h-full"
                />
              ) : (
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  onTimeUpdate={(e) =>
                    setCurrentTime(e.currentTarget.currentTime)
                  }
                  onLoadedMetadata={(e) =>
                    setDuration(e.currentTarget.duration)
                  }
                >
                  <source src={roomData.videoUrl || ""} type="video/mp4" />
                </video>
              )}
            </motion.div>

            {/* Loading overlay */}
            {!voiceChatConnected && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: voiceChatConnected ? 0 : 1 }}
                className="absolute inset-0 bg-black/80 flex items-center justify-center z-30"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-16 h-16 border-4 border-[#00FFF0]/30 border-t-[#00FFF0] rounded-full mx-auto mb-4"
                  />
                  <p className="text-lg">
                    Connecting to voice chat
                    <span className="loading-dots"></span>
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className={`p-4 ${
              isDark
                ? "bg-[#1A1D23] border-t border-white/10"
                : "bg-white border-t border-black/10"
            }`}
          >
            <div className="max-w-4xl mx-auto">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm opacity-60">
                    {formatTime(currentTime)}
                  </span>
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={(e) => handleSeek(Number(e.target.value))}
                      className={`w-full h-3 rounded-lg appearance-none cursor-pointer progress-filmstrip ${
                        isDark ? "bg-white/10" : "bg-black/10"
                      } ${!isHost ? "pointer-events-none" : "popcorn-cursor"}`}
                      disabled={!isHost}
                    />
                  </div>
                  <span className="text-sm opacity-60">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {isHost && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePlayPause}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 btn-hover ${
                        isDark
                          ? "neuro-dark glow-cyan"
                          : "neuro-light glow-coral"
                      }`}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-1" />
                      )}
                    </motion.button>
                  )}

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleMute}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 btn-hover ${
                        isDark ? "hover:bg-white/10" : "hover:bg-black/10"
                      }`}
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </motion.button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) =>
                        handleVolumeChange(Number(e.target.value))
                      }
                      className={`w-20 h-2 rounded-lg appearance-none cursor-pointer ${
                        isDark ? "bg-white/10" : "bg-black/10"
                      }`}
                    />
                  </div>
                </div>

                {/* Reaction Buttons */}
                <div className="flex items-center gap-2">
                  {["🎬", "🍿", "❤️"].map((emoji) => (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => addReaction(emoji)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 text-xl btn-hover ${
                        isDark
                          ? "glass-dark hover:glow-yellow"
                          : "glass-light hover:glow-coral"
                      }`}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>

                {/* Voice Chat Controls */}
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      isDark ? "glass-dark" : "glass-light"
                    }`}
                  >
                    <motion.div
                      animate={{ scale: voiceChatConnected ? [1, 1.2, 1] : 1 }}
                      transition={{
                        duration: 1,
                        repeat: voiceChatConnected ? Infinity : 0,
                      }}
                      className={`w-2 h-2 rounded-full ${
                        voiceChatConnected ? "bg-[#00FFF0]" : "bg-[#FF6E6C]"
                      }`}
                    />
                    <span className="text-sm">
                      {voiceChatConnected ? "Connected" : "Connecting..."}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMic}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 btn-hover ${
                      micEnabled
                        ? isDark
                          ? "neuro-dark glow-cyan"
                          : "neuro-light glow-coral"
                        : isDark
                        ? "neuro-dark glow-coral"
                        : "neuro-light glow-coral"
                    }`}
                  >
                    {micEnabled ? (
                      <Mic className="w-5 h-5" />
                    ) : (
                      <MicOff className="w-5 h-5" />
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleVoiceChat}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 btn-hover ${
                      voiceChatConnected
                        ? isDark
                          ? "neuro-dark glow-coral"
                          : "neuro-light glow-coral"
                        : isDark
                        ? "neuro-dark glow-cyan"
                        : "neuro-light glow-coral"
                    }`}
                  >
                    {voiceChatConnected ? (
                      <PhoneOff className="w-5 h-5" />
                    ) : (
                      <Phone className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* User Panel */}
        <AnimatePresence>
          {showUserPanel && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`w-80 border-l p-4 ${
                isDark
                  ? "bg-[#1A1D23] border-white/10"
                  : "bg-white border-black/10"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="heading-font text-lg font-semibold">
                  Cinema Guests ({users.length}/5)
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowUserPanel(false)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 btn-hover ${
                    isDark ? "hover:bg-white/10" : "hover:bg-black/10"
                  }`}
                >
                  ×
                </motion.button>
              </div>

              {/* User Avatars in Semicircle */}
              <div className="mb-6">
                <div className="relative h-32 flex items-end justify-center">
                  {users.map((user, index) => {
                    const angle = (index - (users.length - 1) / 2) * 30; // Spread users in semicircle
                    const radius = 60;
                    const x = Math.sin((angle * Math.PI) / 180) * radius;
                    const y = (-Math.cos((angle * Math.PI) / 180) * radius) / 2;

                    return (
                      <motion.div
                        key={user.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="absolute"
                        style={{
                          transform: `translate(${x}px, ${y}px)`,
                        }}
                      >
                        <div className="relative">
                          <motion.div
                            animate={
                              user.isSpeaking ? { scale: [1, 1.2, 1] } : {}
                            }
                            transition={{
                              duration: 0.5,
                              repeat: user.isSpeaking ? Infinity : 0,
                            }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                              isDark ? "neuro-dark" : "neuro-light"
                            } ${user.isSpeaking ? "pulse-ring" : ""}`}
                          >
                            {user.name[0].toUpperCase()}
                          </motion.div>
                          {user.isHost && (
                            <Crown className="w-4 h-4 text-[#FFD16D] absolute -top-1 -right-1" />
                          )}
                          {user.isSpeaking && (
                            <motion.div
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.7, 0, 0.7],
                              }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="absolute inset-0 rounded-full border-2 border-[#00FFF0]"
                            />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* User List */}
              <div className="space-y-3">
                {users.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      isDark ? "glass-dark" : "glass-light"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={user.isConnected ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-3 h-3 rounded-full ${
                          user.isConnected ? "bg-[#00FFF0]" : "bg-gray-500"
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.name}</span>
                          {user.isHost && (
                            <Crown className="w-4 h-4 text-[#FFD16D]" />
                          )}
                        </div>
                        <span className="text-xs opacity-60">
                          {user.isMuted
                            ? "Muted"
                            : user.isSpeaking
                            ? "Speaking"
                            : "Listening"}
                        </span>
                      </div>
                    </div>

                    {isHost && !user.isHost && (
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 btn-hover ${
                            isDark ? "hover:bg-white/10" : "hover:bg-black/10"
                          }`}
                          title={user.isMuted ? "Unmute" : "Mute"}
                        >
                          {user.isMuted ? (
                            <MicOff className="w-4 h-4" />
                          ) : (
                            <Mic className="w-4 h-4" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 hover:bg-[#FF6E6C]/20 rounded-full flex items-center justify-center transition-all duration-300 btn-hover"
                          title="Remove user"
                        >
                          <UserX className="w-4 h-4 text-[#FF6E6C]" />
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {users.length < 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`mt-6 p-4 border-2 border-dashed rounded-xl text-center ${
                    isDark
                      ? "border-white/20 glass-dark"
                      : "border-black/20 glass-light"
                  }`}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl mb-2"
                  >
                    🎭
                  </motion.div>
                  <p className="text-sm opacity-80 mb-3">
                    Invite more friends to the cinema
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyRoomLink}
                    className={`px-4 py-2 rounded-xl text-sm transition-all duration-300 btn-hover ${
                      isDark ? "neuro-dark glow-cyan" : "neuro-light glow-coral"
                    }`}
                  >
                    Copy Invite Link
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Youtube, Upload, ArrowLeft, Copy, Check, Film } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function CreateRoom() {
  const [mode, setMode] = useState<"youtube" | "upload" | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [roomName, setRoomName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (
      file &&
      (file.type.includes("video/mp4") || file.type.includes("video/webm"))
    ) {
      setUploadedFile(file);
    }
  };

  const extractYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const isFormValid = () => {
    if (!roomName.trim()) return false;
    if (!mode) return false;
    if (
      mode === "youtube" &&
      (!youtubeUrl.trim() || !extractYouTubeId(youtubeUrl))
    )
      return false;
    if (mode === "upload" && !uploadedFile) return false;
    return true;
  };

  const createRoom = async () => {
    if (!isFormValid() || isCreating) return;

    setIsCreating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const newRoomId = uuidv4().substring(0, 8).toUpperCase();
      setRoomId(newRoomId);
    } catch (error) {
      console.error("Failed to create room:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const copyRoomLink = () => {
    const roomLink = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(roomLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinRoom = () => {
    if (mode === "youtube") {
      const videoId = extractYouTubeId(youtubeUrl);
      if (videoId) {
        router.push(
          `/room/${roomId}?mode=youtube&youtube=${videoId}&name=${encodeURIComponent(
            roomName
          )}`
        );
      }
    } else if (mode === "upload" && uploadedFile) {
      const fileUrl = URL.createObjectURL(uploadedFile);
      router.push(
        `/room/${roomId}?mode=upload&file=${encodeURIComponent(
          fileUrl
        )}&name=${encodeURIComponent(roomName)}`
      );
    }
  };

  // SUCCESS PAGE - Simplified animations
  if (roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`max-w-md w-full rounded-3xl p-8 text-center ${
            isDark ? "neuro-dark" : "neuro-light"
          }`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-gradient-to-r from-[#00FFF0] to-[#FF6E6C] rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="heading-font text-3xl font-bold mb-4 bg-gradient-to-r from-[#00FFF0] to-[#FF6E6C] bg-clip-text text-transparent">
            Cinema Ready! 🎬
          </h2>

          <p className="body-font opacity-80 mb-6">
            Your room &quot;{roomName}&quot; is ready for the show!
          </p>

          <div
            className={`rounded-2xl p-4 mb-6 ${
              isDark ? "neuro-inset-dark" : "neuro-inset-light"
            }`}
          >
            <p className="text-sm opacity-60 mb-2">Room ID</p>
            <p className="font-mono text-lg text-[#00FFF0] font-bold">
              {roomId}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyRoomLink}
              className={`flex-1 px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                isDark
                  ? "glass-dark hover:bg-white/10"
                  : "glass-light hover:bg-black/5"
              }`}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy Link"}
            </button>

            <button
              onClick={joinRoom}
              className={`flex-1 px-4 py-3 rounded-xl transition-all duration-200 ${
                isDark
                  ? "bg-[#00FFF0] text-black hover:bg-[#00FFF0]/90"
                  : "bg-[#FF6E6C] text-white hover:bg-[#FF6E6C]/90"
              }`}
            >
              Enter Cinema
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // MAIN PAGE - Much simpler animations
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header - Simple fade in */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="heading-font text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#00FFF0] via-[#FF6E6C] to-[#FFD16D] bg-clip-text text-transparent">
            Create Cinema
          </h1>
          <p className="body-font text-xl opacity-80">
            Set up your movie experience
          </p>
        </motion.div>

        {/* Main Form - Single animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`rounded-3xl p-8 ${isDark ? "glass-dark" : "glass-light"}`}
        >
          {/* Room Name */}
          <div className="mb-8">
            <label className="block text-sm font-medium opacity-80 mb-3">
              Cinema Name
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter your cinema name"
              className={`w-full px-4 py-3 rounded-xl border-2 border-transparent transition-all duration-200 body-font focus:outline-none ${
                isDark
                  ? "bg-[#1A1D23] focus:border-[#00FFF0]"
                  : "bg-white focus:border-[#FF6E6C]"
              }`}
            />
          </div>

          {/* Mode Selection - Simpler hover effects */}
          <div className="mb-8">
            <label className="block text-sm font-medium opacity-80 mb-4">
              Choose Your Experience
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setMode("youtube")}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                  mode === "youtube"
                    ? isDark
                      ? "border-[#00FFF0] bg-[#00FFF0]/10"
                      : "border-[#FF6E6C] bg-[#FF6E6C]/10"
                    : isDark
                    ? "border-white/10 hover:border-[#00FFF0]/50"
                    : "border-black/10 hover:border-[#FF6E6C]/50"
                }`}
              >
                <Youtube className="w-8 h-8 text-[#FF6E6C] mb-3 mx-auto" />
                <h3 className="heading-font font-semibold mb-2">
                  YouTube Mode
                </h3>
                <p className="text-sm opacity-80">
                  Stream YouTube videos together
                </p>
              </button>

              <button
                onClick={() => setMode("upload")}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                  mode === "upload"
                    ? isDark
                      ? "border-[#00FFF0] bg-[#00FFF0]/10"
                      : "border-[#FF6E6C] bg-[#FF6E6C]/10"
                    : isDark
                    ? "border-white/10 hover:border-[#00FFF0]/50"
                    : "border-black/10 hover:border-[#FF6E6C]/50"
                }`}
              >
                <Upload className="w-8 h-8 text-[#00FFF0] mb-3 mx-auto" />
                <h3 className="heading-font font-semibold mb-2">Upload Mode</h3>
                <p className="text-sm opacity-80">Share your own video files</p>
              </button>
            </div>
          </div>

          {/* Conditional Inputs - Simple show/hide */}
          {mode === "youtube" && (
            <div className="mb-8">
              <label className="block text-sm font-medium opacity-80 mb-3">
                YouTube URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`w-full px-4 py-3 rounded-xl border-2 border-transparent transition-all duration-200 body-font focus:outline-none ${
                  isDark
                    ? "bg-[#1A1D23] focus:border-[#00FFF0]"
                    : "bg-white focus:border-[#FF6E6C]"
                }`}
              />
              {youtubeUrl && extractYouTubeId(youtubeUrl) && (
                <p className="text-sm text-[#00FFF0] mt-2 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Valid YouTube URL detected
                </p>
              )}
            </div>
          )}

          {mode === "upload" && (
            <div className="mb-8">
              <label className="block text-sm font-medium opacity-80 mb-3">
                Upload Video File
              </label>
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                  isDark
                    ? "border-white/20 hover:border-[#00FFF0]/50"
                    : "border-black/20 hover:border-[#FF6E6C]/50"
                }`}
              >
                <div className="text-4xl mb-4">🍿</div>
                <p className="opacity-80 mb-4">Choose your video file</p>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={`inline-block px-6 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    isDark
                      ? "bg-[#1A1D23] hover:bg-[#00FFF0]/10"
                      : "bg-white hover:bg-[#FF6E6C]/10"
                  }`}
                >
                  Choose File
                </label>
                {uploadedFile && (
                  <p className="text-sm text-[#00FFF0] mt-4 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    {uploadedFile.name} selected
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Create Button - Simple loading state */}
          <button
            onClick={createRoom}
            disabled={!isFormValid() || isCreating}
            className={`w-full px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
              !isFormValid() || isCreating
                ? "opacity-50 cursor-not-allowed bg-gray-600"
                : isDark
                ? "bg-[#00FFF0] text-black hover:bg-[#00FFF0]/90"
                : "bg-[#FF6E6C] text-white hover:bg-[#FF6E6C]/90"
            }`}
          >
            {isCreating ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Creating Cinema...
              </>
            ) : (
              <>
                <Film className="w-5 h-5" />
                Create Cinema
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

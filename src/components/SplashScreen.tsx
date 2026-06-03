"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const lines = [
    "npx load-portfolio --interactive --games",
    "✓ Initializing routes: /work, /toolkit, /process, /contact...",
    "✓ Bundling page layouts & 16 responsive case studies...",
    "✓ Instantiating retro 8-bit arcade canvas container...",
    "✓ Preloading classic games: Snake, Memory Match, Tetris...",
    "Entering creative workspace..."
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsTyping(false);
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }

    const line = lines[currentLineIndex];

    if (line.startsWith("npx") || line.startsWith("Entering")) {
      let charIdx = 0;
      setCurrentText("");
      const interval = setInterval(() => {
        if (charIdx < line.length) {
          setCurrentText((prev) => prev + line.charAt(charIdx));
          charIdx++;
        } else {
          clearInterval(interval);
          setTerminalLines((prev) => [...prev, line]);
          setCurrentText("");
          setCurrentLineIndex((prev) => prev + 1);
        }
      }, 30);
      return () => clearInterval(interval);
    } else {
      const timer = setTimeout(() => {
        setTerminalLines((prev) => [...prev, line]);
        setCurrentLineIndex((prev) => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 bg-[#060608] z-[9999] flex flex-col items-center justify-center font-mono select-none overflow-hidden p-6"
    >
      {/* Animated dots grid background */}
      <div className="absolute inset-0 canvas-dots opacity-20 pointer-events-none" />
      {/* Radial aura glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-violet-500/5 to-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Terminal Window Box */}
      <div className="w-full max-w-xl bg-[#0d0d11]/85 border border-white/[0.07] rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] overflow-hidden glass-strong relative z-10 flex flex-col">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-white/[0.01]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]/30 border border-[#ff5f56]/50" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/30 border border-[#ffbd2e]/50" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]/30 border border-[#27c93f]/50" />
          </div>
          <span className="text-[10px] text-white/30 uppercase tracking-[0.25em]">terminal · bash</span>
        </div>

        {/* Terminal Content */}
        <div className="p-6 sm:p-8 space-y-3.5 text-left text-xs sm:text-[13px] leading-relaxed min-h-[220px]">
          {terminalLines.map((line, idx) => {
            const isCommand = line.startsWith("npx");
            const isEnter = line.startsWith("Entering");
            const isHighlight = line.includes("games:") || line.includes("arcade");

            let color = "text-white/60";
            if (isCommand) color = "text-emerald-400 font-semibold";
            else if (isEnter) color = "text-violet-400 font-semibold";
            else if (isHighlight) color = "text-[#8cff2e]";

            return (
              <div key={idx} className={color}>
                {isCommand && <span className="text-white/30 mr-2.5">$</span>}
                {line}
              </div>
            );
          })}

          {/* Typing Line */}
          {isTyping && currentLineIndex < lines.length && (
            <div className={lines[currentLineIndex].startsWith("npx") ? "text-emerald-400 font-semibold" : "text-white/60"}>
              {lines[currentLineIndex].startsWith("npx") && <span className="text-white/30 mr-2.5">$</span>}
              {currentText}
              <span className="inline-block w-1.5 h-3.5 bg-emerald-400 ml-1 -mb-0.5 animate-cursor-blink" />
            </div>
          )}
        </div>
      </div>

      {/* Progress / Skip Indicator */}
      <div className="absolute bottom-10 flex items-center justify-between w-full max-w-xl px-4 text-[10px] text-white/20 uppercase tracking-[0.2em] relative z-10">
        <span>Initializing...</span>
        <button
          onClick={onComplete}
          className="hover:text-white transition-colors duration-200 cursor-pointer"
        >
          Skip Introduction [esc]
        </button>
      </div>
    </motion.div>
  );
}

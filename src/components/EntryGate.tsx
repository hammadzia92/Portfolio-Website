"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileCode2, Presentation } from "lucide-react";

interface EntryGateProps {
  onSelectMode: (mode: "designFile" | "portfolio") => void;
}

export default function EntryGate({ onSelectMode }: EntryGateProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const dotVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.3,
      transition: { duration: 2, ease: "easeOut" as const },
    },
  };

  return (
    <section className="h-screen w-full bg-background flex flex-col justify-center items-center px-6 text-center select-none relative overflow-hidden">
      {/* Animated dot grid background */}
      <motion.div
        variants={dotVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 canvas-dots pointer-events-none"
      />

      {/* Faint crosshair center lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border-subtle" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-border-subtle" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full space-y-16 relative z-10"
      >
        {/* Title */}
        <motion.div variants={itemVariants} className="space-y-4">
          <span className="font-mono text-xs text-text-tertiary uppercase tracking-[0.2em] block">
            hammad_zia_portfolio.design
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-[4.5rem] font-bold tracking-tight text-foreground leading-[1.1]">
            Choose your
            <br />
            viewing mode.
          </h1>
        </motion.div>

        {/* Two Mode Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto"
        >
          {/* Option 01: Design File */}
          <button
            onClick={() => onSelectMode("designFile")}
            onMouseEnter={() => setHoveredOption("designFile")}
            onMouseLeave={() => setHoveredOption(null)}
            className="relative group cursor-pointer rounded-xl p-8 text-left transition-all duration-500 overflow-hidden border border-border-custom bg-artboard-bg/50 hover:border-accent hover:bg-artboard-bg"
          >
            {/* Glow background on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />

            {/* Corner selection indicators */}
            <div className="absolute top-0 left-0 w-4 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            <div className="absolute top-0 left-0 h-4 w-px bg-accent scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
            <div className="absolute bottom-0 right-0 w-4 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-500" />
            <div className="absolute bottom-0 right-0 h-4 w-px bg-accent scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-500" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-widest">
                  Option 01
                </span>
                <FileCode2 className="h-5 w-5 text-text-tertiary group-hover:text-accent transition-colors duration-500" />
              </div>

              <h3 className="font-heading text-xl sm:text-2xl font-semibold text-foreground group-hover:text-accent transition-colors duration-500">
                Open as Design File
              </h3>

              <p className="font-mono text-xs text-text-secondary leading-relaxed">
                View the raw workspace. Pan, zoom, explore artboards like a design tool.
              </p>
            </div>
          </button>

          {/* Option 02: Portfolio */}
          <button
            onClick={() => onSelectMode("portfolio")}
            onMouseEnter={() => setHoveredOption("portfolio")}
            onMouseLeave={() => setHoveredOption(null)}
            className="relative group cursor-pointer rounded-xl p-8 text-left transition-all duration-500 overflow-hidden border border-border-custom bg-artboard-bg/50 hover:border-accent hover:bg-artboard-bg"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />

            <div className="absolute top-0 left-0 w-4 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            <div className="absolute top-0 left-0 h-4 w-px bg-accent scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
            <div className="absolute bottom-0 right-0 w-4 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-500" />
            <div className="absolute bottom-0 right-0 h-4 w-px bg-accent scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-500" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-widest">
                  Option 02
                </span>
                <Presentation className="h-5 w-5 text-text-tertiary group-hover:text-accent transition-colors duration-500" />
              </div>

              <h3 className="font-heading text-xl sm:text-2xl font-semibold text-foreground group-hover:text-accent transition-colors duration-500">
                Open as Portfolio
              </h3>

              <p className="font-mono text-xs text-text-secondary leading-relaxed">
                View the finished presentation. Scroll, read, explore sections linearly.
              </p>
            </div>
          </button>
        </motion.div>

        {/* Bottom metadata line */}
        <motion.div
          variants={itemVariants}
          className="font-mono text-xs text-text-tertiary tracking-widest uppercase"
        >
          <span>FILE: hammad_zia_portfolio.design</span>
          <span className="mx-3 text-border-custom">·</span>
          <span>LAST MODIFIED: 2026</span>
          <span className="mx-3 text-border-custom">·</span>
          <span className="text-accent/60">STATUS: ACTIVE</span>
          <span className="inline-block w-1.5 h-3.5 bg-accent/60 ml-1 -mb-0.5 animate-cursor-blink" />
        </motion.div>
      </motion.div>
    </section>
  );
}

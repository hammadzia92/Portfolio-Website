"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EntryGate from "@/components/EntryGate";
import DesignFileMode from "@/components/DesignFileMode";
import PortfolioMode from "@/components/PortfolioMode";

type AppMode = "entry" | "designFile" | "portfolio";

export default function Home() {
  const [mode, setMode] = useState<AppMode>("entry");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const m = params.get("mode") as AppMode;
      if (m && ["entry", "designFile", "portfolio"].includes(m)) {
        setMode(m);
      }
    }
  }, []);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.97 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: {
      opacity: 0,
      scale: 1.03,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <main className="w-full min-h-screen bg-background text-foreground overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full min-h-screen relative"
        >
          {mode === "entry" && (
            <EntryGate onSelectMode={(selected) => setMode(selected)} />
          )}

          {mode === "designFile" && (
            <DesignFileMode onSwitchMode={() => setMode("portfolio")} />
          )}

          {mode === "portfolio" && (
            <PortfolioMode onSwitchMode={() => setMode("designFile")} />
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

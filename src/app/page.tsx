"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EntryGate from "@/components/EntryGate";
import DesignFileMode from "@/components/DesignFileMode";
import PortfolioMode from "@/components/PortfolioMode";
import SplashScreen from "@/components/SplashScreen";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

type AppMode = "entry" | "designFile" | "portfolio";

export default function Home() {
  const [mode, setMode] = useState<AppMode>("portfolio");
  const [showSplash, setShowSplash] = useState(true);



  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const m = params.get("mode") as AppMode;
      if (m && ["entry", "designFile", "portfolio"].includes(m)) {
        setMode(m);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
    };
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
        {showSplash ? (
          <SplashScreen
            key="splash"
            onComplete={() => {
              setShowSplash(false);
            }}
          />
        ) : (
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
        )}
      </AnimatePresence>
    </main>
  );
}

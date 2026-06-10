"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SplitTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  tag?: keyof React.JSX.IntrinsicElements;
  onLetterAnimationComplete?: () => void;
}

export default function SplitText({
  text,
  className = "",
  style: customStyle = {},
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    }
  }, []);

  const effectiveSplitType = isMobile ? "words" : splitType;

  useGSAP(
    () => {
      if (!ref.current || !text) return;
      if (animationCompletedRef.current) return;
      const el = ref.current;

      const targets = el.querySelectorAll(".split-char, .split-word");
      if (!targets.length) return;

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
      const sign =
        marginValue === 0
          ? ""
          : marginValue < 0
          ? `-=${Math.abs(marginValue)}${marginUnit}`
          : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      const tween = gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
            fastScrollEnd: true,
            anticipatePin: 0.4,
          },
          onComplete: () => {
            animationCompletedRef.current = true;
            onCompleteRef.current?.();
          },
          willChange: "transform, opacity",
          force3D: true,
        }
      );

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === el) st.kill();
        });
        tween.kill();
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        effectiveSplitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
      ],
      scope: ref,
    }
  );

  const renderContent = () => {
    if (effectiveSplitType === "chars") {
      return text.split(" ").map((word, wordIdx) => (
        <span
          key={wordIdx}
          className="split-word"
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            background: "inherit",
            backgroundClip: "inherit",
            WebkitBackgroundClip: "inherit",
            WebkitTextFillColor: "inherit",
          }}
        >
          {word.split("").map((char, charIdx) => (
            <span
              key={charIdx}
              className="split-char"
              style={{
                display: "inline-block",
                willChange: "transform, opacity",
                background: "inherit",
                backgroundClip: "inherit",
                WebkitBackgroundClip: "inherit",
                WebkitTextFillColor: "inherit",
              }}
            >
              {char}
            </span>
          ))}
          {wordIdx < text.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      ));
    }

    return text.split(" ").map((word, wordIdx) => (
      <span
        key={wordIdx}
        className="split-word"
        style={{
          display: "inline-block",
          willChange: "transform, opacity",
          background: "inherit",
          backgroundClip: "inherit",
          WebkitBackgroundClip: "inherit",
          WebkitTextFillColor: "inherit",
        }}
      >
        {word}
        {wordIdx < text.split(" ").length - 1 ? "\u00A0" : ""}
      </span>
    ));
  };

  const style: React.CSSProperties = {
    textAlign,
    overflow: "hidden",
    display: "inline-block",
    whiteSpace: "normal",
    wordWrap: "break-word",
    willChange: "transform, opacity",
    ...customStyle,
  };
  const classes = `split-parent ${className}`;
  const Tag = tag as any;

  return (
    <Tag ref={ref} style={style} className={classes}>
      {renderContent()}
    </Tag>
  );
}

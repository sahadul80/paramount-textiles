"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";

type PatternKey =
  | "plain"
  | "twill"
  | "satin"
  | "jacquard"
  | "dobby"
  | "leno"
  | "pile"
  | "double";

const PATTERNS: PatternKey[] = [
  "plain",
  "twill",
  "satin",
  "jacquard",
  "dobby",
  "leno",
  "pile",
  "double",
];

function getBgGradient(key: PatternKey) {
  switch (key) {
    case "plain":
      return "linear-gradient(135deg,#d14d4d 0%,#ff7e7e 100%)";
    case "twill":
      return "linear-gradient(135deg,#ff9634 0%,#ffd56a 100%)";
    case "satin":
      return "linear-gradient(135deg,#43c75d 0%,#a4ffc4 100%)";
    case "jacquard":
      return "linear-gradient(135deg,#ffb100 0%,#ffe38b 100%)";
    case "dobby":
      return "linear-gradient(135deg,#3c8fff 0%,#94caff 100%)";
    case "leno":
      return "linear-gradient(135deg,#c741ff 0%,#ffa3ff 100%)";
    case "pile":
      return "linear-gradient(135deg,#ff6823 0%,#ffb380 100%)";
    case "double":
      return "linear-gradient(135deg,#00b894 0%,#66f2d5 100%)";
  }
}

interface StudioBannerProps {
  title?: string;
  heightClass?: string;
  patternCycleMs?: number;
  showControls?: boolean;
}

export default function StudioBanner({
  title = "DESIGN STUDIO",
  heightClass = "h-64",
  patternCycleMs = 4000,
  showControls = true,
}: StudioBannerProps) {
  const [index, setIndex] = useState(0);
  const active = PATTERNS[index];
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, [patternCycleMs]);

  function startAuto() {
    stopAuto();
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % PATTERNS.length);
    }, patternCycleMs);
  }

  function stopAuto() {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function goTo(i: number) {
    stopAuto();
    setIndex(((i % PATTERNS.length) + PATTERNS.length) % PATTERNS.length);
    setTimeout(startAuto, 6000);
  }

  const letters = title.split("");

  const letterVariants: Variants = {
    hidden: { y: 20, opacity: 0, rotateX: 20 },
    visible: (i: number = 0) => {
      const transition: Transition = {
        delay: i * 0.045,
        type: "spring",
        stiffness: 220,
        damping: 22,
      };
      return { y: 0, opacity: 1, rotateX: 0, transition } as any;
    },
    exit: (i: number = 0) => {
      const transition: Transition = { delay: i * 0.01, duration: 0.18 };
      return { y: -20, opacity: 0, rotateX: -20, transition } as any;
    },
  };

  return (
    <div className={`relative w-auto overflow-hidden ${heightClass} rounded-lg`}>
      {/* Gradient background */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
            style={{ background: getBgGradient(active) }}
            className="absolute inset-0"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/15 mix-blend-overlay pointer-events-none" />
      </div>

      {/* SVG weaving text */}
      <div className="relative z-10 flex items-center h-full mt-4">
        <svg
          className="w-full h-full"
          viewBox="0 0 1600 300"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Each pattern is animated via <animateTransform> for left-right movement */}

            {/* PLAIN */}
            <pattern id="pattern-plain" patternUnits="userSpaceOnUse" width="40" height="40">
              <rect width="40" height="40" fill="#fff6f6" />
              <g>
                <rect width="20" height="20" fill="#ff5757" />
                <rect x="20" y="20" width="20" height="20" fill="#ff5757" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-10 0"
                  to="10 0"
                  dur="2s"
                  repeatCount="indefinite"
                  additive="sum"
                />
              </g>
            </pattern>

            {/* TWILL */}
            <pattern id="pattern-twill" patternUnits="userSpaceOnUse" width="60" height="60">
              <rect width="60" height="60" fill="#fff0d8" />
              <g>
                <path d="M0 40 L20 60 L60 20 L40 0 Z" fill="#ff9634" opacity="0.4" />
                <path d="M-20 20 L0 40 L40 0 L20 -20 Z" fill="#ff9634" opacity="0.3" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-15 0"
                  to="15 0"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* SATIN */}
            <pattern id="pattern-satin" patternUnits="userSpaceOnUse" width="40" height="40">
              <rect width="40" height="40" fill="#eaffea" />
              <g>
                <circle cx="10" cy="10" r="3" fill="#2ecc71" />
                <circle cx="30" cy="30" r="3" fill="#2ecc71" opacity="0.6" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-5 0"
                  to="5 0"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* JACQUARD */}
            <pattern id="pattern-jacquard" patternUnits="userSpaceOnUse" width="80" height="80">
              <rect width="80" height="80" fill="#fff8d8" />
              <g opacity="0.4">
                <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="#ffb100" />
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 40 40"
                  to="360 40 40"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* DOBBY */}
            <pattern id="pattern-dobby" patternUnits="userSpaceOnUse" width="40" height="40">
              <rect width="40" height="40" fill="#eaf2ff" />
              <g>
                <rect x="4" y="4" width="12" height="12" fill="#3c8fff" opacity="0.6" />
                <rect x="24" y="24" width="12" height="12" fill="#3c8fff" opacity="0.4" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-6 0"
                  to="6 0"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* LENO */}
            <pattern id="pattern-leno" patternUnits="userSpaceOnUse" width="60" height="60">
              <rect width="60" height="60" fill="#ffeaff" />
              <g stroke="#c741ff" strokeWidth="3" opacity="0.3">
                <path d="M0 20 L60 40" />
                <path d="M0 40 L60 20" />
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="-5 30 30"
                  to="5 30 30"
                  dur="2s"
                  repeatCount="indefinite"
                  additive="sum"
                />
              </g>
            </pattern>

            {/* PILE */}
            <pattern id="pattern-pile" patternUnits="userSpaceOnUse" width="12" height="40">
              <rect width="12" height="40" fill="#fff0e6" />
              <g>
                <rect x="4" width="2" height="40" fill="#ff6823" opacity="0.5" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0 -5"
                  to="0 5"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* DOUBLE */}
            <pattern id="pattern-double" patternUnits="userSpaceOnUse" width="80" height="40">
              <rect width="80" height="40" fill="#e6fff7" />
              <g>
                <rect width="40" height="40" fill="#00b894" opacity="0.6" />
                <rect x="40" width="40" height="40" fill="#00b894" opacity="0.3" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-10 0"
                  to="10 0"
                  dur="2.2s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>
          </defs>

          {/* Animated woven text */}
          <motion.text
            key={`text-${active}`}
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight={800}
            fontSize={64}
            fill={`url(#pattern-${active})`}
          >
            {letters.map((ch, i) => (
              <motion.tspan
                key={`${ch}-${i}`}
                custom={i}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={letterVariants}
                style={{ whiteSpace: "pre" }}
              >
                {ch}
              </motion.tspan>
            ))}
          </motion.text>
        </svg>

        {showControls && (
          <div className="absolute right-6 bottom-6 flex gap-2 z-20">
            <button
              onClick={() => goTo(index - 1)}
              className="bg-white/20 hover:bg-white/40 text-white rounded-full px-3 py-2 shadow-md"
            >
              ‹
            </button>
            <button
              onClick={() => goTo(index + 1)}
              className="bg-white/20 hover:bg-white/40 text-white rounded-full px-3 py-2 shadow-md"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

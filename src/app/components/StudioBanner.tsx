"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";

export type PatternKey =
  | "plain"
  | "twill"
  | "satin"
  | "jacquard"
  | "dobby"
  | "leno"
  | "pile"
  | "double"
  | "herringbone"
  | "basket"
  | "houndstooth"
  | "chevron";

const PATTERNS: PatternKey[] = [
  "plain",
  "twill",
  "satin",
  "jacquard",
  "dobby",
  "leno",
  "pile",
  "double",
  "herringbone",
  "basket",
  "houndstooth",
  "chevron",
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
    case "herringbone":
      return "linear-gradient(135deg,#8e44ad 0%,#9b59b6 100%)";
    case "basket":
      return "linear-gradient(135deg,#e74c3c 0%,#e67e22 100%)";
    case "houndstooth":
      return "linear-gradient(135deg,#2c3e50 0%,#34495e 100%)";
    case "chevron":
      return "linear-gradient(135deg,#16a085 0%,#1abc9c 100%)";
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
  heightClass = "h-20 sm:h-24",
  patternCycleMs = 3000,
  showControls = true,
}: StudioBannerProps) {
  const [index, setIndex] = useState(0);
  const active = PATTERNS[index];
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    startAuto();
    return () => stopAuto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const letters = title.split("");

  const letterVariants: Variants = {
    hidden: { y: 20, opacity: 0, rotateX: -45 },
    visible: (i: number = 0) => {
      const transition: Transition = {
        delay: i * 0.06,
        type: "spring",
        stiffness: 200,
        damping: 20,
      };
      return {
        y: 0,
        opacity: 1,
        rotateX: 0,
        textShadow: [
          "0 1px 0 rgba(255,255,255,0.4)",
          "0 2px 0 rgba(255,255,255,0.3)",
          "0 3px 0 rgba(255,255,255,0.2)",
          "0 4px 0 rgba(255,255,255,0.1)",
          "0 5px 10px rgba(0,0,0,0.3)",
        ].join(", "),
        transition,
      };
    },
    exit: (i: number = 0) => {
      const transition: Transition = {
        delay: i * 0.01,
        duration: 0.15,
      };
      return {
        y: 10,
        opacity: 0,
        rotateX: 50,
        transition,
      };
    },
  };

  return (
    <div className={`relative w-auto overflow-hidden ${heightClass} rounded-lg flex items-center`}>
      {/* Gradient background */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [
                0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8,
                0.85, 0.9, 0.95, 1,
              ],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.25 }}
            style={{ background: getBgGradient(active) }}
            className="absolute inset-0"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
      </div>

      {/* SVG weaving text */}
      <div className="relative z-10 h-full w-full">
        <svg
          className="w-full h-full"
          viewBox="0 -20 1600 50"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Enhanced shadow filter */}
            <filter id="text-3d" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="6" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.25"/>
              <feDropShadow dx="8" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.18"/>
              <feDropShadow dx="10" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.12"/>
            </filter>

            {/* Text outline for better visibility */}
            <filter id="text-outline">
              <feMorphology operator="dilate" radius="1.5" in="SourceGraphic" result="thick"/>
              <feFlood floodColor="#ffffff" floodOpacity="0.8" result="flood"/>
              <feComposite in="flood" in2="thick" operator="in" result="outline"/>
              <feComposite in="SourceGraphic" in2="outline" operator="over"/>
            </filter>

            {/* Denser and more animated patterns */}

            {/* PLAIN - More dense and visible animation */}
            <pattern id="pattern-plain" patternUnits="userSpaceOnUse" width="12" height="12">
              <rect width="12" height="12" fill="#fff6f6" />
              <g>
                <rect width="6" height="6" fill="#ff5757" opacity="0.9" />
                <rect x="6" y="6" width="6" height="6" fill="#ff5757" opacity="0.9" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-8 0"
                  to="8 0"
                  dur="1.2s"
                  repeatCount="indefinite"
                  additive="sum"
                />
              </g>
            </pattern>

            {/* TWILL - More dense pattern */}
            <pattern id="pattern-twill" patternUnits="userSpaceOnUse" width="16" height="16">
              <rect width="16" height="16" fill="#fff0d8" />
              <g>
                <path d="M0 12 L8 16 L16 8 L12 0 Z" fill="#ff9634" opacity="0.8" />
                <path d="M-6 6 L0 12 L8 4 L2 -2 Z" fill="#ff9634" opacity="0.6" />
                <path d="M6 0 L12 6 L20 -2 L14 -8 Z" fill="#ff9634" opacity="0.5" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-12 0"
                  to="12 0"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* SATIN - Denser circles */}
            <pattern id="pattern-satin" patternUnits="userSpaceOnUse" width="12" height="12">
              <rect width="12" height="12" fill="#eaffea" />
              <g>
                <circle cx="3" cy="3" r="1.5" fill="#2ecc71" opacity="0.9" />
                <circle cx="9" cy="9" r="1.5" fill="#2ecc71" opacity="0.8" />
                <circle cx="3" cy="9" r="1.2" fill="#27ae60" opacity="0.7" />
                <circle cx="9" cy="3" r="1.2" fill="#27ae60" opacity="0.7" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-6 0"
                  to="6 0"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* JACQUARD - More visible rotation */}
            <pattern id="pattern-jacquard" patternUnits="userSpaceOnUse" width="24" height="24">
              <rect width="24" height="24" fill="#fff8d8" />
              <g opacity="0.8">
                <path d="M12 0 L24 12 L12 24 L0 12 Z" fill="#ffb100" />
                <circle cx="12" cy="12" r="5" fill="#ff8c00" />
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 12 12"
                  to="360 12 12"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* DOBBY - Denser grid */}
            <pattern id="pattern-dobby" patternUnits="userSpaceOnUse" width="12" height="12">
              <rect width="12" height="12" fill="#eaf2ff" />
              <g>
                <rect x="1" y="1" width="4" height="4" fill="#3c8fff" opacity="0.9" />
                <rect x="7" y="7" width="4" height="4" fill="#3c8fff" opacity="0.8" />
                <rect x="1" y="7" width="3" height="3" fill="#2968c8" opacity="0.7" />
                <rect x="7" y="1" width="3" height="3" fill="#2968c8" opacity="0.7" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-6 0"
                  to="6 0"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* LENO - More lines, more visible */}
            <pattern id="pattern-leno" patternUnits="userSpaceOnUse" width="20" height="20">
              <rect width="20" height="20" fill="#ffeaff" />
              <g stroke="#c741ff" strokeWidth="1.5" opacity="0.7">
                <path d="M0 6 L20 12" />
                <path d="M0 12 L20 6" />
                <path d="M0 9 L20 15" />
                <path d="M0 15 L20 9" />
                <path d="M0 3 L20 18" />
                <path d="M0 18 L20 3" />
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="-16 20 10"
                  to="16 0 10"
                  dur="1.2s"
                  repeatCount="indefinite"
                  additive="sum"
                />
              </g>
            </pattern>

            {/* PILE - More threads */}
            <pattern id="pattern-pile" patternUnits="userSpaceOnUse" width="8" height="12">
              <rect width="8" height="12" fill="#fff0e6" />
              <g>
                <rect x="1" width="1" height="12" fill="#ff6823" opacity="0.9" />
                <rect x="3" width="1" height="12" fill="#ff6823" opacity="0.8" />
                <rect x="5" width="1" height="12" fill="#ff6823" opacity="0.7" />
                <rect x="7" width="1" height="12" fill="#ff6823" opacity="0.6" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0 -8"
                  to="0 8"
                  dur="0.6s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* DOUBLE - More dense */}
            <pattern id="pattern-double" patternUnits="userSpaceOnUse" width="20" height="12">
              <rect width="20" height="12" fill="#e6fff7" />
              <g>
                <rect width="10" height="12" fill="#00b894" opacity="0.9" />
                <rect x="10" width="10" height="12" fill="#00b894" opacity="0.7" />
                <rect x="5" y="0" width="3" height="12" fill="#00a085" opacity="0.5" />
                <rect x="15" y="0" width="3" height="12" fill="#00a085" opacity="0.5" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-10 0"
                  to="10 0"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* HERRINGBONE - More dense pattern */}
            <pattern id="pattern-herringbone" patternUnits="userSpaceOnUse" width="24" height="12">
              <rect width="24" height="12" fill="#f8e8ff" />
              <g fill="#8e44ad" opacity="0.8">
                <path d="M0 0 L12 0 L6 6 L-6 6 Z" />
                <path d="M12 0 L24 0 L18 6 L6 6 Z" />
                <path d="M6 6 L18 6 L12 12 L0 12 Z" />
                <path d="M18 6 L30 6 L24 12 L12 12 Z" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-8 0"
                  to="8 0"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* BASKET - Denser weave */}
            <pattern id="pattern-basket" patternUnits="userSpaceOnUse" width="20" height="20">
              <rect width="20" height="20" fill="#ffefe6" />
              <g stroke="#e74c3c" strokeWidth="1.5" opacity="0.8">
                <rect x="3" y="3" width="6" height="6" fill="none" />
                <rect x="11" y="3" width="6" height="6" fill="none" />
                <rect x="3" y="11" width="6" height="6" fill="none" />
                <rect x="11" y="11" width="6" height="6" fill="none" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-4 -4"
                  to="4 4"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* HOUNDSTOOTH - More dense */}
            <pattern id="pattern-houndstooth" patternUnits="userSpaceOnUse" width="24" height="24">
              <rect width="24" height="24" fill="#ecf0f1" />
              <g fill="#2c3e50" opacity="0.9">
                <path d="M0 0 L12 0 L0 12 Z" />
                <path d="M12 12 L24 12 L12 24 Z" />
                <path d="M12 0 L24 0 L24 12 L12 12 Z" />
                <path d="M0 12 L12 12 L0 24 Z" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-6 -6"
                  to="6 6"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* CHEVRON - More dense */}
            <pattern id="pattern-chevron" patternUnits="userSpaceOnUse" width="24" height="12">
              <rect width="24" height="12" fill="#e8f8f5" />
              <g fill="#16a085" opacity="0.8">
                <polygon points="0,0 12,0 6,6" />
                <polygon points="12,0 24,0 18,6" />
                <polygon points="6,6 18,6 12,12" />
                <polygon points="18,6 30,6 24,12" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-8 0"
                  to="8 0"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>
          </defs>

          {/* Animated woven text with 3D effect */}
          <motion.text
            key={`text-${active}`}
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight={900}
            fontSize={72}
            fill={`url(#pattern-${active})`}
            filter="url(#text-3d)"
          >
            {letters.map((ch, i) => (
              <motion.tspan
                key={`${ch}-${i}`}
                custom={i}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={letterVariants}
                style={{
                  whiteSpace: "pre",
                  stroke: "#ffffff",
                  strokeWidth: 0.8,
                  paintOrder: "stroke fill",
                }}
              >
                {ch}
              </motion.tspan>
            ))}
          </motion.text>

          {/* Additional text outline for extra visibility */}
          <motion.text
            key={`text-outline-${active}`}
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight={900}
            fontSize={72}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
          >
            {letters.map((ch, i) => (
              <motion.tspan
                key={`outline-${ch}-${i}`}
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
      </div>
    </div>
  );
}
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
  heightClass = "h-64",
  patternCycleMs = 3000,
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

  const letters = title.split("");

  const letterVariants: Variants = {
    hidden: { y: 20, opacity: 0, rotateX: -45 },
    visible: (i: number = 0) => {
      const transition: Transition = {
        delay: i * 0.03,
        type: "spring",
        stiffness: 300,
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
          "0 5px 10px rgba(0,0,0,0.3)"
        ].join(", "),
        transition 
      };
    },
    exit: (i: number = 0) => {
      const transition: Transition = { 
        delay: i * 0.01, 
        duration: 0.15 
      };
      return { 
        y: -15, 
        opacity: 0, 
        rotateX: 45, 
        transition 
      };
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
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
      </div>

      {/* SVG weaving text */}
      <div className="relative z-10 h-full top-0 sm:top-2">
        <svg
          className="w-full h-full"
          viewBox="0 0 1600 300"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Enhanced 3D text effect */}
            <filter id="text-3d" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.3"/>
              <feDropShadow dx="4" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.2"/>
              <feDropShadow dx="6" dy="6" stdDeviation="7" floodColor="#000000" floodOpacity="0.1"/>
            </filter>

            {/* Text outline for better visibility */}
            <filter id="text-outline">
              <feMorphology operator="dilate" radius="2" in="SourceGraphic" result="thick"/>
              <feFlood floodColor="#ffffff" floodOpacity="0.8" result="flood"/>
              <feComposite in="flood" in2="thick" operator="in" result="outline"/>
              <feComposite in="SourceGraphic" in2="outline" operator="over"/>
            </filter>

            {/* Enhanced patterns - more dense and rich */}

            {/* PLAIN - Enhanced */}
            <pattern id="pattern-plain" patternUnits="userSpaceOnUse" width="20" height="20">
              <rect width="20" height="20" fill="#fff6f6" />
              <g>
                <rect width="10" height="10" fill="#ff5757" />
                <rect x="10" y="10" width="10" height="10" fill="#ff5757" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-5 0"
                  to="5 0"
                  dur="1.5s"
                  repeatCount="indefinite"
                  additive="sum"
                />
              </g>
            </pattern>

            {/* TWILL - Enhanced */}
            <pattern id="pattern-twill" patternUnits="userSpaceOnUse" width="30" height="30">
              <rect width="30" height="30" fill="#fff0d8" />
              <g>
                <path d="M0 20 L10 30 L30 10 L20 0 Z" fill="#ff9634" opacity="0.6" />
                <path d="M-10 10 L0 20 L20 0 L10 -10 Z" fill="#ff9634" opacity="0.4" />
                <path d="M10 0 L20 10 L40 -10 L30 -20 Z" fill="#ff9634" opacity="0.3" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-8 0"
                  to="8 0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* SATIN - Enhanced */}
            <pattern id="pattern-satin" patternUnits="userSpaceOnUse" width="20" height="20">
              <rect width="20" height="20" fill="#eaffea" />
              <g>
                <circle cx="5" cy="5" r="2" fill="#2ecc71" />
                <circle cx="15" cy="15" r="2" fill="#2ecc71" opacity="0.7" />
                <circle cx="5" cy="15" r="1.5" fill="#27ae60" opacity="0.5" />
                <circle cx="15" cy="5" r="1.5" fill="#27ae60" opacity="0.5" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-3 0"
                  to="3 0"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* JACQUARD - Enhanced */}
            <pattern id="pattern-jacquard" patternUnits="userSpaceOnUse" width="40" height="40">
              <rect width="40" height="40" fill="#fff8d8" />
              <g opacity="0.6">
                <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="#ffb100" />
                <circle cx="20" cy="20" r="8" fill="#ff8c00" />
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 20 20"
                  to="360 20 20"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* DOBBY - Enhanced */}
            <pattern id="pattern-dobby" patternUnits="userSpaceOnUse" width="20" height="20">
              <rect width="20" height="20" fill="#eaf2ff" />
              <g>
                <rect x="2" y="2" width="6" height="6" fill="#3c8fff" opacity="0.8" />
                <rect x="12" y="12" width="6" height="6" fill="#3c8fff" opacity="0.6" />
                <rect x="2" y="12" width="4" height="4" fill="#2968c8" opacity="0.4" />
                <rect x="12" y="2" width="4" height="4" fill="#2968c8" opacity="0.4" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-3 0"
                  to="3 0"
                  dur="1.4s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* LENO - Enhanced */}
            <pattern id="pattern-leno" patternUnits="userSpaceOnUse" width="30" height="30">
              <rect width="30" height="30" fill="#ffeaff" />
              <g stroke="#c741ff" strokeWidth="2" opacity="0.5">
                <path d="M0 10 L30 20" />
                <path d="M0 20 L30 10" />
                <path d="M0 15 L30 25" />
                <path d="M0 25 L30 15" />
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="-3 15 15"
                  to="3 15 15"
                  dur="1.8s"
                  repeatCount="indefinite"
                  additive="sum"
                />
              </g>
            </pattern>

            {/* PILE - Enhanced */}
            <pattern id="pattern-pile" patternUnits="userSpaceOnUse" width="6" height="20">
              <rect width="6" height="20" fill="#fff0e6" />
              <g>
                <rect x="2" width="1" height="20" fill="#ff6823" opacity="0.7" />
                <rect x="4" width="1" height="20" fill="#ff6823" opacity="0.5" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0 -3"
                  to="0 3"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* DOUBLE - Enhanced */}
            <pattern id="pattern-double" patternUnits="userSpaceOnUse" width="40" height="20">
              <rect width="40" height="20" fill="#e6fff7" />
              <g>
                <rect width="20" height="20" fill="#00b894" opacity="0.8" />
                <rect x="20" width="20" height="20" fill="#00b894" opacity="0.5" />
                <rect x="10" y="0" width="5" height="20" fill="#00a085" opacity="0.3" />
                <rect x="25" y="0" width="5" height="20" fill="#00a085" opacity="0.3" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-5 0"
                  to="5 0"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* NEW PATTERNS */}

            {/* HERRINGBONE */}
            <pattern id="pattern-herringbone" patternUnits="userSpaceOnUse" width="40" height="20">
              <rect width="40" height="20" fill="#f8e8ff" />
              <g fill="#8e44ad" opacity="0.7">
                <path d="M0 0 L20 0 L10 10 L-10 10 Z" />
                <path d="M20 0 L40 0 L30 10 L10 10 Z" />
                <path d="M10 10 L30 10 L20 20 L0 20 Z" />
                <path d="M30 10 L50 10 L40 20 L20 20 Z" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-5 0"
                  to="5 0"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* BASKET */}
            <pattern id="pattern-basket" patternUnits="userSpaceOnUse" width="30" height="30">
              <rect width="30" height="30" fill="#ffefe6" />
              <g stroke="#e74c3c" strokeWidth="2" opacity="0.6">
                <rect x="5" y="5" width="8" height="8" fill="none" />
                <rect x="17" y="5" width="8" height="8" fill="none" />
                <rect x="5" y="17" width="8" height="8" fill="none" />
                <rect x="17" y="17" width="8" height="8" fill="none" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-2 -2"
                  to="2 2"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* HOUNDSTOOTH */}
            <pattern id="pattern-houndstooth" patternUnits="userSpaceOnUse" width="40" height="40">
              <rect width="40" height="40" fill="#ecf0f1" />
              <g fill="#2c3e50" opacity="0.8">
                <path d="M0 0 L20 0 L0 20 Z" />
                <path d="M20 20 L40 20 L20 40 Z" />
                <path d="M20 0 L40 0 L40 20 L20 20 Z" />
                <path d="M0 20 L20 20 L0 40 Z" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-3 -3"
                  to="3 3"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>

            {/* CHEVRON */}
            <pattern id="pattern-chevron" patternUnits="userSpaceOnUse" width="40" height="20">
              <rect width="40" height="20" fill="#e8f8f5" />
              <g fill="#16a085" opacity="0.7">
                <polygon points="0,0 20,0 10,10" />
                <polygon points="20,0 40,0 30,10" />
                <polygon points="10,10 30,10 20,20" />
                <polygon points="30,10 50,10 40,20" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-5 0"
                  to="5 0"
                  dur="2.2s"
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
            fontSize={64}
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
                  strokeWidth: 1,
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
            fontSize={64}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
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
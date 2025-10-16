'use client'

import React, { Suspense, useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaCheck, FaArrowRight } from 'react-icons/fa'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import ParamountLoader from './Loader'
import SupimaModel from './SupimaModel'
import TextileBanner from './TextileBanner'

const SupimaSection = () => {
  const features = useMemo(() => [
    "35% Longer staple length – Increased softness and lustre.",
    "45% Stronger and hence extraordinarily resilient and incredibly durable.",
    "Vibrant fibre that absorbs and retains colour better than regular cottons, thus retaining their brilliance for years on end."
  ], [])

  const [isLoading, setIsLoading] = useState(false)

  // Optimized variants with reduced complexity
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15, // Reduced stagger
        duration: 0.4 
      }
    }
  }

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.4, // Reduced duration
        ease: "easeOut" 
      }
    }
  }

  // Simplified hover animations
  const hoverAnimation = {
    scale: 1.02,
    transition: { duration: 0.2 }
  }

  const iconHoverAnimation = {
    scale: 1.1,
    rotate: 180, // Reduced from 360 for performance
    transition: { 
      duration: 0.3,
      ease: "easeInOut"
    }
  }

  return (
    <section className="relative flex flex-col items-center justify-center max-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
        <div>
        <motion.h4
            className="text-indigo-600 font-semibold tracking-wide uppercase text-sm"
        >
            About SUPIMA Cotton
        </motion.h4>

        <motion.h2
            className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-gray-900"
        >
            What sets <span className="text-purple-600">SUPIMA</span> apart from all other cottons?
        </motion.h2>
        </div>
      {/* Simplified Background - Remove heavy effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30"></div>
      
      {/* Reduced floating elements - only one for performance */}
      <div className="absolute w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-xl top-10 left-10 animate-float-slow"></div>
      <div className="absolute w-48 h-48 bg-purple-200 rounded-full opacity-20 blur-xl bottom-20 right-20 animate-float-slow animation-delay-2s"></div>

      <div className="relative z-10 flex flex-col sm:flex-row gap-6 max-w-7xl w-full items-center justify-center min-h-[80vh]">
        
        {/* LEFT COLUMN - Content */}
        <motion.div
          className="flex flex-col gap-4 w-full sm:w-1/2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "100px" }} // Increased margin for earlier trigger
          variants={containerVariants}
        >

          <motion.p
            className="text-gray-600 text-sm lg:text-base leading-relaxed p-4 rounded-xl bg-white/80 border border-gray-200 shadow-sm"
          >
            The Supima trademark guarantees that your product is made from the world&apos;s finest cotton.
            An extra-long staple (ELS) cotton that is often referred to as the &apos;cashmere of cottons,&apos; 
            Supima surpasses other cottons in softness, strength, and sheer brilliance of colour. 
            Supima cotton has become the cotton of choice amongst the world&apos;s leading fine-count yarn spinners.
          </motion.p>

          <motion.ul
            className="flex flex-col gap-3"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-2 p-2 rounded-lg bg-white/80 border border-gray-200 shadow-sm hover:bg-indigo-50 transition-colors duration-200 cursor-pointer"
                whileHover={{ x: 4 }} // Simplified hover
              >
                <motion.div
                  className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex-shrink-0 mt-0.5"
                >
                  <FaCheck className="text-xs" />
                </motion.div>
                <span className="text-gray-800 font-medium text-sm flex-1">
                  {feature}
                </span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            className=""
            whileHover={hoverAnimation}
          >
            <Link
              href="/pages/fabric"
              className="inline-flex items-center gap-2 p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <span>Explore SUPIMA</span>
              <motion.span
                animate={{ x: [0, 3, 0] }} // Reduced movement
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaArrowRight />
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN - 3D Model */}
        <motion.div
          className="w-full sm:w-1/2 h-[360px] lg:h-[480px]"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }} // Faster transition
          viewport={{ once: true, margin: "100px" }}
        >
          <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-300 shadow-lg">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-2xl">
                <ParamountLoader />
              </div>
            )}

            <div className={`w-full h-full ${isLoading ? 'hidden' : 'block'}`}>
              <Canvas
                camera={{
                  position: [8, 8, 8],
                  fov: 45,
                  near: 0.1,
                  far: 1000
                }}
                className="w-full h-full"
                performance={{ min: 0.5 }} // Performance optimization
                dpr={[1, 2]} // Dynamic pixel ratio for performance
              >
                <Suspense fallback={null}>
                  {/* Optimized lighting */}
                  <ambientLight intensity={0.6} />
                  <directionalLight
                    position={[5, 5, 5]}
                    intensity={0.8}
                    color="#ffffff"
                  />
                  <SupimaModel />
                  <OrbitControls
                    enableZoom={false}
                    enablePan={true}
                    enableRotate={true}
                    minDistance={4}
                    maxDistance={5}
                    autoRotate={true}
                    autoRotateSpeed={1}
                  />
                  <Environment preset="city" />
                </Suspense>
              </Canvas>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Simplified Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-500 text-xs opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="flex flex-col items-center gap-1">
          <span>Scroll for more</span>
          <div className="w-3 h-3 border-r border-b border-gray-400 transform rotate-45 animate-bounce"></div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animation-delay-2s {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  )
}

export default SupimaSection
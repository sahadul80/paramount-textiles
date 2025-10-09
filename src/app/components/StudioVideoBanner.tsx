'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoBannerProps {
  videoSrc: string;          
  poster?: string;           
  overlayText?: string;      
  overlayClass?: string;     
  heightClass?: string;      
  autoPlay?: boolean;        
  loop?: boolean;            
  muted?: boolean;           
}

export default function StudioVideoBanner({
  videoSrc,
  poster,
  overlayText,
  overlayClass = '',
  heightClass = 'h-96',
  autoPlay = true,
  loop = true,
  muted = true,
}: VideoBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200); // delay for fade-in
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative w-full overflow-hidden ${heightClass} rounded-lg`}>
      <AnimatePresence>
        {isLoaded && (
          <motion.video
            key="video"
            src={videoSrc}
            poster={poster}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            playsInline
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>

      {overlayText && (
        <motion.div
          className={`absolute inset-0 flex items-center justify-center bg-black/30 ${overlayClass}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-white text-2xl md:text-4xl font-bold text-center">
            {overlayText}
          </h2>
        </motion.div>
      )}
    </div>
  );
}

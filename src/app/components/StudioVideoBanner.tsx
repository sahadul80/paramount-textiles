'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoBannerProps {
    videoSrc: string;
    poster?: string;
    gifSrc?: string;
    overlayClass?: string;
    heightClass?: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
}

export default function StudioVideoBanner({
    videoSrc,
    poster,
    gifSrc = '/fonts/design-studio-text.gif',
    overlayClass = '',
    heightClass = 'h-96',
    autoPlay = true,
    loop = true,
    muted = true,
}: VideoBannerProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const observerRef = useRef<IntersectionObserver | undefined>(null);

    useEffect(() => {
        // Set a small timeout to prevent blocking main thread
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Lazy load video when component is in viewport
        if (!videoRef.current || !isLoaded) return;

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoadVideo(true);
                    observerRef.current?.disconnect();
                }
            },
            {
                rootMargin: '100px', // Start loading 100px before entering viewport
                threshold: 0.1
            }
        );

        observerRef.current.observe(videoRef.current);

        return () => {
            observerRef.current?.disconnect();
        };
    }, [isLoaded]);

    // Preload critical resources
    useEffect(() => {
        if (poster) {
            const img = new Image();
            img.src = poster;
        }

        if (gifSrc) {
            const img = new Image();
            img.src = gifSrc;
        }
    }, [poster, gifSrc]);

    return (
        <div
            className={`relative w-full overflow-hidden ${heightClass} rounded-lg`}
        >
            <AnimatePresence>
                {shouldLoadVideo && (
                    <motion.video
                        key="video"
                        src={videoSrc}
                        poster={poster}
                        autoPlay={autoPlay}
                        loop={loop}
                        muted={muted}
                        playsInline
                        preload="metadata" // Only load metadata initially
                        className="w-full h-[90vh] object-cover"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        onLoadedData={() => {
                            // Video is ready to play
                            setIsLoaded(true);
                        }}
                    />
                )}
            </AnimatePresence>

            <motion.div
                className={`absolute inset-0 flex items-end bg-gradient-to-t from-black via-black/50 to-transparent ${overlayClass}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {gifSrc && (
                    <motion.img
                        src={gifSrc}
                        alt="Design Studio Text"
                        className="w-auto h-auto max-h-[30vh] object-contain"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        loading="eager"
                        decoding="async"
                    />
                )}
            </motion.div>
        </div>
    );
}
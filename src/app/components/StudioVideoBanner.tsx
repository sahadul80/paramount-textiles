'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ParamountLoader from './Loader';

interface VideoBannerProps {
    videoSrc?: string;
    poster?: string;
    gifSrc?: string;
    overlayClass?: string;
    heightClass?: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
}

export default function StudioVideoBanner({
    videoSrc = "/videos/design-studio.mp4",
    poster,
    gifSrc = '/fonts/design-studio-text.gif',
    overlayClass = '',
    heightClass = 'h-96',
    autoPlay = true,
    loop = true,
    muted = true,
}: VideoBannerProps) {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isVideoVisible, setIsVideoVisible] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load video immediately when component mounts
        setIsVideoVisible(true);
        
        // Preload critical resources
        if (poster) {
            const img = new Image();
            img.src = poster;
        }

        if (gifSrc) {
            const img = new Image();
            img.src = gifSrc;
        }

        // Set up intersection observer for video optimization
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && videoRef.current) {
                    // Video is in viewport, ensure it's playing
                    videoRef.current.play().catch(console.error);
                }
            },
            { threshold: 0.5 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [poster, gifSrc]);

    const handleVideoLoad = () => {
        setIsVideoLoaded(true);
    };

    const handleVideoError = () => {
        console.error('Failed to load video');
        setIsVideoLoaded(true); // Continue with fallback content
    };

    return (
        <div
            ref={containerRef}
            className={`relative w-full overflow-hidden ${heightClass} rounded-lg`}
        >
            {/* Video Element - Always render but control visibility */}
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: isVideoLoaded ? 1 : 0 }}
                transition={{ duration: 1 }}
            >
                <video
                    ref={videoRef}
                    src={videoSrc}
                    poster={poster}
                    autoPlay={autoPlay}
                    loop={loop}
                    muted={muted}
                    playsInline
                    className="w-full h-full object-cover"
                    onLoadedData={handleVideoLoad}
                    onError={handleVideoError}
                    preload="auto"
                >
                    {/* Fallback content if video fails to load */}
                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <span className="text-white text-lg">Video not supported</span>
                    </div>
                </video>
            </motion.div>

            {/* Loading placeholder */}
            {!isVideoLoaded && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-secondary-100 to-secondary-400 flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <ParamountLoader/>
                </motion.div>
            )}

            {/* Overlay with GIF */}
            <motion.div
                className={`absolute inset-0 flex items-end bg-gradient-to-t from-black via-black/50 to-transparent ${overlayClass}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: isVideoLoaded ? 1 : 0 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                {gifSrc && (
                    <motion.img
                        src={gifSrc}
                        alt="Design Studio Text"
                        className="w-full h-auto max-h-[400vh] object-contain"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ 
                            opacity: isVideoLoaded ? 1 : 0, 
                            y: isVideoLoaded ? 0 : 20, 
                            scale: isVideoLoaded ? 1 : 0.95 
                        }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
                        loading="eager"
                        decoding="async"
                    />
                )}
            </motion.div>
        </div>
    );
}
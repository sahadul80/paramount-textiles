'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';
import {
  ChevronDownIcon,
  PlayIcon,
  PauseIcon,
  ArrowRightIcon,
  PhotoIcon,
  VideoCameraIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

export type ButtonDef = {
  text: string;
  link: string;
  primary: boolean;
};

export type SlideContent = {
  title: string;
  subtitle?: string;
  description?: string;
  buttons?: ButtonDef[];
};

export type HeroData = {
  backgroundImages: string[];
  backgroundVideos?: string[];
  slides: SlideContent[];
  autoPlayInterval?: number;
  showScrollIndicator?: boolean;
};

interface HeroBannerProps {
  data: HeroData;
}

export default function HeroBanner({ data }: HeroBannerProps) {
  const {
    backgroundImages,
    backgroundVideos = [],
    slides,
    autoPlayInterval = 5000,
    showScrollIndicator = true
  } = data;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Fixed: Proper slide type calculation
  const slideTypes = useMemo(() => {
    const total = Math.max(backgroundImages.length, backgroundVideos.length, slides.length);
    return Array.from({ length: total }).map((_, i) => {
      // Check if this slide index has a video
      const hasVideo = i < backgroundVideos.length && 
                      backgroundVideos[i] && 
                      backgroundVideos[i].length > 0;
      return hasVideo ? 1 : 0;
    });
  }, [backgroundImages.length, backgroundVideos, slides.length]);

  const totalSlides = useMemo(
    () => Math.max(backgroundImages.length, backgroundVideos.length, slides.length),
    [backgroundImages.length, backgroundVideos.length, slides.length]
  );

  // Initialize video refs and loaded state
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, totalSlides);
    setVideoLoaded(prev => {
      const newLoaded = new Array(totalSlides).fill(false);
      // Preserve existing loaded states
      prev.forEach((loaded, index) => {
        if (index < totalSlides) newLoaded[index] = loaded;
      });
      return newLoaded;
    });
  }, [totalSlides]);

  // Fixed: Simplified autoplay logic
  useEffect(() => {
    if (!isAutoPlaying || totalSlides <= 1) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't set timeout if video is currently playing
    if (activeVideoIndex !== null) {
      return;
    }

    const currentSlideType = slideTypes[currentSlide];
    const isCurrentVideo = currentSlideType === 1;

    // Use appropriate interval based on slide type
    const interval = isCurrentVideo ? 7000 : autoPlayInterval;

    timeoutRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAutoPlaying, currentSlide, autoPlayInterval, totalSlides, activeVideoIndex, slideTypes]);

  // Fixed: Better video auto-play handling
  useEffect(() => {
    const currentSlideType = slideTypes[currentSlide];
    const isCurrentVideo = currentSlideType === 1;
    const videoRef = videoRefs.current[currentSlide];

    if (isCurrentVideo && videoRef && isAutoPlaying && activeVideoIndex === null) {
      // Clear any existing autoplay timeout when video should play
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const playVideo = async () => {
        try {
          await videoRef.play();
          // Video play will trigger handleVideoPlay which sets activeVideoIndex
        } catch (error) {
          console.error('Failed to play video:', error);
          // If video fails to play, continue with normal slideshow
          setActiveVideoIndex(null);
          // Restart autoplay timeout for this slide
          if (isAutoPlaying) {
            timeoutRef.current = setTimeout(() => {
              setCurrentSlide((prev) => (prev + 1) % totalSlides);
            }, autoPlayInterval);
          }
        }
      };

      playVideo();
    }
  }, [currentSlide, isAutoPlaying, activeVideoIndex, slideTypes, autoPlayInterval, totalSlides]);

  // Helper functions
  const getImageForIndex = useCallback(
    (i: number) => {
      if (!backgroundImages || backgroundImages.length === 0) return '';
      const idx = i % backgroundImages.length;
      return backgroundImages[idx] ?? '';
    },
    [backgroundImages]
  );

  const getVideoForIndex = useCallback(
    (i: number) => {
      if (!backgroundVideos || backgroundVideos.length === 0) return '';
      const idx = i % backgroundVideos.length;
      return backgroundVideos[idx];
    },
    [backgroundVideos]
  );

  const isVideoSlide = useCallback((i: number) => {
    return slideTypes[i] === 1;
  }, [slideTypes]);

  // Handle video load
  const handleVideoLoad = useCallback((index: number) => {
    setVideoLoaded((prev) => {
      const arr = [...prev];
      arr[index] = true;
      return arr;
    });
  }, []);

  // Handle video play
  const handleVideoPlay = useCallback((index: number) => {
    setActiveVideoIndex(index);
    setIsAutoPlaying(false);
    // Clear any autoplay timeout when video starts playing
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Fixed: Better video end handling
  const handleVideoEnded = useCallback((index: number) => {
    setActiveVideoIndex(null);
    
    // Small delay before moving to next slide and restarting autoplay
    const moveToNextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
      setIsAutoPlaying(true);
    };

    // Wait a bit after video ends before moving to next slide
    setTimeout(moveToNextSlide, 1500);
  }, [totalSlides]);

  // Handle video errors
  const handleVideoError = useCallback((index: number) => {
    console.error(`Video failed to load for slide ${index}`);
    setActiveVideoIndex(null);
    setIsAutoPlaying(true);
    
    // Set timeout to move to next slide if video fails
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, autoPlayInterval);
  }, [autoPlayInterval]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getQualitySrc = useCallback((src: string) => src, []);

  // Fixed: Better slide navigation
  const goToSlide = useCallback((i: number) => {
    // Stop any playing video when changing slides
    if (activeVideoIndex !== null) {
      const currentVideoRef = videoRefs.current[activeVideoIndex];
      if (currentVideoRef) {
        currentVideoRef.pause();
        currentVideoRef.currentTime = 0;
      }
      setActiveVideoIndex(null);
    }
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setCurrentSlide(i);
    setIsAutoPlaying(true);
  }, [activeVideoIndex]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % totalSlides);
  }, [currentSlide, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1);
  }, [currentSlide, totalSlides, goToSlide]);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(prev => !prev);
    // Clear timeout when pausing
    if (!isAutoPlaying && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [isAutoPlaying]);

  const scrollToNext = useCallback(() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }), []);

  // Animation variants
  const backgroundVariants: Variants = {
    visible: { opacity: 1, transition: { duration: 0.9 } },
    hidden: { opacity: 0, transition: { duration: 0.9 } }
  };
  
  const itemVariants: Variants = {
    hidden: { y: 28, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: 'easeOut' } 
    }
  };
  
  const scrollIndicatorVariants: Variants = {
    animate: { 
      y: [0, 8, 0], 
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } 
    }
  };

  const overlayOpacity = 0.15;
  const gradientOpacity = 0.3;

  const currentContent = slides[currentSlide] || { title: '' };
  const currentSlideType = slideTypes[currentSlide];

  return (
    <section
      className="hero-banner relative min-h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-roledescription="carousel"
    >
      {/* Background slides */}
      {Array.from({ length: totalSlides }).map((_, i) => {
        const isActive = i === currentSlide;
        const image = getImageForIndex(i);
        const video = getVideoForIndex(i);
        const slideType = slideTypes[i];
        const hasVideo = slideType === 1;
        const isVideoActive = hasVideo && activeVideoIndex === i;

        return (
          <motion.div
            key={i}
            className={`absolute inset-0 ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
            initial="hidden"
            animate={isActive ? 'visible' : 'hidden'}
            variants={backgroundVariants}
            style={{
              zIndex: isActive ? 0 : -1,
            }}
            aria-hidden={!isActive}
          >
            {/* Show image for all slides as fallback */}
            {image && (
              <div 
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
                  // Show image unless video is actively playing
                  !isVideoActive ? 'opacity-80' : 'opacity-0'
                }`}
                style={{ backgroundImage: `url(${image})` }}
              />
            )}

            {/* Show video only for video slides when active */}
            {hasVideo && video && (
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  isVideoActive ? 'opacity-80' : 'opacity-0'
                }`}
                muted
                playsInline
                preload="metadata"
                poster={image}
                onPlay={() => handleVideoPlay(i)}
                onEnded={() => handleVideoEnded(i)}
                onError={() => handleVideoError(i)}
                onLoadedData={() => handleVideoLoad(i)}
              >
                <source src={getQualitySrc(video)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Loading placeholder for video slides */}
            {hasVideo && video && !videoLoaded[i] && image && (
              <div 
                className="absolute inset-0 bg-cover bg-center animate-pulse"
                style={{ backgroundImage: `url(${image})` }} 
              />
            )}
          </motion.div>
        );
      })}

      {/* Reduced opacity overlays */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }} 
      />
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(90deg, rgba(0,0,0,${gradientOpacity}) 0%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0.25) 100%)`
        }}
      />

      {/* Navigation */}
      <button
        aria-label="Previous slide"
        onClick={prevSlide}
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>

      <button
        aria-label="Next slide"
        onClick={nextSlide}
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            key={currentSlide}
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            {/* Subtitle */}
            {currentContent.subtitle && (
              <motion.div
                variants={itemVariants}
                className="text-lg sm:text-xl md:text-2xl font-light mb-4 opacity-90"
              >
                {currentContent.subtitle}
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              {currentContent.title}
            </motion.h1>

            {/* Description */}
            {currentContent.description && (
              <motion.p
                variants={itemVariants}
                className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-95"
              >
                {currentContent.description}
              </motion.p>
            )}

            {/* Buttons */}
            {currentContent.buttons && currentContent.buttons.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
              >
                {currentContent.buttons.map((b, idx) => (
                  <a
                    key={idx}
                    href={b.link}
                    className={`inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 ${
                      b.primary 
                        ? 'bg-white text-black hover:bg-gray-100 hover:scale-105' 
                        : 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-black'
                    }`}
                  >
                    <span>{b.text}</span>
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </a>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Media Type Indicator */}
      <div className="absolute top-4 right-4 z-30 bg-black/50 text-white px-3 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm">
        {currentSlideType === 1 && activeVideoIndex === currentSlide ? (
          <>
            <VideoCameraIcon className="w-4 h-4" />
            <span className="text-sm">PLAYING VIDEO</span>
          </>
        ) : currentSlideType === 1 ? (
          <>
            <VideoCameraIcon className="w-4 h-4" />
            <span className="text-sm">VIDEO SLIDE</span>
          </>
        ) : (
          <>
            <PhotoIcon className="w-4 h-4" />
            <span className="text-sm">IMAGE</span>
          </>
        )}
      </div>

      {/* Autoplay Toggle */}
      <button
        onClick={toggleAutoPlay}
        className={`absolute top-4 left-4 z-30 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 backdrop-blur-sm ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {isAutoPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
        <span className="text-sm">{isAutoPlaying ? 'Pause' : 'Play'}</span>
      </button>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <motion.button
          onClick={scrollToNext}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 text-white flex flex-col items-center gap-2"
          variants={scrollIndicatorVariants}
          animate="animate"
        >
          <span className="text-sm font-light tracking-widest">DISCOVER MORE</span>
          <ChevronDownIcon className="w-5 h-5" />
        </motion.button>
      )}

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent z-10" />
    </section>
  );
}
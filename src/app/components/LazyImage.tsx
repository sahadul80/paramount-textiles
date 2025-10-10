// components/CategoryProducts/LazyImage.tsx
import { useState } from 'react';
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  className: string;
  onLoad?: () => void;
  onError?: () => void;
  objectFit?: 'cover' | 'contain';
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className,
  onLoad,
  onError,
  objectFit = 'cover'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoaded(true);
    setHasError(true);
    onError?.();
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} role="img" aria-label={alt}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse rounded-lg" />
      )}
      {hasError && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center rounded-lg">
          <div className="text-slate-400 text-center">
            <div className="text-2xl mb-2">📷</div>
            <p className="text-sm">Image not available</p>
          </div>
        </div>
      )}
      <div className={`w-full h-full relative ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
        <Image
          src={src}
          alt={alt}
          fill
          className={`transition-all duration-700 ease-in-out ${
            isLoaded ? 'scale-100' : 'scale-105'
          }`}
          style={{ objectFit }}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  );
};

export default LazyImage;
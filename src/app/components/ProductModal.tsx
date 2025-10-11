'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiSend, FiMessageCircle } from 'react-icons/fi';
import LazyImage from './LazyImage';
import type { Product } from './types';
import { useState } from 'react';
import ParamountLoader from './Loader';

interface ProductModalProps {
  isOpen: boolean;
  selectedProduct: Product | null;
  currentCategoryProducts: Product[];
  currentProductIndex: number;
  imageLoading: boolean;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onImageLoad: () => void;
  onAction: (action: 'quote' | 'trial') => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  selectedProduct,
  currentCategoryProducts,
  currentProductIndex,
  imageLoading,
  onClose,
  onNavigate,
  onImageLoad,
  onAction
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      onNavigate('next');
    } else if (isRightSwipe) {
      onNavigate('prev');
    }
  };

  if (!selectedProduct) return null;

  return (
    <AnimatePresence>
      {isOpen && selectedProduct && (
        <div className='w-auto h-auto'>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-primary/10 backdrop-blur-3xl z-[100] rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 h-[80vh] z-[101] flex items-center justify-center p-2 sm:p-4 backdrop-blur-3xl">
            <motion.div
              className="bg-foreground w-full h-full flex flex-col overflow-auto shadow-2xl rounded-lg border-1"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-2 border-b border-slate-200 flex-shrink-0 shadow-lg border-1">
                <h2 className="text-xl font-bold truncate text-base text-center">
                  {selectedProduct.name}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg transition-all duration-300 text-base shadow-lg border-1 hover:text-primary hover:bg-secondary hover:scale-110"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex flex-row overflow-auto">
                {/* Image Section */}
                <div 
                  className="w-full h-full flex flex-col relative"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  
                  {/* Desktop Navigation Arrows */}
                  <div className="hidden sm:flex absolute top-1/2 left-1 right-1 transform -translate-y-1/2 z-10 justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('prev');
                      }}
                      className="p-1 bg-primary backdrop-blur-3xl rounded-lg shadow-lg border-1 hover:bg-secondary transition-all duration-300 hover:scale-110"
                    >
                      <FiChevronLeft size={24} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('next');
                      }}
                      className="p-1 bg-primary backdrop-blur-3xl rounded-lg shadow-lg border-1 hover:bg-secondary transition-all duration-300 hover:scale-110"
                    >
                      <FiChevronRight size={24} />
                    </button>
                  </div>

                  {/* Navigation Indicator */}
                  {currentCategoryProducts.length > 1 && (
                    <div className="absolute top-1 right-1 bg-primary/50 backdrop-blur-3xl text-xs p-1 shadow-lg border-1 rounded-lg shadow-lg z-10">
                      {currentProductIndex + 1} / {currentCategoryProducts.length}
                    </div>
                  )}

                  <div className="max-h-screen min-h-[56vh] flex-1 bg-primary backdrop-blur-3xl overflow-auto p-1">
                    {imageLoading && (
                      <ParamountLoader />
                    )}
                    <LazyImage
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-auto h-auto shadow-lg border-r"
                      onLoad={onImageLoad}
                      objectFit="contain"
                    />
                  </div>

                    {/* Mobile Navigation Dots */}
                    {currentCategoryProducts.length > 1 && (
                    <div className="flex justify-center sm:hidden space-x-3 p-2 bg-primary/50 backdrop-blur-3xl">
                        {currentCategoryProducts.map((_, index) => (
                        <button
                        key={`dot-${index}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(index < currentProductIndex ? 'prev' : 'next');
                        }}
                        className={`w-3 h-3 rounded-full border-1 transition-all duration-300 ${
                            index === currentProductIndex 
                            ? 'bg-primary scale-200 shadow-lg border-2' 
                            : 'bg-secondary backdrop-blur-3xl opacity-100'
                        }`}
                        />
                        ))}
                    </div>
                    )}
                </div>

                {/* Product Details Section */}
                <div className="w-full h-full bg-secondary backdrop-blur-3xl flex flex-col justify-between p-1 sm:p-2">
                    <h3 className="text-xl text-center font-bold text-base p-2 border-1 rounded-lg shadow-lg">
                      Product Details
                    </h3>
                    
                    <div className="bg-secondary backdrop-blur-3xl">
                      {Object.entries(selectedProduct.attributes).map(([key, value], index) => (
                        <motion.div 
                          key={`${key}-${index}`}
                          className="flex justify-between items-start bg-secondary p-2 border-b hover:bg-primary rounded-lg transition-colors duration-300"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <span className="font-bold text-base flex-shrink-0 text-md">
                            {key}:
                          </span>
                          <span className="font-normal text-base text-right text-sm flex-1 break-words">
                            {value}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                </div>
              </div>
              {/* Action Buttons */}
                    <div className="p-2 border-1 rounded-lg shadow-lg backdrop-blur-3xl flex-shrink-0">
                        <div className="flex space-x-2 backdrop-blur-3xl">
                            <button 
                            onClick={() => onAction('quote')}
                            className="w-1/2 bg-gradient-to-r from-green-400 to-emerald-500 text-base p-2 rounded-lg font-bold hover:from-emerald-500 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 hover:scale-102"
                            >
                            <FiSend size={16} />
                            Get Quote
                            </button>
                            <button 
                            onClick={() => onAction('trial')}
                            className="w-1/2 bg-gradient-to-r from-sky-400 to-indigo-500 text-base p-2 rounded-lg font-bold hover:from-indigo-500 hover:to-sky-600 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 hover:scale-102"
                            >
                            <FiMessageCircle size={16} />
                            Try On
                            </button>
                        </div>
                    </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
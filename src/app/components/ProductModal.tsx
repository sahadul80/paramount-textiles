'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiSend, FiMessageCircle } from 'react-icons/fi';
import LazyImage from './LazyImage';
import type { Product } from './types';
import { useState } from 'react';

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
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-backdrop backdrop-blur-lg z-[100] rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-2 sm:p-4">
            <motion.div
              className="bg-white w-full h-full shadow-2xl flex flex-col overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-2 border-b border-slate-200 flex-shrink-0">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 truncate text-center">
                  {selectedProduct.name}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-300 text-slate-600 hover:text-slate-800 flex-shrink-0"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="h-[100vh] flex flex-row overflow-hidden">
                {/* Image Section */}
                <div 
                  className="w-full h-full flex flex-col relative"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Desktop Navigation Arrows */}
                  <div className="hidden sm:flex absolute top-1/2 left-2 right-2 transform -translate-y-1/2 z-10 justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('prev');
                      }}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                    >
                      <FiChevronLeft size={20} className="text-slate-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('next');
                      }}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                    >
                      <FiChevronRight size={20} className="text-slate-700" />
                    </button>
                  </div>

                  {/* Navigation Indicator */}
                  {currentCategoryProducts.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs z-10">
                      {currentProductIndex + 1} / {currentCategoryProducts.length}
                    </div>
                  )}

                  <div className="flex-1 relative bg-slate-50 overflow-hidden flex items-center justify-center">
                    {imageLoading && (
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse flex items-center justify-center z-10">
                        <div className="text-slate-400 text-sm">Loading image...</div>
                      </div>
                    )}
                    <LazyImage
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full"
                      onLoad={onImageLoad}
                      objectFit="contain"
                    />
                  </div>

                  {/* Mobile Navigation Dots */}
                  {currentCategoryProducts.length > 1 && (
                    <div className="flex justify-center mb-4 sm:hidden">
                      <div className="flex space-x-2">
                        {currentCategoryProducts.map((_, index) => (
                          <button
                            key={`dot-${index}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onNavigate(index < currentProductIndex ? 'prev' : 'next');
                            }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === currentProductIndex 
                                ? 'bg-primary scale-125' 
                                : 'bg-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Details Section */}
                <div className="w-full h-full bg-card-gradient flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-2">
                    <h3 className="text-lg text-center font-bold text-slate-800 mb-3">
                      Product Details
                    </h3>
                    
                    <div className="space-y-2">
                      {Object.entries(selectedProduct.attributes).map(([key, value], index) => (
                        <motion.div 
                          key={`${key}-${index}`}
                          className="flex justify-between items-start py-2 border-b border-slate-200/60"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <span className="font-semibold text-slate-700 capitalize flex-shrink-0 mr-3 text-sm lg:text-base">
                            {key}:
                          </span>
                          <span className="text-slate-600 text-right text-xs lg:text-sm leading-relaxed flex-1 break-words">
                            {value}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
                {/* Action Buttons */}
                <div className="p-2 border-t border-slate-200/60 bg-card-gradient sm:bg-transparent">
                    <div className="flex space-x-2">
                        <button 
                        onClick={() => onAction('quote')}
                        className="w-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-2 rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm lg:text-base"
                        >
                        <FiSend size={16} />
                        Get Quote
                        </button>
                        <button 
                        onClick={() => onAction('trial')}
                        className="w-1/2 bg-primary text-white p-2 rounded-lg font-bold bg-primary-gradient-hover transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm lg:text-base"
                        >
                        <FiMessageCircle size={16} />
                        Try On
                        </button>
                    </div>
                </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
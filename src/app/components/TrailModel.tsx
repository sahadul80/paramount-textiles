'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiRotateCw, FiPause, FiPlay } from 'react-icons/fi';

interface Product {
  id: string;
  name: string;
  category: string;
  attributes: {
    [key: string]: string;
  };
  image: string;
}

interface TrailModelProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

interface Customizations {
  skinTone: 'light' | 'medium' | 'dark';
  hairStyle: 'straight' | 'curly';
  bodyShape: 'slim' | 'average' | 'athletic';
  height: 'short' | 'medium' | 'tall';
}

const TrailModel = ({ product, isOpen, onClose }: TrailModelProps) => {
  const [isRotating, setIsRotating] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [customizations, setCustomizations] = useState<Customizations>({
    skinTone: 'medium',
    hairStyle: 'straight',
    bodyShape: 'average',
    height: 'medium'
  });
  const modelRef = useRef<HTMLDivElement>(null);

  // Auto-rotation effect
  useEffect(() => {
    if (!isRotating) return;

    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [isRotating]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!modelRef.current || !isRotating) return;

    const rect = modelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    
    const deltaX = e.clientX - centerX;
    
    // Calculate rotation based on mouse position
    const newRotationY = (deltaX / rect.width) * 180;
    
    setRotation(prev => (prev + newRotationY * 0.1) % 360);
  };

  const handleCustomizationChange = <K extends keyof Customizations>(
    key: K, 
    value: Customizations[K]
  ) => {
    setCustomizations(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="z-[102] fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[80vh] flex flex-col overflow-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-2 sm:p-6 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Virtual Try-On
            </h2>
          </div>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
                {product.name}
            </p>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-300 text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
          {/* 3D Model Section */}
          <div className="w-full sm:w-2/3 p-2 sm:p-6 flex flex-col min-h-[500px]">
            <div 
              ref={modelRef}
              className="flex-1 relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-slate-200 overflow-hidden flex items-center justify-center min-h-[400px]"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsRotating(false)}
              onMouseLeave={() => setIsRotating(true)}
            >
              {/* 3D Model Container */}
              <div 
                className="w-64 h-96 relative"
                style={{
                  transform: `rotateY(${rotation}deg)`,
                  transition: isRotating ? 'transform 0.1s linear' : 'none'
                }}
              >
                {/* Model Base */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Body */}
                  <div 
                    className="w-32 h-80 rounded-full absolute"
                    style={{
                      backgroundColor: 
                        customizations.skinTone === 'light' ? '#f8d3b8' :
                        customizations.skinTone === 'medium' ? '#d2a679' :
                        '#8d5524',
                      transform: `
                        scale(${
                          customizations.bodyShape === 'slim' ? 0.9 :
                          customizations.bodyShape === 'average' ? 1 :
                          1.1
                        })
                        scaleY(${
                          customizations.height === 'short' ? 0.9 :
                          customizations.height === 'medium' ? 1 :
                          1.1
                        })
                      `
                    }}
                  />
                  
                  {/* Product Overlay */}
                  <div className="absolute w-40 h-72 bg-blue-200/60 rounded-lg border-2 border-blue-300/70 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-blue-800 text-center p-4">
                      <div className="font-bold text-lg mb-2">{product.name}</div>
                      <div className="text-sm">Virtual Try-On Preview</div>
                    </div>
                  </div>

                  {/* Hair */}
                  <div 
                    className="w-36 h-12 absolute -top-6 rounded-full"
                    style={{
                      backgroundColor: '#2c1810',
                      clipPath: 
                        customizations.hairStyle === 'straight' ? 
                          'polygon(0% 0%, 100% 0%, 100% 60%, 0% 60%)' :
                          'path("M0,0 Q20,10 40,5 Q60,0 80,8 Q100,5 120,0 Q140,10 160,0 L160,60 L0,60 Z")'
                    }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="absolute bottom-4 left-4 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className="bg-blue-600 text-white p-3 rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 min-w-[120px] justify-center"
                >
                  {isRotating ? <FiPause size={20} /> : <FiPlay size={20} />}
                  <span className="text-sm font-medium">
                    {isRotating ? 'Pause' : 'Rotate'}
                  </span>
                </button>
                <button
                  onClick={() => setRotation(0)}
                  className="bg-slate-600 text-white p-3 rounded-xl shadow-lg hover:bg-slate-700 transition-all duration-300 flex items-center gap-2 min-w-[120px] justify-center"
                >
                  <FiRotateCw size={20} />
                  <span className="text-sm font-medium">Reset View</span>
                </button>
              </div>

              {/* Rotation Indicator */}
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                {Math.round(rotation)}° Rotation
              </div>
            </div>
          </div>

          {/* Customization Panel */}
          <div className="w-full lg:w-1/3 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-4 sm:p-6 overflow-auto">
            <div className="space-y-6">
              {/* Customization Header */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Customize Model
                </h3>
                <p className="text-sm text-gray-600">
                  Adjust the model to match your preferences
                </p>
              </div>

              {/* Customization Options */}
              <div className="space-y-6">
                {/* Skin Tone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Skin Tone
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['light', 'medium', 'dark'] as const).map(tone => (
                      <button
                        key={tone}
                        onClick={() => handleCustomizationChange('skinTone', tone)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 text-sm font-medium capitalize ${
                          customizations.skinTone === tone
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Style */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Hair Style
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['straight', 'curly'] as const).map(style => (
                      <button
                        key={style}
                        onClick={() => handleCustomizationChange('hairStyle', style)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 text-sm font-medium capitalize ${
                          customizations.hairStyle === style
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body Shape */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Body Shape
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['slim', 'average', 'athletic'] as const).map(shape => (
                      <button
                        key={shape}
                        onClick={() => handleCustomizationChange('bodyShape', shape)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 text-sm font-medium capitalize ${
                          customizations.bodyShape === shape
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Height */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Height
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['short', 'medium', 'tall'] as const).map(height => (
                      <button
                        key={height}
                        onClick={() => handleCustomizationChange('height', height)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 text-sm font-medium capitalize ${
                          customizations.height === height
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {height}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="font-semibold text-gray-800 mb-4 text-lg">Product Details</h4>
                <div className="space-y-3 bg-white rounded-lg p-4 border border-slate-200">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
                      <span className="capitalize font-medium text-gray-700 text-sm">
                        {key}:
                      </span>
                      <span className="text-gray-900 font-semibold text-sm text-right">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-3">
                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                    Order Now
                  </button>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                    Save Model
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TrailModel;
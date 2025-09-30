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

const TrailModel = ({ product, isOpen, onClose }: TrailModelProps) => {
  const [isRotating, setIsRotating] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [customizations, setCustomizations] = useState({
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
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    // Calculate rotation based on mouse position
    const newRotationX = (deltaY / rect.height) * 180;
    const newRotationY = (deltaX / rect.width) * 180;
    
    setRotation(prev => (prev + newRotationY * 0.1) % 360);
  };

  const handleCustomizationChange = (key: string, value: string) => {
    setCustomizations(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="flex flex-col lg:flex-row h-full">
          {/* 3D Model Section */}
          <div className="lg:w-2/3 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Virtual Try-On: {product.name}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <div 
              ref={modelRef}
              className="flex-1 relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden flex items-center justify-center"
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
                        customizations.skinTone === 'dark' ? '#8d5524' : '#d2a679',
                      transform: `
                        scale(${
                          customizations.bodyShape === 'slim' ? 0.9 :
                          customizations.bodyShape === 'average' ? 1 :
                          customizations.bodyShape === 'athletic' ? 1.1 : 1
                        })
                        scaleY(${
                          customizations.height === 'short' ? 0.9 :
                          customizations.height === 'medium' ? 1 :
                          customizations.height === 'tall' ? 1.1 : 1
                        })
                      `
                    }}
                  />
                  
                  {/* Product Overlay */}
                  <div className="absolute w-40 h-72 bg-blue-200 bg-opacity-50 rounded-lg border-2 border-blue-300 flex items-center justify-center">
                    <div className="text-blue-800 text-center">
                      <div className="font-bold">{product.name}</div>
                      <div className="text-sm mt-2">Wearing the product</div>
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
                        customizations.hairStyle === 'curly' ?
                          'path("M0,0 Q20,10 40,5 Q60,0 80,8 Q100,5 120,0 Q140,10 160,0 L160,60 L0,60 Z")' :
                          'polygon(0% 0%, 100% 0%, 100% 60%, 0% 60%)'
                    }}
                  />
                </div>
              </div>

              {/* Rotation Controls */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  {isRotating ? <FiPause size={20} /> : <FiPlay size={20} />}
                  <span className="text-sm">{isRotating ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={() => setRotation(0)}
                  className="bg-gray-600 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
                >
                  <FiRotateCw size={20} />
                </button>
              </div>

              {/* Rotation Indicator */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {Math.round(rotation)}°
              </div>
            </div>
          </div>

          {/* Customization Panel */}
          <div className="lg:w-1/3 p-6 bg-gray-50 overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Customize Model
            </h3>

            <div className="space-y-6">
              {/* Skin Tone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skin Tone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['light', 'medium', 'dark'].map(tone => (
                    <button
                      key={tone}
                      onClick={() => handleCustomizationChange('skinTone', tone)}
                      className={`p-3 rounded-lg border-2 text-sm capitalize ${
                        customizations.skinTone === tone
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hair Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['straight', 'curly'].map(style => (
                    <button
                      key={style}
                      onClick={() => handleCustomizationChange('hairStyle', style)}
                      className={`p-3 rounded-lg border-2 text-sm capitalize ${
                        customizations.hairStyle === style
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body Shape */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Body Shape
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['slim', 'average', 'athletic'].map(shape => (
                    <button
                      key={shape}
                      onClick={() => handleCustomizationChange('bodyShape', shape)}
                      className={`p-3 rounded-lg border-2 text-sm capitalize ${
                        customizations.bodyShape === shape
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['short', 'medium', 'tall'].map(height => (
                    <button
                      key={height}
                      onClick={() => handleCustomizationChange('height', height)}
                      className={`p-3 rounded-lg border-2 text-sm capitalize ${
                        customizations.height === height
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {height}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Product Details</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-200 space-y-3">
                <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Order This Outfit
                </button>
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Save Customization
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TrailModel;
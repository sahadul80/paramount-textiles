// components/CategoryProducts/index.tsx
'use client';

import { useState, lazy, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy loaded components
const TrailModel = lazy(() => import('./TrailModel'));
const ContactFormModal = lazy(() => import('./ContactFormModal'));

// Child components
const SearchAndFilterHeader = lazy(() => import('./SearchAndFilterHeader'));
const ProductGridView = lazy(() => import('./ProductGridView'));
const ProductListView = lazy(() => import('./ProductListView'));
const ProductModal = lazy(() => import('./ProductModal'));
const LoadingState = lazy(() => import('./Loader'));
const EmptyState = lazy(() => import('./EmptyState'));

// Types
import type { Product, FilterState } from './types';

// Hooks
import { useProducts } from './hooks/useProducts';
import { useProductFilter } from './hooks/useProductFilter';

const CategoryProducts = () => {
  const { allProducts, isLoading } = useProducts();
  const {
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    clearAllFilters,
    hasActiveFilters,
    groupedProducts,
    availableFilters
  } = useProductFilter(allProducts);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentCategoryProducts, setCurrentCategoryProducts] = useState<Product[]>([]);
  const [currentProductIndex, setCurrentProductIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrailModalOpen, setIsTrailModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [imageLoading, setImageLoading] = useState(true);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setImageLoading(true);
    
    const categoryProducts = groupedProducts[product.category] || [];
    setCurrentCategoryProducts(categoryProducts);
    
    const currentIndex = categoryProducts.findIndex(p => p.id === product.id);
    setCurrentProductIndex(currentIndex);
    
    setIsModalOpen(true);
  }, [groupedProducts]);

  const navigateToProduct = useCallback((direction: 'prev' | 'next') => {
    if (currentCategoryProducts.length === 0) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentProductIndex + 1) % currentCategoryProducts.length;
    } else {
      newIndex = (currentProductIndex - 1 + currentCategoryProducts.length) % currentCategoryProducts.length;
    }
    
    setCurrentProductIndex(newIndex);
    setSelectedProduct(currentCategoryProducts[newIndex]);
    setImageLoading(true);
  }, [currentCategoryProducts, currentProductIndex]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
      setImageLoading(true);
      setCurrentCategoryProducts([]);
      setCurrentProductIndex(0);
    }, 300);
  }, []);

  const handleAction = useCallback((action: 'quote' | 'trial') => {
    if (action === 'quote') {
      setIsContactModalOpen(true);
    } else if (action === 'trial') {
      setIsTrailModalOpen(true);
    }
  }, []);

  const closeTrialModal = useCallback(() => {
    setIsTrailModalOpen(false);
  }, []);

  const closeContactModal = useCallback(() => {
    setIsContactModalOpen(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="category-products bg-page h-[80vh] w-[100vw] overflow-auto">
      <SearchAndFilterHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        handleFilterChange={handleFilterChange}
        clearAllFilters={clearAllFilters}
        hasActiveFilters={!!hasActiveFilters}
        availableFilters={availableFilters}
      />

      <div className="container">
        {viewMode === 'grid' ? (
          <ProductGridView
            groupedProducts={groupedProducts}
            onProductClick={handleProductClick}
            onImageLoad={handleImageLoad}
          />
        ) : (
          <ProductListView
            groupedProducts={groupedProducts}
            onProductClick={handleProductClick}
            onImageLoad={handleImageLoad}
          />
        )}
        
        {Object.keys(groupedProducts).length === 0 && (
          <EmptyState 
            hasActiveFilters={!!hasActiveFilters}
            onClearFilters={clearAllFilters}
          />
        )}
      </div>

      <Suspense fallback={null}>
        <ProductModal
          isOpen={isModalOpen}
          selectedProduct={selectedProduct}
          currentCategoryProducts={currentCategoryProducts}
          currentProductIndex={currentProductIndex}
          imageLoading={imageLoading}
          onClose={closeModal}
          onNavigate={navigateToProduct}
          onImageLoad={handleImageLoad}
          onAction={handleAction}
        />
      </Suspense>

      <Suspense fallback={null}>
        {selectedProduct && (
          <ContactFormModal
            product={selectedProduct}
            isOpen={isContactModalOpen}
            onClose={closeContactModal}
          />
        )}
      </Suspense>

      <Suspense fallback={
        <div className="fixed inset-0 bg-backdrop backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-2xl text-center"
          >
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
            <p className="text-slate-600 text-sm">Loading virtual try-on...</p>
          </motion.div>
        </div>
      }>
        <AnimatePresence>
          {isTrailModalOpen && selectedProduct && (
            <TrailModel
              product={selectedProduct}
              isOpen={isTrailModalOpen}
              onClose={closeTrialModal}
            />
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
};

export default CategoryProducts;
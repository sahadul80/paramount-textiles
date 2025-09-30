'use client';

import { useState, useEffect, useMemo, lazy, Suspense, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowRight, FiSearch, FiFilter, FiGrid, FiList, FiCheck, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';

// Lazy load the TrailModel component
const TrailModel = lazy(() => import('./TrailModel'));

interface Product {
  id: string;
  name: string;
  category: string;
  attributes: {
    [key: string]: string;
  };
  image: string;
}

interface FilterState {
  category: string[];
  fabric: string[];
  size: string[];
  priceRange: string[];
}

// Fixed Lazy Image Component
const LazyImage = ({ 
  src, 
  alt, 
  className,
  onLoad,
  onError,
  objectFit = 'cover'
}: { 
  src: string; 
  alt: string; 
  className: string;
  onLoad?: () => void;
  onError?: () => void;
  objectFit?: 'cover' | 'contain';
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
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
      )}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-gray-400 text-center">
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

// FilterDropdown component remains the same...
const FilterDropdown = ({
  label,
  options,
  selectedValues,
  onChange,
  isDisabled = false,
  isMultiple = true
}: {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  isDisabled?: boolean;
  isMultiple?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionToggle = (option: string) => {
    if (isMultiple) {
      const newValues = selectedValues.includes(option)
        ? selectedValues.filter(v => v !== option)
        : [...selectedValues, option];
      onChange(newValues);
    } else {
      onChange([option]);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    setSearchTerm('');
  };

  const displayText = selectedValues.length === 0 
    ? `All ${label}s`
    : selectedValues.length === 1
    ? selectedValues[0]
    : `${selectedValues.length} ${label}s selected`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        className={`w-full p-2 border-2 rounded-lg transition-all duration-300 flex items-center justify-between group cursor-pointer ${
          isDisabled
            ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
            : selectedValues.length > 0
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
        }`}
      >
        <span className="text-sm font-medium truncate">{displayText}</span>
        <div className="flex items-center gap-1">
          {selectedValues.length > 0 && (
            <span
              onClick={clearSelection}
              className="p-0.5 hover:bg-white/50 rounded transition-colors cursor-pointer"
            >
              <FiX size={12} />
            </span>
          )}
          <FiChevronDown 
            size={14} 
            className={`transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            } ${selectedValues.length > 0 ? 'text-blue-500' : 'text-slate-400'}`}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && !isDisabled && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-2xl z-[100] max-h-60 overflow-y-auto"
          >
            <div className="p-2 border-b border-slate-200">
              <div className="relative">
                <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder={`Search ${label}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="p-1 space-y-0.5 max-h-44 overflow-y-auto">
              {filteredOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 cursor-pointer transition-colors duration-150"
                >
                  <div className="relative">
                    <input
                      type={isMultiple ? "checkbox" : "radio"}
                      checked={selectedValues.includes(option)}
                      onChange={() => handleOptionToggle(option)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                      selectedValues.includes(option)
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-slate-300 bg-white'
                    }`}>
                      {selectedValues.includes(option) && (
                        <FiCheck size={12} className="text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-slate-700 flex-1 truncate">{option}</span>
                </label>
              ))}
              
              {filteredOptions.length === 0 && (
                <div className="p-2 text-center text-slate-500 text-sm">
                  No options found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CategoryProducts = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentCategoryProducts, setCurrentCategoryProducts] = useState<Product[]>([]);
  const [currentProductIndex, setCurrentProductIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrailModalOpen, setIsTrailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [imageLoading, setImageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    category: [],
    fabric: [],
    size: [],
    priceRange: []
  });

  // Enhanced fetch with error handling
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const allProds = (data.categories || []).flatMap((category: { products: Product[] }) => category.products || []);
        setAllProducts(allProds);
      } catch (error) {
        console.error('Error fetching products:', error);
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get available filter options based on current selections
  const getAvailableFilterOptions = useCallback(() => {
    let filtered = allProducts;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.values(product.attributes).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    const tempFiltered = [...filtered];

    if (filters.category.length > 0) {
      tempFiltered.filter(product => 
        filters.category.includes(product.category)
      );
    }

    if (filters.fabric.length > 0) {
      tempFiltered.filter(product => 
        filters.fabric.some(fabric => 
          product.attributes.Fabric?.toLowerCase().includes(fabric.toLowerCase())
        )
      );
    }

    if (filters.size.length > 0) {
      tempFiltered.filter(product => 
        filters.size.some(size => 
          product.attributes.Size?.toLowerCase().includes(size.toLowerCase())
        )
      );
    }

    if (filters.priceRange.length > 0) {
      tempFiltered.filter(product => {
        const priceMatch = product.attributes.Price?.match(/\$([\d.]+)/);
        const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
        return filters.priceRange.some(range => {
          switch (range) {
            case 'under25': return price < 25;
            case '25-50': return price >= 25 && price <= 50;
            case '50-100': return price > 50 && price <= 100;
            case 'over100': return price > 100;
            default: return true;
          }
        });
      });
    }

    const availableCategories = [...new Set(tempFiltered.map(p => p.category))];
    const fabricFiltered = tempFiltered;
    const availableFabrics = [...new Set(fabricFiltered.map(p => p.attributes.Fabric).filter(Boolean))];
    const sizeFiltered = fabricFiltered;
    const availableSizes = [...new Set(sizeFiltered.flatMap(p => 
      p.attributes.Size?.split(', ').map(s => s.trim()) || []
    ).filter(Boolean))];

    const availablePriceRanges = ['under25', '25-50', '50-100', 'over100'].filter(range => {
      return tempFiltered.some(product => {
        const priceMatch = product.attributes.Price?.match(/\$([\d.]+)/);
        const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
        switch (range) {
          case 'under25': return price < 25;
          case '25-50': return price >= 25 && price <= 50;
          case '50-100': return price > 50 && price <= 100;
          case 'over100': return price > 100;
          default: return true;
        }
      });
    });

    return {
      categories: availableCategories,
      fabrics: availableFabrics,
      sizes: availableSizes,
      priceRanges: availablePriceRanges
    };
  }, [allProducts, searchTerm, filters]);

  const availableFilters = getAvailableFilterOptions();

  // Enhanced filter products function with multiple selection support
  const getFilteredProducts = useCallback(() => {
    let filtered = allProducts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.values(product.attributes).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Category filter (multiple selection - OR logic)
    if (filters.category.length > 0) {
      filtered = filtered.filter(product => 
        filters.category.includes(product.category)
      );
    }

    // Fabric filter (multiple selection - OR logic)
    if (filters.fabric.length > 0) {
      filtered = filtered.filter(product => 
        filters.fabric.some(fabric => 
          product.attributes.Fabric?.toLowerCase().includes(fabric.toLowerCase())
        )
      );
    }

    // Size filter (multiple selection - OR logic)
    if (filters.size.length > 0) {
      filtered = filtered.filter(product => 
        filters.size.some(size => 
          product.attributes.Size?.toLowerCase().includes(size.toLowerCase())
        )
      );
    }

    // Price range filter (multiple selection - OR logic)
    if (filters.priceRange.length > 0) {
      filtered = filtered.filter(product => {
        const priceMatch = product.attributes.Price?.match(/\$([\d.]+)/);
        const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
        return filters.priceRange.some(range => {
          switch (range) {
            case 'under25': return price < 25;
            case '25-50': return price >= 25 && price <= 50;
            case '50-100': return price > 50 && price <= 100;
            case 'over100': return price > 100;
            default: return true;
          }
        });
      });
    }

    return filtered;
  }, [allProducts, searchTerm, filters]);

  // Group filtered products by category
  const groupedProducts = useMemo(() => {
    const filtered = getFilteredProducts();
    const groups: { [key: string]: Product[] } = {};
    
    filtered.forEach(product => {
      if (!groups[product.category]) {
        groups[product.category] = [];
      }
      groups[product.category].push(product);
    });
    
    return groups;
  }, [getFilteredProducts]);

  // Enhanced filter handlers
  const handleFilterChange = useCallback((filterType: keyof FilterState, values: string[]) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterType]: values };
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      category: [],
      fabric: [],
      size: [],
      priceRange: []
    });
    setSearchTerm('');
  }, []);

  const hasActiveFilters = 
    filters.category.length > 0 || 
    filters.fabric.length > 0 || 
    filters.size.length > 0 || 
    filters.priceRange.length > 0 || 
    searchTerm;

  // Enhanced product handlers with navigation
  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setImageLoading(true);
    
    // Find all products in the same category for navigation
    const categoryProducts = groupedProducts[product.category] || [];
    setCurrentCategoryProducts(categoryProducts);
    
    // Find current product index
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

  // Swipe handlers for mobile
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
      navigateToProduct('next');
    } else if (isRightSwipe) {
      navigateToProduct('prev');
    }
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
      setImageLoading(true);
      setCurrentCategoryProducts([]);
      setCurrentProductIndex(0);
    }, 300);
  }, []);

  const handleAction = useCallback((action: 'order' | 'trial') => {
    if (action === 'order') {
      console.log('Order now:', selectedProduct);
      closeModal();
    } else if (action === 'trial') {
      setIsTrailModalOpen(true);
    }
  }, [selectedProduct, closeModal]);

  const closeTrialModal = useCallback(() => {
    setIsTrailModalOpen(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-slate-600 text-sm">Loading fashion collection...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-h-[83vh] bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Enhanced Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="container mx-auto p-2">
          {/* Enhanced Search and Filter Section */}
          <div className="space-y-2">
            {/* Top Row - 5 Column Grid */}
            <div className="grid grid-cols-5 gap-2 items-center">
              {/* Search Input - 2 columns */}
              <div className="col-span-3 sm:col-span-2 relative">
                <FiSearch className="absolute inset-0 left-2 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm z-10" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-300 text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* View Toggle - 1 column */}
              <div className="hidden sm:flex flex bg-white/80 backdrop-blur-sm rounded-lg border border-slate-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 w-1/2 rounded-md transition-all duration-300 flex items-center justify-center gap-1 font-semibold text-sm ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <FiGrid />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 w-1/2 rounded-md transition-all duration-300 flex items-center justify-center gap-1 font-semibold text-sm ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <FiList />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>

              {/* Filter Button - 1 column */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-all duration-300 shadow-sm flex items-center justify-center gap-1 font-semibold text-sm ${
                  showFilters 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FiFilter className="w-3 h-3" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              {/* Clear Button - 1 column - Always visible but disabled when no filters */}
              <button
                onClick={clearAllFilters}
                disabled={!hasActiveFilters}
                className={`p-2 rounded-lg transition-all duration-300 flex items-center justify-center text-xs font-medium ${
                  hasActiveFilters
                    ? 'bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Clear
              </button>
            </div>

            {/* Enhanced Filter Options */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-300 shadow-2xl overflow-visible"
                >
                  <div className="p-3">
                    {/* Modern Filter Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 ">Category</label>
                        <FilterDropdown
                          label="category"
                          options={availableFilters.categories}
                          selectedValues={filters.category}
                          onChange={(values) => handleFilterChange('category', values)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Fabric</label>
                        <FilterDropdown
                          label="fabric"
                          options={availableFilters.fabrics}
                          selectedValues={filters.fabric}
                          onChange={(values) => handleFilterChange('fabric', values)}
                          isDisabled={availableFilters.categories.length === 0 && filters.category.length === 0}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Size</label>
                        <FilterDropdown
                          label="size"
                          options={availableFilters.sizes}
                          selectedValues={filters.size}
                          onChange={(values) => handleFilterChange('size', values)}
                          isDisabled={availableFilters.fabrics.length === 0 && filters.fabric.length === 0}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Price Range</label>
                        <FilterDropdown
                          label="price"
                          options={availableFilters.priceRanges.map(range => {
                            switch (range) {
                              case 'under25': return 'Under $25';
                              case '25-50': return '$25 - $50';
                              case '50-100': return '$50 - $100';
                              case 'over100': return 'Over $100';
                              default: return range;
                            }
                          })}
                          selectedValues={filters.priceRange.map(range => {
                            switch (range) {
                              case 'under25': return 'Under $25';
                              case '25-50': return '$25 - $50';
                              case '50-100': return '$50 - $100';
                              case 'over100': return 'Over $100';
                              default: return range;
                            }
                          })}
                          onChange={(values) => handleFilterChange('priceRange', values.map(v => {
                            switch (v) {
                              case 'Under $25': return 'under25';
                              case '$25 - $50': return '25-50';
                              case '$50 - $100': return '50-100';
                              case 'Over $100': return 'over100';
                              default: return v;
                            }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-2 py-3 max-h-[80vh] flex flex-col overflow-auto">
        {Object.entries(groupedProducts).map(([category, products], categoryIndex) => (
          <motion.section
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.1, ease: "easeOut" }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-3 px-2">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800">{category}</h2>
              <span className="text-slate-500 font-medium text-xs sm:text-sm">{products.length} items</span>
            </div>

            <div className={`gap-2 ${
              viewMode === 'grid' 
                ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
                : 'flex flex-col'
            }`}>
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-500 ease-in-out cursor-pointer group overflow-hidden ${
                    viewMode === 'list' ? 'flex flex-col sm:flex-row' : 'flex flex-col h-64 sm:h-72 lg:h-80'
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  onClick={() => handleProductClick(product)}
                >
                  <div className={`relative overflow-hidden ${
                    viewMode === 'list' 
                      ? 'sm:w-40 flex-shrink-0 h-40' 
                      : 'h-[70%] flex-grow-0'
                  }`}>
                    <LazyImage
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full"
                      onLoad={handleImageLoad}
                    />
                  </div>
                  
                  <div className={`p-2 ${
                    viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : 'h-[30%] flex flex-col justify-center'
                  }`}>
                    <h3 className="text-sm lg:text-base font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 text-xs lg:text-sm capitalize line-clamp-1">
                        {product.attributes.Fabric}
                      </span>
                      <span className="text-blue-500 text-xs font-medium bg-blue-50 px-1.5 py-0.5 rounded-full transition-colors duration-300 group-hover:bg-blue-100">
                        View
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}

        {Object.keys(groupedProducts).length === 0 && (
          <motion.div 
            className="text-center py-8 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-3xl sm:text-4xl mb-3">🔍</div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-700 mb-1">No designs found</h3>
            <p className="text-slate-500 text-xs sm:text-sm lg:text-base mb-3">Try adjusting your search or filters</p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-medium text-sm"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Fixed Enhanced Responsive Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProduct && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={closeModal}
            />
            
            {/* Modal Content */}
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-2 sm:p-4">
              <motion.div
                className="bg-white w-full h-full sm:w-full sm:max-h-[90vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-200 flex-shrink-0">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 truncate pr-2">
                    {selectedProduct.name}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-300 text-slate-600 hover:text-slate-800 flex-shrink-0"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
                  {/* Image Section */}
                  <div 
                    className="w-full h-1/2 sm:h-full sm:w-1/2 flex flex-col border-b sm:border-b-0 sm:border-r border-slate-200 relative"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* Navigation Arrows - Desktop Only */}
                    <div className="hidden sm:flex absolute top-1/2 left-2 right-2 transform -translate-y-1/2 z-10 justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToProduct('prev');
                        }}
                        className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                      >
                        <FiChevronLeft size={20} className="text-slate-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToProduct('next');
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
                        onLoad={handleImageLoad}
                        objectFit="contain"
                      />
                    </div>

                    {/* Mobile Navigation Dots */}
                    {currentCategoryProducts.length > 1 && (
                      <div className="flex justify-center py-3 sm:hidden">
                        <div className="flex space-x-2">
                          {currentCategoryProducts.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentProductIndex(index);
                                setSelectedProduct(currentCategoryProducts[index]);
                                setImageLoading(true);
                              }}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentProductIndex 
                                  ? 'bg-blue-500 scale-125' 
                                  : 'bg-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Details Section */}
                  <div className="w-full h-1/2 sm:h-full sm:w-1/2 bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 mb-3">
                        Product Details
                      </h3>
                      
                      <div className="space-y-2">
                        {Object.entries(selectedProduct.attributes).map(([key, value]) => (
                          <motion.div 
                            key={key} 
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

                    {/* Action Buttons */}
                    <div className="p-4 border-t border-slate-200/60 bg-gradient-to-b from-blue-50 to-purple-50 sm:bg-transparent">
                      <div className="space-y-2">
                        <button 
                          onClick={() => handleAction('order')}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm lg:text-base"
                        >
                          Order Now
                          <FiArrowRight size={16} />
                        </button>
                        <button 
                          onClick={() => handleAction('trial')}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm lg:text-base"
                        >
                          Try in Virtual Model
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Trail Model Modal */}
      <Suspense fallback={
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-2xl text-center"
          >
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
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
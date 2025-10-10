// components/CategoryProducts/hooks/useProductFilter.ts
import { useState, useCallback, useMemo } from 'react';
import type { Product, FilterState, AvailableFilters } from '../types';

export const useProductFilter = (allProducts: Product[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    fabric: [],
    size: [],
    priceRange: []
  });

  const handleFilterChange = useCallback((filterType: keyof FilterState, values: string[]) => {
    setFilters(prev => ({ ...prev, [filterType]: values }));
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

  const hasActiveFilters = useMemo(() => 
    filters.category.length > 0 || 
    filters.fabric.length > 0 || 
    filters.size.length > 0 || 
    filters.priceRange.length > 0 || 
    searchTerm,
    [filters, searchTerm]
  );

  // Compute available filter options
  const availableFilters = useMemo((): AvailableFilters => {
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

  // Filter products based on search and selected filters
  const filteredProducts = useMemo(() => {
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

    if (filters.category.length > 0) {
      filtered = filtered.filter(product => 
        filters.category.includes(product.category)
      );
    }

    if (filters.fabric.length > 0) {
      filtered = filtered.filter(product => 
        filters.fabric.some(fabric => 
          product.attributes.Fabric?.toLowerCase().includes(fabric.toLowerCase())
        )
      );
    }

    if (filters.size.length > 0) {
      filtered = filtered.filter(product => 
        filters.size.some(size => 
          product.attributes.Size?.toLowerCase().includes(size.toLowerCase())
        )
      );
    }

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

  // Group the filtered products by category
  const groupedProducts = useMemo(() => {
    const groups: { [key: string]: Product[] } = {};
    
    filteredProducts.forEach(product => {
      if (!groups[product.category]) {
        groups[product.category] = [];
      }
      groups[product.category].push(product);
    });
    
    return groups;
  }, [filteredProducts]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    clearAllFilters,
    hasActiveFilters,
    groupedProducts,
    availableFilters
  };
};
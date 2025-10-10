import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import FilterDropdown from './FilterDropdown';
import type { FilterState, AvailableFilters } from './types';

interface SearchAndFilterHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: FilterState;
  handleFilterChange: (filterType: keyof FilterState, values: string[]) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  availableFilters: AvailableFilters;
}

const SearchAndFilterHeader: React.FC<SearchAndFilterHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  showFilters,
  setShowFilters,
  filters,
  handleFilterChange,
  clearAllFilters,
  hasActiveFilters,
  availableFilters
}) => {
  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
      <div className="container p-1 sm:p-2">
        <div className="space-y-1 sm:space-y-2">
          <div className="grid grid-cols-5 gap-1 items-center">
            {/* Search Input */}
            <div className="col-span-2 relative">
              <FiSearch className="absolute inset-0 left-2 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm z-10" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2 py-1 sm:py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-300 text-slate-700 placeholder-slate-400"
              />
            </div>

            {/* View Toggle */}
            <div className="flex bg-white/80 backdrop-blur-xl rounded-lg border border-slate-300">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 w-1/2 rounded-md transition-all duration-300 flex items-center justify-center gap-1 font-semibold text-sm ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-white shadow-sm' 
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
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <FiList />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-all duration-300 shadow-sm flex items-center justify-center gap-1 font-semibold text-sm ${
                showFilters 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FiFilter className="w-3 h-3" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            {/* Clear Button */}
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

          {/* Filter Options */}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Category</label>
                      <FilterDropdown
                        label="category"
                        options={availableFilters.categories}
                        selectedValues={filters.category}
                        onChange={(values) => handleFilterChange('category', values)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Fabric</label>
                      <FilterDropdown
                        label="fabric"
                        options={availableFilters.fabrics}
                        selectedValues={filters.fabric}
                        onChange={(values) => handleFilterChange('fabric', values)}
                        isDisabled={availableFilters.categories.length === 0 && filters.category.length === 0}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Size</label>
                      <FilterDropdown
                        label="size"
                        options={availableFilters.sizes}
                        selectedValues={filters.size}
                        onChange={(values) => handleFilterChange('size', values)}
                        isDisabled={availableFilters.fabrics.length === 0 && filters.fabric.length === 0}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Price Range</label>
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
  );
};

export default SearchAndFilterHeader;
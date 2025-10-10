// components/CategoryProducts/EmptyState.tsx
import { motion } from 'framer-motion';

interface EmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasActiveFilters, onClearFilters }) => {
  return (
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
            onClick={onClearFilters}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all duration-300 font-medium text-sm"
          >
            Clear all filters
          </button>
        )}
    </motion.div>
  );
};

export default EmptyState;
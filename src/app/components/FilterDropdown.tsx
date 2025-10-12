// components/CategoryProducts/FilterDropdown.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSearch, FiCheck, FiChevronDown } from 'react-icons/fi';

interface FilterDropdownProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  isDisabled?: boolean;
  isMultiple?: boolean;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  isDisabled = false,
  isMultiple = true
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
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        className={`w-full p-1 border-2 rounded-xl transition-all duration-300 flex items-center justify-between group focus-ring ${
          isDisabled
            ? 'border-border/50 bg-muted/50 text-foreground cursor-not-allowed'
            : selectedValues.length > 0
            ? 'border-primary bg-primary/10 text-primary hover:border-primary/80'
            : 'border-border bg-card text-secondary hover:border-border/80 hover:bg-foreground'
        }`}
      >
        <span className="text-sm sm:text-md font-medium truncate">{displayText}</span>
        <div className="flex items-center gap-1">
          {selectedValues.length > 0 && (
            <span
              onClick={clearSelection}
              className="p-1 hover:bg-background/50 rounded-lg transition-colors cursor-pointer"
            >
              <FiX size={14} />
            </span>
          )}
          <FiChevronDown 
            size={16} 
            className={`transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            } ${selectedValues.length > 0 ? 'text-primary' : 'text-secondary'}`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && !isDisabled && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute glass rounded-xl shadow-lg z-[100] overflow-hidden border border-border/20"
          >
                {/* Search Input */}
                <div className="p-1 border-b border-border/20">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm" />
                    <input
                    type="text"
                    placeholder={`Search ${label}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-1.5 text-sm bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary focus-ring transition-all duration-200"
                    onClick={(e) => e.stopPropagation()}
                    />
                </div>
                </div>

                {/* Options List */}
                <div className="p-1 space-y-2 max-h-60 overflow-y-auto">
                {filteredOptions.map((option) => (
                    <label
                    key={`${label}-${option}`}
                    className="flex items-center gap-1 p-1 rounded-lg hover:bg-foreground cursor-pointer transition-all duration-200 group"
                    >
                    <div className="relative flex items-center justify-center">
                        <input
                        type={isMultiple ? "checkbox" : "radio"}
                        checked={selectedValues.includes(option)}
                        onChange={() => handleOptionToggle(option)}
                        className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                        selectedValues.includes(option)
                            ? 'bg-primary border-primary shadow-lg shadow-primary/25'
                            : 'border-border bg-background group-hover:border-primary/50'
                        }`}>
                        {selectedValues.includes(option) && (
                            <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                            <FiCheck size={14} className="text-foreground border-1" />
                            </motion.div>
                        )}
                        </div>
                    </div>
                    <span className="text-sm sm:text-md text-card-foreground flex-1 truncate font-medium">
                        {option}
                    </span>
                    </label>
                ))}
                
                {filteredOptions.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                    No {label.toLowerCase()} found
                    </div>
                )}
                </div>

                {/* Selected Count */}
                {isMultiple && selectedValues.length > 0 && (
                <div className="p-3 border-t border-border/20 bg-primary/5">
                    <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                        {selectedValues.length} selected
                    </span>
                    <button
                        onClick={clearSelection}
                        className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 focus-ring rounded px-2 py-1"
                    >
                        Clear all
                    </button>
                    </div>
                </div>
                )}
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterDropdown;
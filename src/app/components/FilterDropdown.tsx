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
      <div
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        className={`w-full p-2 border-2 rounded-lg transition-all duration-300 flex items-center justify-between group cursor-pointer ${
          isDisabled
            ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
            : selectedValues.length > 0
            ? 'border-primary bg-blue-50 text-blue-700'
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
            } ${selectedValues.length > 0 ? 'text-primary' : 'text-slate-400'}`}
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
                  className="w-full pl-8 pr-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="p-1 space-y-0.5 max-h-44 overflow-y-auto">
              {filteredOptions.map((option) => (
                <label
                  key={`${label}-${option}`}
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
                        ? 'bg-primary border-primary'
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

export default FilterDropdown;
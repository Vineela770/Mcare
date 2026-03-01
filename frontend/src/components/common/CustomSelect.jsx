import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Select an option',
  className = '',
  icon: Icon = null,
  showCheckmark = true,
  optionLabels = {} // Optional: map of value -> label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get display label for an option
  const getLabel = (option) => {
    return optionLabels[option] || option;
  };

  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    getLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange({ target: { value: option } });
    setIsOpen(false);
    setSearchTerm('');
  };

  const displayValue = value === 'all' ? placeholder : getLabel(value);

  return (
    <div ref={selectRef} className={`relative ${isOpen ? 'z-[100]' : 'z-10'} ${className}`}>
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="w-5 h-5 text-gray-400" />}
          <span className={value === 'all' ? 'text-gray-500' : 'text-gray-900'}>
            {displayValue}
          </span>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[110] w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden max-h-64 overflow-y-auto">
          {/* Search Input (optional - only show if many options) */}
          {options.length > 8 && (
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = value === option;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between
                      ${isSelected 
                        ? 'bg-emerald-500 text-white font-medium' 
                        : 'text-gray-900 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                  >
                    <span>{getLabel(option)}</span>
                    {showCheckmark && isSelected && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomDropdown = ({ 
  name,
  value, 
  onChange, 
  options = [], 
  placeholder = 'Select',
  disabled = false,
  className = '',
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (selectedValue) => {
    onChange({ target: { name, value: selectedValue } });
    setIsOpen(false);
  };

  // Find the display label for the current value
  const getDisplayLabel = () => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : placeholder;
  };

  const displayLabel = getDisplayLabel();
  const showPlaceholder = !value || value === '';

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full text-left focus:outline-none focus:ring-2 focus:ring-emerald-600 transition flex items-center justify-between ${
          compact 
            ? 'bg-transparent text-gray-700 font-medium cursor-pointer py-0' 
            : 'px-4 py-3 border border-gray-300 rounded-lg hover:border-emerald-400 bg-white'
        } ${
          disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer'
        } ${showPlaceholder && !compact ? 'text-gray-400' : 'text-gray-900'}`}
      >
        <span>{displayLabel}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ml-1 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto" style={{ zIndex: 9999 }}>
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option.value)}
              className={`px-4 py-3 cursor-pointer transition flex items-center justify-between ${
                value === option.value 
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-500 text-white' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50'
              }`}
            >
              <span>{option.label}</span>
              {value === option.value && <Check className="w-4 h-4" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;

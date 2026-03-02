import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const FilterDropdown = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Select',
  disabled = false,
  className = ''
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
    onChange(selectedValue);
    setIsOpen(false);
  };

  const displayValue = value || placeholder;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full min-w-[160px] px-5 py-2 bg-white border rounded-full text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition flex items-center justify-center gap-2 ${
          disabled 
            ? 'opacity-50 cursor-not-allowed bg-gray-50' 
            : 'cursor-pointer'
        } ${value ? 'text-gray-900' : 'text-gray-500'}`}
      >
        <span className="flex-1 text-center">{displayValue}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option.value)}
              className={`px-4 py-2.5 cursor-pointer hover:bg-emerald-50 transition ${
                value === option.value 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                  : 'text-gray-700'
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;

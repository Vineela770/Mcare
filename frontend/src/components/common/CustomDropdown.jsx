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
  const [menuStyle, setMenuStyle] = useState({});
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Compute fixed position from button rect whenever opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const updatePosition = () => {
        const rect = buttonRef.current.getBoundingClientRect();
        setMenuStyle({
          position: 'fixed',
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
          zIndex: 99999,
        });
      };
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current && !buttonRef.current.contains(event.target) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target)
      ) {
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

  const getDisplayLabel = () => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : placeholder;
  };

  const displayLabel = getDisplayLabel();
  const showPlaceholder = !value || value === '';

  return (
    <div className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full text-left focus:outline-none focus:ring-2 focus:ring-emerald-600 transition flex items-center justify-between ${
          compact 
            ? 'px-3 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium cursor-pointer hover:border-emerald-400' 
            : 'px-4 py-3 border border-gray-300 rounded-lg hover:border-emerald-400 bg-white'
        } ${
          isOpen ? 'border-emerald-500 ring-2 ring-emerald-500' : ''
        } ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${showPlaceholder && !compact ? 'text-gray-400' : 'text-gray-900'}`}
      >
        <span>{displayLabel}</span>
        <ChevronDown className={`w-4 h-4 text-emerald-600 transition-transform ml-1 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu — fixed positioned so it always renders above all content */}
      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          style={menuStyle}
          className="bg-white border border-emerald-200 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
        >
          {options.map((option, index) => (
            <div
              key={index}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(option.value); }}
              className={`px-4 py-3 cursor-pointer transition flex items-center justify-between ${
                value === option.value 
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-medium' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 hover:text-emerald-800'
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

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
  compact = false,
  greenTheme = false,
  borderClass = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-400 transition flex items-center justify-between ${
          compact 
            ? `px-3 py-3 ${borderClass ? '' : 'bg-white'} ${borderClass || 'border border-gray-300'} rounded-lg text-gray-700 font-medium cursor-pointer hover:border-blue-400` 
            : `px-4 py-3 ${borderClass || 'border border-gray-300'} rounded-lg hover:border-blue-400 ${borderClass ? '' : 'bg-white'}`
        } ${
          isOpen ? 'border-emerald-500 ring-2 ring-emerald-500' : ''
        } ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${showPlaceholder && !compact ? 'text-gray-400' : 'text-gray-900'}`}
      >
        <span>{displayLabel}</span>
        <ChevronDown className={`w-4 h-4 text-emerald-600 transition-transform ml-1 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu — absolute so it aligns directly under the button */}
      {isOpen && !disabled && (
        <div
          className="absolute left-0 right-0 top-full mt-1 bg-white border border-emerald-200 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
          style={{ zIndex: 9999 }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(option.value); }}
              className={`px-4 py-3 cursor-pointer transition flex items-center justify-between ${
                value === option.value 
                  ? (greenTheme 
                      ? 'text-white font-semibold' 
                      : 'bg-gradient-to-r from-emerald-600 to-green-500 text-white font-medium')
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 hover:text-emerald-800 hover:font-medium'
              }`}
              style={{
                background: value === option.value && greenTheme
                  ? 'linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)'
                  : value === option.value ? '#10b981' : 'transparent',
                backgroundColor: value === option.value && !greenTheme ? '#10b981' : 'transparent',
                color: value === option.value ? 'white' : '#374151',
                borderRadius: greenTheme && value === option.value ? '6px' : '0',
                margin: greenTheme && value === option.value ? '2px 4px' : '0'
              }}
              onMouseEnter={(e) => {
                if (value !== option.value) {
                  e.target.style.backgroundColor = greenTheme ? '#d1fae5' : '#ecfdf5';
                  e.target.style.color = '#047857';
                  if (greenTheme) {
                    e.target.style.background = 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)';
                    e.target.style.borderRadius = '4px';
                    e.target.style.margin = '1px 4px';
                  }
                }
              }}
              onMouseLeave={(e) => {
                if (value !== option.value) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#374151';
                  if (greenTheme) {
                    e.target.style.background = 'transparent';
                    e.target.style.borderRadius = '0';
                    e.target.style.margin = '0';
                  }
                }
              }}
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

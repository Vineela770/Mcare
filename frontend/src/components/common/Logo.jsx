import React from 'react';

const Logo = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const subtextSizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div className="flex items-center gap-2">
      {/* Logo Icon - Sun/M Design */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sun rays */}
          <g fill="#0891B2" opacity="0.9">
            {/* Top ray */}
            <path d="M 50 5 L 55 25 L 45 25 Z" />
            {/* Top right rays */}
            <path d="M 75 15 L 60 30 L 70 40 Z" />
            <path d="M 85 25 L 70 35 L 75 50 Z" />
            {/* Right ray */}
            <path d="M 95 50 L 75 55 L 75 45 Z" />
            {/* Bottom right rays */}
            <path d="M 85 75 L 75 60 L 70 70 Z" />
            <path d="M 75 85 L 70 65 L 60 70 Z" />
            {/* Bottom ray */}
            <path d="M 50 95 L 45 75 L 55 75 Z" />
            {/* Bottom left rays */}
            <path d="M 25 85 L 30 65 L 40 70 Z" />
            <path d="M 15 75 L 25 60 L 30 70 Z" />
            {/* Left ray */}
            <path d="M 5 50 L 25 45 L 25 55 Z" />
            {/* Top left rays */}
            <path d="M 15 25 L 30 35 L 25 50 Z" />
            <path d="M 25 15 L 40 30 L 30 40 Z" />
          </g>

          {/* Center circle with M */}
          <circle cx="50" cy="50" r="28" fill="#0891B2" />
          <circle cx="50" cy="50" r="24" fill="#06B6D4" />

          {/* M Letter */}
          <text
            x="50"
            y="60"
            textAnchor="middle"
            fontSize="32"
            fontWeight="bold"
            fill="white"
            fontFamily="Arial, sans-serif"
          >
            M
          </text>

          {/* Red accent dot (optional, but visible in logo) */}
          <circle cx="50" cy="35" r="4" fill="#DC2626" />
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <div>
          <span className={`${textSizes[size]} font-bold text-cyan-600`}>MCARE</span>
          <span className={`${textSizes[size]} font-bold text-gray-900 ml-1`}>JOBS</span>
        </div>
        <span className={`${subtextSizes[size]} text-gray-500`}>Job Search Here</span>
      </div>
    </div>
  );
};

export default Logo;

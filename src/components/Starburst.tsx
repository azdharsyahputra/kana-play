import React from 'react';

interface StarburstProps {
  children: React.ReactNode;
  variant?: 'yellow' | 'blue' | 'red' | 'white';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  rotation?: number;
}

export const Starburst: React.FC<StarburstProps> = ({
  children,
  variant = 'yellow',
  className = '',
  size = 'md',
  rotation = -4,
}) => {
  const bgColors = {
    yellow: 'bg-[#ffd200] text-[#0b1a3d] border-[#0b1a3d]',
    blue: 'bg-[#0c389c] text-[#ffffff] border-[#071e54]',
    red: 'bg-[#d9261c] text-[#ffffff] border-[#73130d]',
    white: 'bg-[#ffffff] text-[#0b1a3d] border-[#0b1a3d]',
  };

  const sizeStyles = {
    sm: 'p-2 text-xs font-black min-w-[56px] min-h-[56px]',
    md: 'p-3 text-sm font-black min-w-[80px] min-h-[80px]',
    lg: 'p-4 text-base font-black min-w-[105px] min-h-[105px]',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center text-center font-bungee tracking-wider drop-shadow-md select-none transition-transform hover:scale-105 ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* SVG 16-point Starburst */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[2px_3px_0px_rgba(11,26,61,0.9)]"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path
          className={
            variant === 'yellow'
              ? 'fill-[#ffd200] stroke-[#0b1a3d] stroke-[3]'
              : variant === 'blue'
              ? 'fill-[#0c389c] stroke-[#071e54] stroke-[3]'
              : variant === 'red'
              ? 'fill-[#d9261c] stroke-[#73130d] stroke-[3]'
              : 'fill-[#ffffff] stroke-[#0b1a3d] stroke-[3]'
          }
          d="M50 0 L61 22 L85 10 L80 34 L100 50 L80 66 L85 90 L61 78 L50 100 L39 78 L15 90 L20 66 L0 50 L20 34 L15 10 L39 22 Z"
        />
      </svg>
      <div className={`relative z-10 flex flex-col items-center justify-center text-center leading-tight ${bgColors[variant].split(' ')[1]} ${sizeStyles[size]}`}>
        {children}
      </div>
    </div>
  );
};

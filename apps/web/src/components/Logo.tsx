import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  isDark?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '',
  isDark = false 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/Cultiva-Photoroom.png" 
        alt="Cultiva Logo" 
        className={`${sizeClasses[size]} object-contain drop-shadow-sm transition-transform hover:scale-105`}
      />
      {showText && (
        <span className={`${textSizes[size]} font-semibold tracking-tight font-quicksand ${
          isDark ? 'text-emerald-100' : 'text-emerald-900'
        }`}>
          Cultiva
        </span>
      )}
    </div>
  );
};

export default Logo;

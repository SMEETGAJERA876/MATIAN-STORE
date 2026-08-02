import React from 'react';

interface MatrinLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'white';
}

export const MatrinLogo: React.FC<MatrinLogoProps> = ({
  className = 'h-9',
  variant = 'full',
}) => {
  if (variant === 'icon') {
    return (
      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0B3A75] to-[#1F5EFF] flex items-center justify-center text-white shadow-soft font-black text-xl tracking-tighter ${className}`}>
        <span className="italic relative flex items-center justify-center">
          M
          <span className="absolute -top-1.5 -right-1 text-amber-300 text-xs font-normal">✦</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <img
        src="/matrin-logo.svg"
        alt="MATRIN Enterprise Logo"
        className="h-full w-auto object-contain drop-shadow-xs dark:brightness-125 dark:contrast-125 transition-all"
      />
    </div>
  );
};

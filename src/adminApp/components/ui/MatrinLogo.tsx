import React from 'react';

interface MatrinLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'white';
}

export const MatrinLogo: React.FC<MatrinLogoProps> = ({
  className = 'h-10',
  variant = 'full',
}) => {
  if (variant === 'icon') {
    return (
      <div className={`w-10 h-10 rounded-xl overflow-hidden bg-white p-1.5 flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}>
        <img
          src="/images/matrin-logo-sticker.webp"
          alt="MATRIN Logo Icon"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  if (variant === 'white') {
    return (
      <div className={`flex items-center select-none ${className}`}>
        <img
          src="/images/matrin-logo-sticker.webp"
          alt="MATRIN Enterprise Logo White"
          className="h-full w-auto object-contain max-h-9 brightness-0 invert"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center select-none ${className}`}>
      <div className="h-full py-1 px-2 flex items-center justify-center">
        <img
          src="/images/matrin-logo-sticker.webp"
          alt="MATRIN Enterprise Logo"
          className="h-full w-auto object-contain max-h-10"
        />
      </div>
    </div>
  );
};

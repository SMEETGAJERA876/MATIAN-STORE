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
      <div className={`w-10 h-10 rounded-xl overflow-hidden bg-white p-1 flex items-center justify-center shadow-soft border border-slate-200 dark:border-slate-700 ${className}`}>
        <img
          src="/matrin-logo.png"
          alt="MATRIN Logo Icon"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 select-none overflow-hidden ${className}`}>
      <div className="h-full py-0.5 px-1 bg-white/95 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center">
        <img
          src="/matrin-logo.png"
          alt="MATRIN Enterprise Logo"
          className="h-full w-auto object-contain max-h-8"
        />
      </div>
    </div>
  );
};

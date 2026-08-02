import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl active:scale-[0.98]';

  const variants = {
    primary:
      'bg-matrin-primary hover:bg-matrin-primary-dark text-white shadow-soft focus:ring-matrin-primary',
    secondary:
      'bg-matrin-secondary hover:bg-matrin-secondary-hover text-white shadow-glow focus:ring-matrin-secondary',
    outline:
      'border border-matrin-border dark:border-matrin-darkborder bg-white dark:bg-matrin-darkcard text-matrin-text dark:text-matrin-darktext hover:bg-matrin-bg dark:hover:bg-slate-800 focus:ring-matrin-primary',
    ghost:
      'text-matrin-gray hover:text-matrin-text hover:bg-matrin-lightgray dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white',
    danger:
      'bg-matrin-danger hover:bg-red-600 text-white shadow-soft focus:ring-matrin-danger',
    dark:
      'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white focus:ring-slate-900',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

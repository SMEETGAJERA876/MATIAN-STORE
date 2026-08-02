import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  description = 'There are no records matching your current filter criteria or search query.',
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center my-6 bg-matrin-bg/50 dark:bg-slate-900/30 border border-dashed border-matrin-border dark:border-matrin-darkborder rounded-3xl">
      <div className="w-16 h-16 rounded-2xl bg-matrin-primary/10 text-matrin-primary dark:text-blue-400 flex items-center justify-center mb-4">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-matrin-text dark:text-matrin-darktext mb-1">
        {title}
      </h3>
      <p className="text-sm text-matrin-gray dark:text-slate-400 max-w-md mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

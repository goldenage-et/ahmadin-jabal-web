'use client';

import { cn } from '@/lib/utils';
type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>{title}</h1>
        {description && <p className='text-gray-600 mt-1'>{description}</p>}
      </div>
      {actions && <div className='flex items-center space-x-2'>{actions}</div>}
    </div>
  );
}

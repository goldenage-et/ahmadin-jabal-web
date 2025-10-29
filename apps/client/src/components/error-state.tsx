'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertCircle, RefreshCw } from 'lucide-react';
type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn('min-h-screen flex items-center justify-center', className)}
    >
      <div className='text-center max-w-md mx-auto px-4'>
        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <AlertCircle className='h-8 w-8 text-red-600' />
        </div>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>{title}</h2>
        <p className='text-gray-600 mb-6'>{message}</p>
        {onRetry && (
          <Button onClick={onRetry} className='flex items-center gap-2'>
            <RefreshCw className='h-4 w-4' />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

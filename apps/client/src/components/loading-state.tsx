'use client';

import { cn } from '@/lib/utils';
type LoadingStateProps = {
  message?: string;
  className?: string;
};

export function LoadingState({
  message = 'Loading...',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn('min-h-screen flex items-center justify-center', className)}
    >
      <div className='text-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto'></div>
        <p className='mt-4 text-gray-600'>{message}</p>
      </div>
    </div>
  );
}

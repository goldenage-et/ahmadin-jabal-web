'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onResetFilters: () => void;
}

export function EmptyState({ onResetFilters }: EmptyStateProps) {
  return (
    <div className='col-span-full text-center py-16'>
      <div className='max-w-md mx-auto'>
        <div className='w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center'>
          <AlertCircle className='h-12 w-12 text-gray-400' />
        </div>
        <h3 className='text-2xl font-bold text-gray-900 dark:text-gray-400 mb-4'>
          No Books Found
        </h3>
        <p className='text-gray-600 mb-8'>
          Try adjusting your filters or search terms to find what you're looking
          for.
        </p>
        <Button onClick={onResetFilters} variant='outline'>
          <RefreshCw className='h-4 w-4 mr-2' />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}

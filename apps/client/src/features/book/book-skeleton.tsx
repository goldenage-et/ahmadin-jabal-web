'use client';

import { Card, CardContent } from '@/components/ui/card';

type ViewMode = 'grid' | 'list';

interface BookSkeletonProps {
  viewMode: ViewMode;
}

export function BookSkeleton({ viewMode }: BookSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <Card className='overflow-hidden animate-pulse'>
        <div className='flex'>
          <div className='w-32 h-32 bg-gray-200 flex-shrink-0' />
          <CardContent className='flex-1 p-4'>
            <div className='h-4 bg-gray-200 rounded mb-2' />
            <div className='h-3 bg-gray-200 rounded w-2/3 mb-2' />
            <div className='h-3 bg-gray-200 rounded w-1/3 mb-4' />
            <div className='h-8 bg-gray-200 rounded' />
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className='overflow-hidden animate-pulse'>
      <div className='aspect-square bg-gray-200' />
      <CardContent className='p-3'>
        <div className='h-4 bg-gray-200 rounded mb-2' />
        <div className='h-3 bg-gray-200 rounded w-2/3 mb-2' />
        <div className='h-3 bg-gray-200 rounded w-1/3' />
      </CardContent>
    </Card>
  );
}

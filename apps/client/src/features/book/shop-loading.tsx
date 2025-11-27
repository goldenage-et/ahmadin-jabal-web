'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ShopLoadingSkeleton() {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header Skeleton */}
      <div className='bg-white border-b sticky top-28 z-40'>
        <div className='px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
            <div>
              <Skeleton className='h-8 w-32 mb-2' />
              <Skeleton className='h-4 w-48' />
            </div>
            <div className='w-full lg:w-96'>
              <Skeleton className='h-10 w-full rounded-full' />
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 sm:px-6 lg:px-8 py-6'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Filters Sidebar Skeleton */}
          <div className='hidden lg:block w-64 space-y-6'>
            <Card>
              <CardContent className='p-4'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <Skeleton className='h-6 w-16' />
                    <Skeleton className='h-6 w-12' />
                  </div>
                  <div className='space-y-3'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-6 w-full' />
                    <div className='flex justify-between'>
                      <Skeleton className='h-3 w-8' />
                      <Skeleton className='h-3 w-12' />
                    </div>
                  </div>
                  <div className='space-y-3'>
                    <Skeleton className='h-4 w-20' />
                    <div className='space-y-2'>
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className='flex items-center space-x-2'>
                          <Skeleton className='h-4 w-4' />
                          <Skeleton className='h-4 w-24' />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Skeleton */}
          <div className='flex-1'>
            {/* Toolbar Skeleton */}
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center space-x-4'>
                <Skeleton className='h-8 w-16 lg:hidden' />
                <Skeleton className='h-4 w-32' />
              </div>
              <div className='flex items-center space-x-4'>
                <Skeleton className='h-10 w-48' />
                <Skeleton className='h-8 w-16' />
              </div>
            </div>

            {/* Books Grid Skeleton */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {[...Array(12)].map((_, i) => (
                <Card key={i} className='overflow-hidden'>
                  <Skeleton className='aspect-square w-full' />
                  <CardContent className='p-3'>
                    <Skeleton className='h-4 w-3/4 mb-2' />
                    <div className='flex items-center mb-2'>
                      <div className='flex space-x-1'>
                        {[...Array(5)].map((_, j) => (
                          <Skeleton key={j} className='h-3 w-3' />
                        ))}
                      </div>
                      <Skeleton className='h-3 w-8 ml-1' />
                    </div>
                    <div className='flex items-center justify-between mb-3'>
                      <Skeleton className='h-4 w-16' />
                      <Skeleton className='h-3 w-12' />
                    </div>
                    <Skeleton className='h-8 w-full' />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {[...Array(count)].map((_, i) => (
        <Card key={i} className='overflow-hidden animate-pulse'>
          <Skeleton className='aspect-square w-full' />
          <CardContent className='p-3'>
            <Skeleton className='h-4 w-3/4 mb-2' />
            <div className='flex items-center mb-2'>
              <div className='flex space-x-1'>
                {[...Array(5)].map((_, j) => (
                  <Skeleton key={j} className='h-3 w-3' />
                ))}
              </div>
              <Skeleton className='h-3 w-8 ml-1' />
            </div>
            <div className='flex items-center justify-between mb-3'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-3 w-12' />
            </div>
            <Skeleton className='h-8 w-full' />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

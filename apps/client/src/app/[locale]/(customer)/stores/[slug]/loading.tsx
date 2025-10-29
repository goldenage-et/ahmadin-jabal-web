import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Store Header Skeleton */}
      <div className='bg-white border-b'>
        <div className='bg-gray-800 text-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center justify-between py-3'>
              <div className='flex items-center space-x-4'>
                <Skeleton className='h-12 w-12 rounded-full' />
                <div>
                  <Skeleton className='h-5 w-48 mb-2' />
                  <Skeleton className='h-4 w-32' />
                </div>
              </div>
              <div className='flex items-center space-x-3'>
                <Skeleton className='h-8 w-20' />
                <Skeleton className='h-8 w-24' />
              </div>
              <div className='flex-1 max-w-md mx-8'>
                <Skeleton className='h-10 w-full' />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner Skeleton */}
      <div className='bg-yellow-400'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='flex items-center justify-between'>
            <div className='flex-1'>
              <Skeleton className='h-4 w-48 mb-2' />
              <Skeleton className='h-16 w-96 mb-6' />
            </div>
            <div className='flex-1 flex justify-end'>
              <Skeleton className='h-32 w-32' />
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed Skeleton */}
      <div className='bg-white py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <Skeleton className='h-8 w-48 mb-6' />
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='space-y-3'>
                <Skeleton className='aspect-square w-full rounded-lg' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Book Grid Skeleton */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <Skeleton className='h-8 w-48 mb-2' />
          <Skeleton className='h-4 w-64' />
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
          {[...Array(12)].map((_, i) => (
            <div key={i} className='space-y-3'>
              <Skeleton className='aspect-square w-full rounded-lg' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

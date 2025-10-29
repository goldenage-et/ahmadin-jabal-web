'use client';

import { Button } from '@/components/ui/button';
import { Smartphone, Circle, ShoppingBag } from 'lucide-react';

export function HeroBanner() {
  return (
    <div className='bg-yellow-400 relative overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='flex items-center justify-between'>
          {/* Left Content */}
          <div className='flex-1'>
            <div className='text-sm text-gray-600 mb-2'>
              Sale starts: 10/1/2025, 10:00:00 AM
            </div>
            <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6'>
              ADD TO CART NOW
            </h2>
          </div>

          {/* Right Graphics */}
          <div className='relative flex-1 flex justify-end'>
            <div className='relative'>
              {/* Party Time Text */}
              <div className='absolute -top-8 -right-4 transform rotate-12'>
                <span className='text-red-600 font-bold text-2xl'>
                  PARTY TIME
                </span>
              </div>

              {/* Shopping Bag */}
              <div className='relative'>
                <div className='bg-red-600 text-white p-4 rounded-lg transform rotate-3'>
                  <div className='text-center'>
                    <ShoppingBag className='w-8 h-8 mx-auto mb-2' />
                    <div className='text-sm font-bold'>1ST EVERY MONTH</div>
                  </div>
                </div>

                {/* Items spilling out */}
                <div className='absolute -top-2 -left-2'>
                  <div className='bg-gray-300 p-2 rounded transform -rotate-12'>
                    <Smartphone className='w-4 h-4 text-gray-600' />
                  </div>
                </div>

                <div className='absolute top-2 -right-4'>
                  <div className='bg-orange-400 p-2 rounded transform rotate-12'>
                    <Circle className='w-4 h-4 text-white' />
                  </div>
                </div>

                <div className='absolute -bottom-2 left-4'>
                  <div className='bg-green-400 p-2 rounded transform rotate-6'>
                    <Circle className='w-4 h-4 text-white' />
                  </div>
                </div>

                {/* Confetti */}
                <div className='absolute -top-4 left-8 w-2 h-2 bg-green-400 transform rotate-45'></div>
                <div className='absolute top-0 -left-2 w-2 h-2 bg-pink-400 transform rotate-45'></div>
                <div className='absolute -bottom-4 -right-2 w-2 h-2 bg-blue-400 transform rotate-45'></div>
                <div className='absolute top-4 right-8 w-2 h-2 bg-yellow-300 transform rotate-45'></div>
              </div>

              {/* Pumpkin */}
              <div className='absolute -bottom-8 -right-8'>
                <div className='w-16 h-16 bg-orange-500 rounded-full relative'>
                  <div className='absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-600 rounded-full'></div>
                  <div className='absolute top-4 left-2 w-1 h-1 bg-black rounded-full'></div>
                  <div className='absolute top-4 right-2 w-1 h-1 bg-black rounded-full'></div>
                  <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-black rounded-full'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

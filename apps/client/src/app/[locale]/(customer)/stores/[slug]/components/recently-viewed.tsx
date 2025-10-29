'use client';

import { TBookBasic } from '@repo/common';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { getBookImage } from '../../../lib/books';

interface RecentlyViewedProps {
  books: TBookBasic[];
}

export function RecentlyViewed({ books }: RecentlyViewedProps) {
  return (
    <div className='bg-white py-6 sm:py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6'>
          Recently viewed
        </h2>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
          {books.map((book) => (
            <Card
              key={book.id}
              className='group cursor-pointer hover:shadow-lg transition-shadow'
            >
              <CardContent className='p-0'>
                <div className='relative aspect-square overflow-hidden rounded-t-lg'>
                  <Image
                    src={getBookImage(book.images || [])}
                    alt={book.name}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                </div>

                <div className='p-3'>
                  <h3 className='font-medium text-sm text-gray-900 line-clamp-2 mb-2'>
                    {book.name}
                  </h3>

                  <div className='flex items-center space-x-1 mb-2'>
                    <div className='flex items-center'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < 4
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className='text-xs text-gray-500'>(4.0)</span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='text-sm font-semibold text-red-600'>
                      ETB {book.price?.toLocaleString()}
                    </div>
                    <Badge variant='secondary' className='text-xs'>
                      Sale
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

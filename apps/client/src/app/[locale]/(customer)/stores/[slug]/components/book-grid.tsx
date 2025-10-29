'use client';

import { TBookBasic } from '@repo/common';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getBookImage } from '../../../lib/books';

interface BookGridProps {
  books: TBookBasic[];
}

export function BookGrid({ books }: BookGridProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getOriginalPrice = (price: number) => {
    // Simulate original price (usually 2-3x current price)
    return (price * 2.2).toFixed(2);
  };

  const getSavings = (currentPrice: number, originalPrice: number) => {
    return (originalPrice - currentPrice).toFixed(2);
  };

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
      {books.map((book) => {
        const originalPrice = parseFloat(getOriginalPrice(book.price || 0));
        const savings = parseFloat(
          getSavings(book.price || 0, originalPrice),
        );

        return (
          <Card
            key={book.id}
            className='group cursor-pointer hover:shadow-lg transition-all duration-300'
          >
            <CardContent className='p-0'>
              <Link href={`/books/${book.id}`}>
                <div className='relative aspect-square overflow-hidden rounded-t-lg'>
                  <Image
                    src={getBookImage(book.images || [])}
                    alt={book.name}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-300'
                  />

                  {/* SuperDeals Badge */}
                  <div className='absolute top-2 left-2'>
                    <Badge
                      variant='secondary'
                      className='bg-white text-red-600 border-red-600 text-xs font-medium'
                    >
                      SuperDeals
                    </Badge>
                  </div>
                </div>

                <div className='p-3'>
                  <h3 className='font-medium text-sm text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]'>
                    {book.name}
                  </h3>

                  {/* Rating and Sales */}
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center space-x-1'>
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
                    </div>
                    <span className='text-xs text-gray-500'>
                      {Math.floor(Math.random() * 30) + 1} sold
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className='space-y-1'>
                    <div className='flex items-center justify-between'>
                      <div className='text-lg font-bold text-red-600'>
                        ETB {formatPrice(book.price || 0)}
                      </div>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='text-sm text-gray-500 line-through'>
                        ETB {formatPrice(originalPrice)}
                      </div>
                    </div>

                    {/* Savings */}
                    <div className='text-xs text-red-600 font-medium'>
                      New shoppers save ETB {formatPrice(savings)}
                    </div>

                    {/* Upcoming Price (random) */}
                    {Math.random() > 0.5 && (
                      <div className='flex items-center space-x-1 text-xs text-red-600'>
                        <Zap className='w-3 h-3' />
                        <span>
                          Upcoming price ETB {formatPrice(book.price || 0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

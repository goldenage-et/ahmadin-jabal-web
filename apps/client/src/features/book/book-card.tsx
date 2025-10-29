'use client';

import { BuyNowButton } from '@/features/cart/components/buy-now-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TBookBasic } from '@repo/common';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type ViewMode = 'grid' | 'list';
type Size = 'small' | 'medium';
interface BookCardProps {
  book: TBookBasic;
  viewMode: ViewMode;
  size?: Size;
  storeName?: string;
}

export function BookCard({
  book,
  viewMode,
  size,
  storeName,
}: BookCardProps) {
  const [imageError, setImageError] = useState(false);
  const getBookImage = () => {
    if (imageError || !book.images || book.images.length === 0) {
      return '/placeholder-book.jpg';
    }
    const firstImage = book.images[0];
    return typeof firstImage === 'string' ? firstImage : firstImage.url;
  };

  // const discountPercentage =
  //   book.compareAtPrice && book.price
  //     ? Math.round(
  //       ((book.compareAtPrice - book.price) / book.compareAtPrice) *
  //       100,
  //     )
  //     : 0;

  const stockStatus =
    (book.inventoryQuantity ?? 0) > 0
      ? (book.inventoryQuantity ?? 0) <=
        (book.inventoryLowStockThreshold || 5)
        ? 'low'
        : 'in-stock'
      : 'out-of-stock';

  if (viewMode === 'list') {
    return (
      <Card className='overflow-hidden hover:shadow-lg transition-all duration-200 group'>
        <div className='flex'>
          <div className={`w-32 h-32 bg-gray-100 relative shrink-0 ${size === 'medium' ? 'w-48 h-48' : ''}`}>
            <Link href={`/books/${book.id}`} className="absolute inset-0">
              <Image
                src={getBookImage()}
                alt={book.title}
                fill
                className='object-cover cursor-pointer'
                onError={() => setImageError(true)}
                sizes='128px'
                style={{ zIndex: 1 }}
              />
              <span className="sr-only">{book.title}</span>
            </Link>
            {book.featured && (
              <Badge className='absolute top-2 left-2 bg-primary text-primary-foreground text-xs' style={{ zIndex: 2 }}>
                Featured
              </Badge>
            )}
            {/* {discountPercentage > 0 && (
              <Badge className='absolute top-2 right-2 bg-red-500 text-white text-xs' style={{ zIndex: 2 }}>
                -{discountPercentage}%
              </Badge>
            )} */}
            {stockStatus === 'low' && (
              <Badge className='absolute bottom-2 left-2 bg-orange-500 text-white text-xs' style={{ zIndex: 2 }}>
                Low Stock
              </Badge>
            )}
            {stockStatus === 'out-of-stock' && (
              <Badge className='absolute bottom-2 left-2 bg-gray-500 text-white text-xs' style={{ zIndex: 2 }}>
                Out of Stock
              </Badge>
            )}
          </div>
          <CardContent className='flex-1 p-4 flex flex-col justify-between'>
            <div>
              <Link href={`/books/${book.id}`}>
                <h3 className='font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors'>
                  {book.title}
                </h3>
              </Link>
              <div className='flex items-center mb-2'>
                <div className='flex items-center'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < Math.floor(book.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className='text-xs text-gray-500 ml-1'>
                  ({book.reviewCount || 0})
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <span className='font-bold text-primary'>
                    ${book.price}
                  </span>
                  {/* {book.compareAtPrice && (
                    <span className='text-sm text-gray-500 line-through'>
                      ${book.compareAtPrice}
                    </span>
                  )} */}
                </div>
                {storeName && (
                  <span className='text-xs text-gray-500'>{storeName}</span>
                )}
              </div>
              <div className='text-xs text-gray-500 mt-1'>
                Stock: {book.inventoryQuantity} units
              </div>
            </div>
            <div className='flex items-center gap-2 mt-3'>
              <BuyNowButton
                book={book}
                variant='outline'
                size='sm'
                className='flex-1 text-xs'
              />
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className='overflow-hidden hover:shadow-lg transition-all duration-200 group'>
      <div className={`aspect-square bg-gray-100 relative ${size === 'medium' ? 'aspect-square' : 'aspect-[4/3]'}`}>
        <Link href={`/books/${book.id}`} className="absolute inset-0">
          <Image
            src={getBookImage()}
            alt={book.title}
            fill
            className='object-cover cursor-pointer'
            onError={() => setImageError(true)}
            sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
            style={{ zIndex: 1 }}
          />
          <span className="sr-only">{book.title}</span>
        </Link>
        {book.featured && (
          <Badge className='absolute top-2 left-2 bg-primary text-primary-foreground text-xs' style={{ zIndex: 2 }}>
            Featured
          </Badge>
        )}
        {/* {discountPercentage > 0 && (
          <Badge className='absolute top-2 right-2 bg-red-500 text-white text-xs' style={{ zIndex: 2 }}>
            -{discountPercentage}%
          </Badge>
        )} */}
        {stockStatus === 'low' && (
          <Badge className='absolute bottom-2 left-2 bg-orange-500 text-white text-xs' style={{ zIndex: 2 }}>
            Low Stock
          </Badge>
        )}
        {stockStatus === 'out-of-stock' && (
          <Badge className='absolute bottom-2 right-2 bg-gray-500 text-white text-xs' style={{ zIndex: 2 }}>
            Out of Stock
          </Badge>
        )}
      </div>
      <CardContent className='p-3'>
        <Link href={`/books/${book.id}`}>
          <h3 className='font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors'>
            {book.title}
          </h3>
        </Link>
        <div className='flex items-center mb-2'>
          <div className='flex items-center'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(book.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className='text-xs text-gray-500 ml-1'>
            ({book.reviewCount || 0})
          </span>
        </div>
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center space-x-2'>
            <span className='font-bold text-primary'>${book.price}</span>
            {/* {book.compareAtPrice && (
              <span className='text-sm text-gray-500 line-through'>
                ${book.compareAtPrice}
              </span>
            )} */}
          </div>
          {storeName && (
            <span className='text-xs text-gray-500'>{storeName}</span>
          )}
        </div>
        <div className='text-xs text-gray-500 mb-2'>
          Stock: {book.inventoryQuantity} units
        </div>
        <div className='flex gap-2'>
          <BuyNowButton
            book={book}
            variant='outline'
            size='sm'
            className='flex-1 text-xs'
          />
        </div>
      </CardContent>
    </Card>
  );
}

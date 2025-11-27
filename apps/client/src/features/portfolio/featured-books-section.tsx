'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Heart,
  Sparkles,
  Star,
  Eye,
  ShoppingCart,
  TrendingUp,
  Clock,
  Shield,
  Truck,
} from 'lucide-react';
import { TBookBasic } from '@repo/common';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

interface FeaturedBooksSectionProps {
  books: TBookBasic[];
}

export function FeaturedBooksSection({
  books,
}: FeaturedBooksSectionProps) {
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >({});
  const [imageErrorStates, setImageErrorStates] = useState<
    Record<string, boolean>
  >({});

  const toggleWishlist = (bookId: string) => {
    setWishlistItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
        toast.success('Removed from wishlist');
      } else {
        newSet.add(bookId);
        toast.success('Added to wishlist');
      }
      return newSet;
    });
  };

  const handleImageLoad = (bookId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [bookId]: false }));
  };

  const handleImageError = (bookId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [bookId]: false }));
    setImageErrorStates((prev) => ({ ...prev, [bookId]: true }));
  };

  const handleImageLoadStart = (bookId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [bookId]: true }));
    setImageErrorStates((prev) => ({ ...prev, [bookId]: false }));
  };

  const getDiscountPercentage = (
    price: number,
    compareAtPrice?: number | null,
  ) => {
    if (!compareAtPrice || compareAtPrice <= price) return 0;
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  };

  const getStockStatus = (book: TBookBasic) => {
    if (
      book.inventoryQuantity === null ||
      book.inventoryQuantity === undefined
    ) {
      return { status: 'available', text: 'In Stock', color: 'text-green-600' };
    }

    if (book.inventoryQuantity === 0) {
      return { status: 'out', text: 'Out of Stock', color: 'text-red-600' };
    }

    if (
      book.inventoryQuantity <= (book.inventoryLowStockThreshold || 5)
    ) {
      return { status: 'low', text: 'Low Stock', color: 'text-orange-600' };
    }

    return { status: 'available', text: 'In Stock', color: 'text-green-600' };
  };

  const featuredBooks = books.filter((p) => p.featured).slice(0, 8);

  if (featuredBooks.length === 0) {
    return (
      <section className='py-20 bg-linear-to-br from-gray-50 via-white to-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <div className='max-w-md mx-auto'>
            <div className='w-24 h-24 mx-auto mb-6 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center'>
              <Sparkles className='h-12 w-12 text-gray-400' />
            </div>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              No Featured Books Yet
            </h2>
            <p className='text-gray-600 mb-8'>
              We're working on curating amazing books for you. Check back
              soon!
            </p>
            <Button asChild>
              <Link href='/books'>
                Browse All Books
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='py-20 bg-linear-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] pointer-events-none' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.1),transparent_50%)] pointer-events-none' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        {/* Header */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 bg-linear-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6'>
            <Sparkles className='h-4 w-4' />
            Curated Collection
          </div>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent mb-6'>
            Featured Books
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Discover our handpicked selection of premium books, carefully
            curated from our top vendors to bring you the best shopping
            experience.
          </p>
        </div>

        {/* Trust indicators */}
        <div className='flex flex-wrap justify-center items-center gap-8 mb-16 text-sm text-gray-600'>
          <div className='flex items-center gap-2'>
            <Shield className='h-4 w-4 text-green-600' />
            <span>Secure Shopping</span>
          </div>
          <div className='flex items-center gap-2'>
            <Truck className='h-4 w-4 text-blue-600' />
            <span>Fast Delivery</span>
          </div>
          <div className='flex items-center gap-2'>
            <TrendingUp className='h-4 w-4 text-purple-600' />
            <span>Top Rated</span>
          </div>
          <div className='flex items-center gap-2'>
            <Clock className='h-4 w-4 text-orange-600' />
            <span>24/7 Support</span>
          </div>
        </div>

        {/* Books Grid */}
        <div
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8'
          role='grid'
          aria-label='Featured books'
        >
          {featuredBooks.map((book, index) => {
            const stockStatus = getStockStatus(book);
            // const discountPercentage = getDiscountPercentage();
            const isWishlisted = wishlistItems.has(book.id);
            const isHovered = hoveredBook === book.id;

            return (
              <Card
                key={book.id}
                className='group overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative'
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                }}
                onMouseEnter={() => setHoveredBook(book.id)}
                onMouseLeave={() => setHoveredBook(null)}
                role='article'
                aria-label={`Book: ${book.title}`}
              >
                {/* Book Image */}
                <div className='aspect-square relative overflow-hidden bg-linear-to-br from-gray-100 to-gray-200'>
                  {/* Loading skeleton */}
                  {imageLoadingStates[book.id] && (
                    <div className='absolute inset-0 bg-linear-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center'>
                      <div className='w-12 h-12 bg-gray-400 rounded-full animate-spin'></div>
                    </div>
                  )}

                  {/* Error state */}
                  {imageErrorStates[book.id] ? (
                    <div className='absolute inset-0 bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center'>
                      <div className='text-center text-gray-500'>
                        <div className='w-12 h-12 mx-auto mb-2 bg-gray-400 rounded-full flex items-center justify-center'>
                          <span className='text-white text-xs'>?</span>
                        </div>
                        <p className='text-xs'>Image unavailable</p>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={book.images?.[0]?.url || '/placeholder.jpg'}
                      alt={book.title}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-700'
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'
                      onLoadStart={() => handleImageLoadStart(book.id)}
                      onLoad={() => handleImageLoad(book.id)}
                      onError={() => handleImageError(book.id)}
                      priority={index < 4} // Prioritize first 4 images
                    />
                  )}

                  {/* Overlay gradient */}
                  <div className='absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                  {/* Featured badge */}
                  {book.featured && (
                    <Badge className='absolute top-3 left-3 bg-linear-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg'>
                      <Sparkles className='h-3 w-3 mr-1' />
                      Featured
                    </Badge>
                  )}

                  {/* Discount badge */}
                  {/* {discountPercentage > 0 && (
                    <Badge className='absolute top-3 right-3 bg-linear-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg'>
                      -{discountPercentage}%
                    </Badge>
                  )} */}

                  {/* Action buttons */}
                  <div className='absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-10 w-10 p-0 bg-white/90 hover:bg-white rounded-full shadow-lg backdrop-blur-sm'
                      onClick={() => toggleWishlist(book.id)}
                      aria-label={
                        isWishlisted
                          ? `Remove ${book.title} from wishlist`
                          : `Add ${book.title} to wishlist`
                      }
                    >
                      <Heart
                        className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                      />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-10 w-10 p-0 bg-white/90 hover:bg-white rounded-full shadow-lg backdrop-blur-sm'
                      asChild
                    >
                      <Link
                        href={`/books/${book.id}`}
                        aria-label={`View details for ${book.title}`}
                      >
                        <Eye className='h-4 w-4 text-gray-600' />
                      </Link>
                    </Button>
                  </div>

                  {/* Stock status */}
                  <div className='absolute bottom-3 left-3'>
                    <Badge
                      variant='secondary'
                      className={`${stockStatus.color} bg-white/90 backdrop-blur-sm border-0`}
                    >
                      {stockStatus.text}
                    </Badge>
                  </div>
                </div>

                {/* Book Info */}
                <CardContent className='p-6'>
                  {/* Book name */}
                  <div className='mb-3'>
                    <h3 className='font-bold text-lg line-clamp-2 text-gray-900 group-hover:text-purple-700 transition-colors duration-200'>
                      {book.title}
                    </h3>
                    {book.description && (
                      <p className='text-sm text-gray-500 line-clamp-2 mt-1'>
                        {book.description}
                      </p>
                    )}
                  </div>

                  {/* Rating */}
                  <div className='flex items-center gap-2 mb-3'>
                    <div className='flex items-center'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(book.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <span className='text-sm text-gray-500'>
                      {book.rating.toFixed(1)} ({book.reviewCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-2'>
                      <span className='text-2xl font-bold text-gray-900'>
                        ${(book.price || 0).toFixed(2)}
                      </span>
                      {/* {book.compareAtPrice &&
                        book.compareAtPrice > (book.price || 0) && (
                          <span className='text-lg text-gray-500 line-through'>
                            ${book.compareAtPrice.toFixed(2)}
                          </span>
                        )} */}
                    </div>
                    {book.isbn && (
                      <span className='text-xs text-gray-400 font-mono'>
                        {book.isbn}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {book.tags && book.tags.length > 0 && (
                    <div className='flex flex-wrap gap-1 mb-4'>
                      {book.tags.slice(0, 2).map((tag, index) => (
                        <Badge
                          key={index}
                          variant='outline'
                          className='text-xs'
                        >
                          {tag}
                        </Badge>
                      ))}
                      {book.tags.length > 2 && (
                        <Badge variant='outline' className='text-xs'>
                          +{book.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Button */}
        <div className='text-center mt-16'>
          <Button
            asChild
            size='lg'
            className='bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-3'
          >
            <Link href='/books'>
              View All Books
              <ArrowRight className='ml-2 h-5 w-5' />
            </Link>
          </Button>
        </div>
      </div>

      <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
    </section>
  );
}

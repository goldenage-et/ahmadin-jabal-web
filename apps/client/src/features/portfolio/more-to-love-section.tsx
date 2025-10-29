'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TBookBasic, EBookStatus } from '@repo/common';
import { AddToCartButton } from '@/features/cart/components/add-to-cart-button';
import {
  Star,
  ShoppingCart,
  Heart,
  Eye,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Shield,
  Truck,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getBookImage } from '../lib/books';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface MoreToLoveSectionProps {
  books: TBookBasic[];
}

export function MoreToLoveSection({ books }: MoreToLoveSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >({});
  const [imageErrorStates, setImageErrorStates] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    const element = document.getElementById('more-to-love-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

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

  const displayedBooks = books.slice(0, 12);

  if (displayedBooks.length === 0) {
    return (
      <section
        id='more-to-love-section'
        className='py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50'
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <div className='max-w-md mx-auto'>
            <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center'>
              <TrendingUp className='h-12 w-12 text-gray-400' />
            </div>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              No Books Available
            </h2>
            <p className='text-gray-600 mb-8'>
              We're working on adding amazing books for you. Check back soon!
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
    <section
      id='more-to-love-section'
      className='py-20 bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden'
    >
      {/* Background decorations */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.05),transparent_50%)] pointer-events-none' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.05),transparent_50%)] pointer-events-none' />

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6'>
            <TrendingUp className='h-4 w-4' />
            Trending Now
          </div>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-green-900 to-gray-900 bg-clip-text text-transparent mb-6'>
            More to Love
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Discover amazing books across all categories, handpicked just for
            you
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
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6'>
          {displayedBooks.map((book, index) => {
            const stockStatus = getStockStatus(book);
            // const discountPercentage = getDiscountPercentage(
            //   book.price || 0,
            //   book.compareAtPrice || 0,
            // );
            const isWishlisted = wishlistItems.has(book.id);
            const isHovered = hoveredBook === book.id;

            return (
              <Card
                key={book.id}
                className='group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2'
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isVisible
                    ? 'fadeInUp 0.6s ease-out forwards'
                    : 'none',
                }}
                onMouseEnter={() => setHoveredBook(book.id)}
                onMouseLeave={() => setHoveredBook(null)}
              >
                {/* Book Image */}
                <div className='aspect-square relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200'>
                  {/* Loading skeleton */}
                  {imageLoadingStates[book.id] && (
                    <div className='absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center'>
                      <div className='w-8 h-8 bg-gray-400 rounded-full animate-spin'></div>
                    </div>
                  )}

                  {/* Error state */}
                  {imageErrorStates[book.id] ? (
                    <div className='absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center'>
                      <div className='text-center text-gray-500'>
                        <div className='w-8 h-8 mx-auto mb-2 bg-gray-400 rounded-full flex items-center justify-center'>
                          <span className='text-white text-xs'>?</span>
                        </div>
                        <p className='text-xs'>Image unavailable</p>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={getBookImage(book.images)}
                      alt={book.name}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-700'
                      sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw'
                      onLoadStart={() => handleImageLoadStart(book.id)}
                      onLoad={() => handleImageLoad(book.id)}
                      onError={() => handleImageError(book.id)}
                      priority={index < 4}
                    />
                  )}

                  {/* Overlay gradient */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                  {/* Discount badge */}
                  {/* {discountPercentage > 0 && (
                    <Badge className='absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg text-xs'>
                      -{discountPercentage}%
                    </Badge>
                  )} */}

                  {/* Action buttons */}
                  <div className='absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 w-8 p-0 bg-white/90 hover:bg-white rounded-full shadow-lg backdrop-blur-sm'
                      onClick={() => toggleWishlist(book.id)}
                    >
                      <Heart
                        className={`h-3 w-3 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                      />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 w-8 p-0 bg-white/90 hover:bg-white rounded-full shadow-lg backdrop-blur-sm'
                      asChild
                    >
                      <Link href={`/books/${book.id}`}>
                        <Eye className='h-3 w-3 text-gray-600' />
                      </Link>
                    </Button>
                  </div>

                  {/* Stock status */}
                  <div className='absolute bottom-2 left-2'>
                    <Badge
                      variant='secondary'
                      className={`${stockStatus.color} bg-white/90 backdrop-blur-sm border-0 text-xs`}
                    >
                      {stockStatus.text}
                    </Badge>
                  </div>
                </div>

                {/* Book Info */}
                <CardContent className='p-3 lg:p-4'>
                  {/* Book name */}
                  <div className='mb-2'>
                    <Link href={`/books/${book.id}`}>
                      <h4 className='font-medium text-sm line-clamp-2 leading-tight text-gray-900 group-hover:text-purple-700 transition-colors duration-200'>
                        {book.name}
                      </h4>
                    </Link>
                  </div>

                  {/* Rating */}
                  <div className='flex items-center gap-1 mb-2'>
                    <div className='flex items-center'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < Math.floor(book.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <span className='text-xs text-gray-500'>
                      {book.rating.toFixed(1)}
                    </span>
                  </div>

                  {/* Price */}
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center gap-1'>
                      <span className='text-sm font-bold text-gray-900'>
                        ${(book.price || 0).toFixed(2)}
                      </span>
                      {/* {book.compareAtPrice &&
                        book.compareAtPrice > (book.price || 0) && (
                          <span className='text-xs text-gray-500 line-through'>
                            ${book.compareAtPrice.toFixed(2)}
                          </span>
                        )} */}
                    </div>
                  </div>

                  {/* Savings */}
                  {/* {book.compareAtPrice &&
                    book.compareAtPrice > (book.price || 0) && (
                      <div className='text-xs text-green-600 font-medium mb-3'>
                        Save $
                        {(book.compareAtPrice - (book.price || 0)).toFixed(2)}
                      </div>
                    )} */}

                  {/* Add to cart button */}
                  <AddToCartButton
                    book={book}
                    size='sm'
                    className='w-full text-xs h-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200'
                    showQuantityControls={true}
                  />
                </CardContent>

                {/* Floating elements */}
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-300 animate-pulse'></div>
                <div className='absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-300 animate-pulse delay-300'></div>
              </Card>
            );
          })}
        </div>

        {/* View All Button */}
        <div className='text-center mt-12'>
          <Button
            asChild
            size='lg'
            className='bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-3'
          >
            <Link href='/books'>
              <Zap className='mr-2 h-5 w-5' />
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

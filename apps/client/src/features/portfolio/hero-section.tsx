'use client';

import { Badge } from '@/components/ui/badge';
import { getDefaultBackgroundColor, getIconByName } from '@/utils/icon-mapper';
import { TBookBasic, TCategoryBasic } from '@repo/common';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface HeroSectionProps {
  featuredBooks?: TBookBasic[];
  categories?: TCategoryBasic[];
}

export function HeroSection({ featuredBooks = [], categories = [] }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCategorySlide, setCurrentCategorySlide] = useState(0);
  const [currentAdContent, setCurrentAdContent] = useState(0);
  const categoryScrollRef = useRef<HTMLDivElement>(null);


  const leftBannerSlides = [
    {
      title: 'BACK TO OUTDOOR',
      subtitle: 'Up to 70% OFF',
      backgroundImage:
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
      contentImage:
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
      sponsors: ['DANUBE', 'OASIS', 'W'],
    },
    {
      title: 'SUMMER COLLECTION',
      subtitle: 'Up to 50% OFF',
      backgroundImage:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      contentImage:
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop',
      sponsors: ['SUMMER', 'COLLECTION', '2024'],
    },
  ];

  const adContents = [
    {
      title: 'SHARP LOOKS, SMART PRICES',
      backgroundImage:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      books: [
        {
          type: 'watch',
          image:
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
          name: 'Premium Watch',
        },
        {
          type: 'sunglasses',
          image:
            'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=100&h=100&fit=crop',
          name: 'Designer Sunglasses',
        },
      ],
    },
    {
      title: 'ELECTRONICS DEALS',
      backgroundImage:
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop',
      books: [
        {
          type: 'phone',
          image:
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop',
          name: 'Latest Smartphone',
        },
        {
          type: 'tablet',
          image:
            'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop',
          name: 'Tablet Pro',
        },
      ],
    },
    {
      title: 'FASHION TRENDS',
      backgroundImage:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
      books: [
        {
          type: 'shirt',
          image:
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
          name: 'Trendy Shirt',
        },
        {
          type: 'shoes',
          image:
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop',
          name: 'Fashion Shoes',
        },
      ],
    },
  ];

  // Auto-scroll functionality for first banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % leftBannerSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [leftBannerSlides.length]);

  // Auto-rotate ad content for second banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdContent((prev) => (prev + 1) % adContents.length);
    }, 3000); // Change content every 3 seconds

    return () => clearInterval(interval);
  }, [adContents.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % leftBannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + leftBannerSlides.length) % leftBannerSlides.length,
    );
  };

  const nextCategorySlide = () => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200; // Scroll by 200px
      categoryScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
      setCurrentCategorySlide((prev) => (prev + 1) % 2);
    }
  };

  const prevCategorySlide = () => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200; // Scroll by 200px
      categoryScrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
      setCurrentCategorySlide((prev) => (prev - 1 + 2) % 2);
    }
  };

  // Handle scroll events to update pagination
  const handleCategoryScroll = () => {
    if (categoryScrollRef.current) {
      const scrollLeft = categoryScrollRef.current.scrollLeft;
      const maxScroll =
        categoryScrollRef.current.scrollWidth -
        categoryScrollRef.current.clientWidth;
      const scrollPercentage = scrollLeft / maxScroll;
      setCurrentCategorySlide(scrollPercentage > 0.5 ? 1 : 0);
    }
  };

  return (
    <section className='relative bg-gray-50'>
      <div className='px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8'>
        {/* Main Banners Section */}
        <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8'>
          {/* Left Banner - Auto-scrolling with background images (60% width) */}
          <div className='w-full lg:w-[60%] relative h-64 sm:h-72 lg:h-80 rounded-xl sm:rounded-2xl overflow-hidden'>
            {/* Background Image */}
            <div
              className='absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out'
              style={{
                backgroundImage: `url(${leftBannerSlides[currentSlide].backgroundImage})`,
              }}
            />

            {/* Overlay gradient */}
            <div className='absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/40'></div>

            {/* Navigation arrows */}
            <button
              onClick={prevSlide}
              className='absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow z-10'
            >
              <ArrowLeft className='w-4 h-4 sm:w-5 sm:h-5 text-gray-700' />
            </button>
            <button
              onClick={nextSlide}
              className='absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow z-10'
            >
              <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 text-gray-700' />
            </button>

            {/* Content */}
            <div className='relative z-10 p-4 sm:p-6 lg:p-8 h-full flex flex-col justify-between'>
              <div className='flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6'>
                <div className='flex-1 min-w-0'>
                  <h2 className='text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg'>
                    {leftBannerSlides[currentSlide].title}
                  </h2>
                  <p className='text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg'>
                    {leftBannerSlides[currentSlide].subtitle}
                  </p>
                </div>

                {/* Best Prices Badge */}
                <div className='absolute top-2 sm:top-4 right-2 sm:right-4'>
                  <Badge className='bg-primary text-primary-foreground px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium'>
                    BEST PRICES
                  </Badge>
                </div>
              </div>

              {/* Sponsor Logos */}
              <div className='mt-auto'>
                <p className='text-xs sm:text-sm text-white/80 mb-1 sm:mb-2 drop-shadow'>
                  Powered by:
                </p>
                <div className='flex items-center gap-2 sm:gap-4 flex-wrap'>
                  {leftBannerSlides[currentSlide].sponsors.map(
                    (sponsor, index) => (
                      <div
                        key={index}
                        className='bg-white/90 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold text-gray-800'
                      >
                        {sponsor}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Pagination dots */}
            <div className='absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-2'>
              {leftBannerSlides.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1 sm:w-2 sm:h-1 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-yellow-400' : 'bg-white/60'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Right Banner - Auto-rotating Ad Content with background images (40% width) */}
          <div className='w-full lg:w-[40%] relative h-64 sm:h-72 lg:h-80 rounded-xl sm:rounded-2xl overflow-hidden'>
            {/* Background Image */}
            <div
              className='absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out'
              style={{
                backgroundImage: `url(${adContents[currentAdContent].backgroundImage})`,
              }}
            />

            {/* Overlay gradient */}
            <div className='absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50'></div>

            {/* Content with auto-rotation */}
            <div className='relative z-10 p-4 sm:p-6 h-full flex flex-col justify-between'>
              <div className='flex-1'>
                <h2 className='text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white mb-2 sm:mb-4 transition-all duration-500 drop-shadow-lg'>
                  {adContents[currentAdContent].title}
                </h2>

                {/* Book showcase area with auto-rotating content */}
                <div className='grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-4'>
                  {adContents[currentAdContent].books.map(
                    (book, index) => (
                      <div
                        key={index}
                        className='bg-white/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm transition-all duration-500'
                      >
                        <div className='w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-lg overflow-hidden mb-1 sm:mb-2 shadow-lg'>
                          <img
                            src={book.image}
                            alt={book.name}
                            className='w-full h-full object-cover transition-all duration-500'
                          />
                        </div>
                        <p className='text-xs sm:text-xs lg:text-sm text-white font-medium drop-shadow leading-tight'>
                          {book.name}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Discount badge */}
              <div className='mt-auto'>
                <Badge className='bg-primary text-primary-foreground px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-lg xl:text-xl font-bold shadow-lg'>
                  Up to 70% off
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Category Icons Carousel */}
        <div className='relative'>
          {/* All Categories Link */}
          <div className='absolute top-0 right-0 z-20'>
            <Link
              href='/categories'
              className='text-xs sm:text-sm text-gray-600 hover:text-primary transition-colors duration-200 font-medium'
            >
              All Categories
            </Link>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevCategorySlide}
            className='absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow z-10'
          >
            <ChevronLeft className='w-4 h-4 sm:w-5 sm:h-5 text-gray-600' />
          </button>
          <button
            onClick={nextCategorySlide}
            className='absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow z-10'
          >
            <ChevronRight className='w-4 h-4 sm:w-5 sm:h-5 text-gray-600' />
          </button>

          {/* Category icons - scrollable without visible scrollbar */}
          <div
            ref={categoryScrollRef}
            onScroll={handleCategoryScroll}
            className='flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto px-8 sm:px-10 lg:px-12 py-3 sm:py-4 scrollbar-hide'
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth',
            }}
          >
            {categories.map((category, index) => {
              // Get icon component
              const IconComponent = getIconByName(category.iconName);

              // Determine background color
              const bgColor =
                category.backgroundColor || getDefaultBackgroundColor(index);

              // Create category URL
              const categoryUrl = `/shop?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`;

              return (
                <Link
                  key={category.id}
                  href={categoryUrl}
                  className='flex flex-col items-center gap-1.5 sm:gap-2 min-w-[60px] sm:min-w-[70px] lg:min-w-[80px] group flex-shrink-0'
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                    style={{
                      backgroundColor: bgColor.startsWith('#')
                        ? bgColor
                        : undefined,
                    }}
                  >
                    {category.image?.url ? (
                      <img
                        src={category.image.url}
                        alt={category.image.alt || category.name}
                        className='w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full object-cover'
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const iconElement =
                              parent.querySelector('.fallback-icon');
                            if (iconElement) {
                              (iconElement as HTMLElement).style.display =
                                'block';
                            }
                          }
                        }}
                      />
                    ) : null}
                    <IconComponent
                      className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white ${category.image?.url ? 'fallback-icon hidden' : ''}`}
                    />
                  </div>
                  <span className='text-xs sm:text-xs lg:text-xs text-center text-gray-700 font-medium leading-tight'>
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Single pagination indicator */}
          <div className='flex justify-center mt-3 sm:mt-4'>
            <div className='w-6 sm:w-8 h-1 bg-gray-300 rounded-full'>
              <div
                className='w-3 sm:w-4 h-1 bg-gray-800 rounded-full transition-all duration-300'
                style={{
                  transform: `translateX(${currentCategorySlide * 3}px)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

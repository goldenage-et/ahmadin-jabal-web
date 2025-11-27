'use client';

import { TCategoryBasic } from '@repo/common';
import { Star, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getIconByName, getDefaultBackgroundColor } from '@/utils/icon-mapper';

interface CategoriesSectionProps {
  categories: TCategoryBasic[];
}

// Enhanced color schemes for categories
const getCategoryColors = (index: number) => {
  const colorSchemes = [
    {
      primary: 'from-blue-500 to-blue-600',
      secondary: 'bg-blue-50',
      accent: 'text-blue-600',
    },
    {
      primary: 'from-green-500 to-green-600',
      secondary: 'bg-green-50',
      accent: 'text-green-600',
    },
    {
      primary: 'from-purple-500 to-purple-600',
      secondary: 'bg-purple-50',
      accent: 'text-purple-600',
    },
    {
      primary: 'from-pink-500 to-pink-600',
      secondary: 'bg-pink-50',
      accent: 'text-pink-600',
    },
    {
      primary: 'from-orange-500 to-orange-600',
      secondary: 'bg-orange-50',
      accent: 'text-orange-600',
    },
    {
      primary: 'from-teal-500 to-teal-600',
      secondary: 'bg-teal-50',
      accent: 'text-teal-600',
    },
    {
      primary: 'from-indigo-500 to-indigo-600',
      secondary: 'bg-indigo-50',
      accent: 'text-indigo-600',
    },
    {
      primary: 'from-red-500 to-red-600',
      secondary: 'bg-red-50',
      accent: 'text-red-600',
    },
    {
      primary: 'from-yellow-500 to-yellow-600',
      secondary: 'bg-yellow-50',
      accent: 'text-yellow-600',
    },
    {
      primary: 'from-cyan-500 to-cyan-600',
      secondary: 'bg-cyan-50',
      accent: 'text-cyan-600',
    },
    {
      primary: 'from-emerald-500 to-emerald-600',
      secondary: 'bg-emerald-50',
      accent: 'text-emerald-600',
    },
    {
      primary: 'from-violet-500 to-violet-600',
      secondary: 'bg-violet-50',
      accent: 'text-violet-600',
    },
  ];

  return colorSchemes[index % colorSchemes.length];
};

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    const element = document.getElementById('categories-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id='categories-section'
      className='py-16 bg-linear-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden'
    >
      {/* Background decorations */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.05),transparent_50%)] pointer-events-none' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.03),transparent_50%)] pointer-events-none' />

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4'>
            <Sparkles className='h-4 w-4' />
            Explore Categories
          </div>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Shop by{' '}
            <span className='bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent'>
              Category
            </span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Discover amazing books across our carefully curated categories.
            Find exactly what you're looking for with our organized collection.
          </p>
        </div>

        {/* Categories Display - Grid Layout */}
        <div className='relative'>
          {categories.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6'>
              {categories.slice(0, 12).map((category, index) => {
                const colors = getCategoryColors(index);
                const IconComponent = getIconByName(category.iconName);

                return (
                  <Link
                    key={category.id}
                    href={`/shop?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className='group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1'
                  >
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 mx-auto mb-4 bg-linear-to-br ${colors.primary} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {category.image?.url ? (
                        <img
                          src={category.image.url}
                          alt={category.image.alt || category.name}
                          className='w-10 h-10 rounded-lg object-cover'
                          onError={(e) => {
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
                        className={`w-8 h-8 text-white ${category.image?.url ? 'fallback-icon hidden' : ''}`}
                      />
                    </div>

                    {/* Category Info */}
                    <div className='text-center'>
                      <h3 className='font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300 text-sm leading-tight'>
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className='text-center py-20'>
              <div className='max-w-md mx-auto'>
                <div className='w-24 h-24 mx-auto mb-6 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center'>
                  <Star className='h-12 w-12 text-gray-400' />
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                  No Categories Available
                </h3>
                <p className='text-gray-600 mb-8'>
                  We're working on adding amazing categories for you. Check back
                  soon!
                </p>
                <div className='flex items-center justify-center gap-2 text-sm text-gray-500'>
                  <div className='w-2 h-2 bg-primary rounded-full animate-pulse'></div>
                  <span>Coming Soon</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

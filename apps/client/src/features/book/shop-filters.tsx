'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
// slider removed; using checkbox group for price type
import { TCategoryBasic, TBookQueryFilter } from '@repo/common';
import { Star } from 'lucide-react';

interface ShopFiltersProps {
  filters: TBookQueryFilter;
  categories: TCategoryBasic[];
  onFilterChange: (key: keyof TBookQueryFilter, value: any) => void;
  onResetFilters: () => void;
}

export function ShopFilters({
  filters,
  categories,
  onFilterChange,
  onResetFilters,
}: ShopFiltersProps) {
  const priceType: 'all' | 'free' | 'paid' = (filters as any).priceType || ((filters.minPrice === 0 && filters.maxPrice === 0)
    ? 'free'
    : (typeof filters.minPrice === 'number' && filters.minPrice > 0) ? 'paid' : 'all');

  const setPriceType = (value: 'all' | 'free' | 'paid') => {
    onFilterChange('priceType', value);
    if (value === 'all') {
      onFilterChange('minPrice', undefined);
      onFilterChange('maxPrice', undefined);
    } else if (value === 'free') {
      onFilterChange('minPrice', 0);
      onFilterChange('maxPrice', 0);
    } else {
      onFilterChange('minPrice', 0.01);
      onFilterChange('maxPrice', undefined);
    }
  };
  return (
    <Card>
      <div className='p-4 border-b'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>Filters</h3>
          <Button
            variant='ghost'
            size='sm'
            onClick={onResetFilters}
            className='text-xs'
          >
            Reset
          </Button>
        </div>
      </div>
      <div className='p-4 space-y-6'>
        {/* Price */}
        <div className='space-y-3'>
          <label className='text-sm font-medium'>Price</label>
          <div className='flex items-center space-x-2'>
            {['free', 'paid', 'all'].map((priceType) => (
              <div key={priceType} className='flex items-center space-x-2'>
                <Checkbox
                  id={`price-type-${priceType}`}
                  checked={filters.priceType === priceType}
                  onCheckedChange={(checked) =>
                    onFilterChange('priceType', checked ? priceType : 'all')
                  }
                />
                <label htmlFor={`price-type-${priceType}`} className='text-sm cursor-pointer'>
                  {priceType.charAt(0).toUpperCase() + priceType.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className='space-y-3'>
          <label className='text-sm font-medium'>Categories</label>
          <div className='space-y-2 max-h-48 overflow-y-auto'>
            {categories.map((category) => (
              <div key={category.name} className='flex items-center space-x-2'>
                <Checkbox
                  id={category.name}
                  checked={filters.categoryName === category.name}
                  onCheckedChange={(checked) =>
                    onFilterChange('categoryName', checked ? category.name : '')
                  }
                />
                <label htmlFor={category.name} className='text-sm cursor-pointer'>
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>


        {/* Rating */}
        <div className='space-y-3'>
          <label className='text-sm font-medium'>Minimum Rating</label>
          <div className='space-y-2'>
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className='flex items-center space-x-2'>
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.minRating === rating}
                  onCheckedChange={(checked) =>
                    onFilterChange('minRating', checked ? rating : 0)
                  }
                />
                <div className='flex items-center'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className='ml-1 text-sm'>& up</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Filters */}
        <div className='space-y-3'>
          <label className='text-sm font-medium'>Other</label>
          <div className='space-y-2'>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='inStock'
                checked={filters.inStock}
                onCheckedChange={(checked) =>
                  onFilterChange('inStock', checked)
                }
              />
              <label htmlFor='inStock' className='text-sm cursor-pointer'>
                In Stock Only
              </label>
            </div>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='featured'
                checked={filters.featured}
                onCheckedChange={(checked) =>
                  onFilterChange('featured', checked)
                }
              />
              <label htmlFor='featured' className='text-sm cursor-pointer'>
                Featured Books
              </label>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Filter,
  Search,
  Grid3X3,
  List,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { EBookStatus, TBookQueryFilter, TCategoryBasic } from '@repo/common';

interface BooksFiltersProps {
  categories: TCategoryBasic[];
  currentFilters: Partial<TBookQueryFilter>;
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
}

// Add viewMode union type to manage local state for grid/table view
type ViewMode = 'grid' | 'table';

export function BooksFilters({
  categories,
  currentFilters,
  viewMode,
  setViewMode,
}: BooksFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Only use "filters" state for query filters (not viewMode)
  const [filters, setFilters] = useState<TBookQueryFilter>({
    search: currentFilters.search || '',
    categoryName: currentFilters.categoryName || undefined,
    status: currentFilters.status || undefined,
    page: currentFilters.page || 1,
    limit: currentFilters.limit || 10,
    minPrice: currentFilters.minPrice || undefined,
    maxPrice: currentFilters.maxPrice || undefined,
    minRating: currentFilters.minRating || undefined,
    inStock: currentFilters.inStock || undefined,
    lowStock: currentFilters.lowStock || undefined,
    createdAfter: currentFilters.createdAfter || undefined,
    createdBefore: currentFilters.createdBefore || undefined,
    updatedAfter: currentFilters.updatedAfter || undefined,
    updatedBefore: currentFilters.updatedBefore || undefined,
    tags: currentFilters.tags || undefined,
    sortBy: currentFilters.sortBy || 'createdAt',
    sortOrder: currentFilters.sortOrder || 'desc',
  });

  // Track view mode locally, not in filters/query
  // Only update filters with fields relevant to API/query
  const updateFilters = (newFilters: Partial<TBookQueryFilter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    const params = new URLSearchParams();

    // Only allow string serializable (non-array/object/undefined)
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        value !== 'all'
      ) {
        params.set(key, String(value));
      }
    });

    startTransition(() => {
      router.push(`/admin/books?${params.toString()}`);
    });
  };

  // Only TBookQueryFilter keys allowed here
  const handleFilterChange = <K extends keyof TBookQueryFilter>(
    key: K,
    value: string
  ) => {
    // Casts for correct types; some fields (like page/limit) may require conversion elsewhere
    updateFilters({ [key]: value } as Partial<TBookQueryFilter>);
  };

  return (
    <div className='space-y-4'>
      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-700 mb-2 block'>
                Search
              </label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Search books...'
                  value={filters.search}
                  onChange={(e) =>
                    handleFilterChange('search', e.target.value)
                  }
                  className='pl-10'
                  disabled={isPending}
                />
              </div>
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-2 block'>
                Category
              </label>
              <Select
                value={filters.categoryName || 'all'}
                onValueChange={(value) =>
                  handleFilterChange(
                    'categoryName',
                    value === 'all' ? '' : decodeURIComponent(value)
                  )
                }
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder='All categories' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-2 block'>
                Status
              </label>
              <Select
                // fallback to 'all' if not set
                value={
                  !filters.status ||
                    (filters.status as any) === '' ||
                    filters.status === null
                    ? 'all'
                    : String(filters.status)
                }
                onValueChange={(value) =>
                  handleFilterChange(
                    'status',
                    value === 'all' ? '' : value
                  )
                }
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder='All statuses' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All statuses</SelectItem>
                  {Object.values(EBookStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-2 block'>
                Sort By
              </label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='title'>Name</SelectItem>
                  <SelectItem value='price'>Price</SelectItem>
                  <SelectItem value='createdAt'>Created Date</SelectItem>
                  <SelectItem value='updatedAt'>Updated Date</SelectItem>
                  <SelectItem value='rating'>Rating</SelectItem>
                  <SelectItem value='inventoryQuantity'>Inventory</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='flex items-center justify-between mt-4'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <label className='text-sm font-medium'>Sort Order:</label>
                <Select
                  value={filters.sortOrder}
                  onValueChange={(value) =>
                    handleFilterChange('sortOrder', value)
                  }
                  disabled={isPending}
                >
                  <SelectTrigger className='w-32'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='asc'>
                      <div className='flex items-center gap-1'>
                        <TrendingUp className='h-3 w-3' />
                        Ascending
                      </div>
                    </SelectItem>
                    <SelectItem value='desc'>
                      <div className='flex items-center gap-1'>
                        <TrendingDown className='h-3 w-3' />
                        Descending
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {isPending && (
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900'></div>
              )}
            </div>

            {/* View Mode Toggle (local only) */}
            <div className='flex border border-gray-200 rounded-lg overflow-hidden'>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setViewMode('grid')}
                className='rounded-none border-0 h-9 px-3'
                disabled={isPending}
              >
                <Grid3X3 className='h-4 w-4' />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setViewMode('table')}
                className='rounded-none border-0 h-9 px-3'
                disabled={isPending}
              >
                <List className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

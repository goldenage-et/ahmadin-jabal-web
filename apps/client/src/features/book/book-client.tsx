'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import useSearchState from '@/hooks/use-search-state';
import type {
  TCategoryBasic,
  TBookBasic,
  TBookQueryFilter,
} from '@repo/common';
import { Grid3X3, List, Search, SlidersHorizontal, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  AccessibilityAnnouncer,
  useHighContrastMode,
  useKeyboardNavigation,
  useReducedMotion,
} from './accessibility-helpers';
import { EmptyState } from './empty-state';
import { BookCard } from './book-card';
import { SearchInsights } from './search-insights';
import { ShopFilters } from './shop-filters';

type ViewMode = 'grid' | 'list';
type SortOption =
  | 'createdAt'
  | 'price'
  | 'rating'
  | 'name'
  | 'featured'
  | 'reviewCount';

interface BookClientProps {
  books: TBookBasic[];
  totalBooks: number;
  categories: TCategoryBasic[];
}



export function BookClient({
  books,
  totalBooks,
  categories,
}: BookClientProps) {

  const {
    search,
    sortBy,
    sortOrder,
    handleFilterChange,
    handlePriceRangeChange,
    resetFilters,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    currentFilters,
    activeFilters,
    viewMode,
    handleViewModeChange,
    handleLoadMore
  } = useFilters(categories);

  const hasMoreBooks = books.length < totalBooks;

  return (
    <>
      <AccessibilityAnnouncer
        message={`books page loaded with ${totalBooks} books. Use Alt+S to focus search, Alt+F to focus filters.`}
      />

      {/* Header */}
      <header className='bg-background dark:bg-background border-b border-gray-200 dark:border-gray-800 sticky top-[6.4rem] z-40 shadow-sm dark:shadow-gray-900/20'>
        <div className='px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Books</h1>
              <p
                className='text-gray-600 dark:text-gray-400'
                aria-live='polite'
                aria-atomic='true'
              >
                {`${totalBooks} books found`}
              </p>
            </div>

            {/* Search */}
            <div className='w-full lg:w-96' id='search'>
              <label htmlFor='search-input' className='sr-only'>
                Search books
              </label>
              <div className='relative'>
                <Search
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500'
                  aria-hidden='true'
                />
                <Input
                  id='search-input'
                  placeholder='Search books...'
                  value={search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className='pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-green-500 dark:focus:ring-green-400'
                  aria-describedby='search-help'
                />
              </div>
              <div id='search-help' className='sr-only'>
                Press Alt+S to focus search, Alt+F to focus filters, Alt+M to go
                to main content
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className='px-4 sm:px-6 lg:px-8 py-6 bg-background dark:bg-background min-h-screen'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Desktop Filters Sidebar */}
          <aside
            id='filters'
            className='hidden lg:block w-64 space-y-6 sticky top-76'
            aria-label='Book filters'
          >
            <ShopFilters
              filters={currentFilters}
              categories={categories}
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
            />
          </aside>

          {/* Mobile Filters */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetContent side='left' className='w-80 bg-background dark:bg-gray-900 border-gray-200 dark:border-gray-800'>
              <SheetHeader>
                <SheetTitle className='text-gray-900 dark:text-white'>Filters</SheetTitle>
              </SheetHeader>
              <div className='mt-6'>
                <ShopFilters
                  filters={currentFilters}
                  categories={categories}
                  onFilterChange={handleFilterChange}
                  onResetFilters={resetFilters}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Main Content */}
          <main
            id='main-content'
            className='flex-1'
            aria-label='Books'
          >
            {search && (
              <SearchInsights
                searchQuery={search}
                resultCount={totalBooks}
                filters={currentFilters}
                onFilterChange={(newFilters) => {
                  Object.entries(newFilters).forEach(([key, value]) => {
                    handleFilterChange(key as keyof TBookQueryFilter, value);
                  });
                }}
              />
            )}

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className='mb-4'>
                <div className='flex flex-wrap gap-2'>
                  {activeFilters.map((filter) => (
                    <Badge
                      key={filter}
                      variant='secondary'
                      className='flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                    >
                      {filter}
                      <X className='h-3 w-3 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200' />
                    </Badge>
                  ))}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={resetFilters}
                    className='text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            )}

            {/* Toolbar */}
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center space-x-4'>
                <Button
                  variant='outline'
                  size='sm'
                  className='lg:hidden border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  onClick={() => setMobileFiltersOpen(true)}
                  data-testid='filter-button'
                  aria-label='Open filters menu'
                >
                  <SlidersHorizontal className='h-4 w-4 mr-2' />
                  Filters
                </Button>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {`${totalBooks} books found`}
                </span>
              </div>
              <div className='flex items-center space-x-4'>
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={(value) => {
                    const [sortBy, sortOrder] = value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                >
                  <SelectTrigger className='w-48 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'>
                    <SelectValue placeholder='Sort by' />
                  </SelectTrigger>
                  <SelectContent className='bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'>
                    <SelectItem value='createdAt-desc' className='text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-gray-700'>Newest First</SelectItem>
                    <SelectItem value='createdAt-asc' className='text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-gray-700'>Oldest First</SelectItem>
                    <SelectItem value='price-asc' className='text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-gray-700'>
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value='price-desc' className='text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-gray-700'>
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value='rating-desc' className='text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-gray-700'>Highest Rated</SelectItem>
                    <SelectItem value='reviewCount-desc' className='text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-gray-700'>
                      Most Reviews
                    </SelectItem>
                    <SelectItem value='name-asc' className='text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-gray-700'>Name: A to Z</SelectItem>
                    <SelectItem value='name-desc' className='text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-gray-700'>Name: Z to A</SelectItem>
                    <SelectItem value='featured-desc' className='text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-gray-700'>
                      Featured First
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className='flex border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800'>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size='sm'
                    onClick={() => handleViewModeChange('grid')}
                    className={cn(
                      'rounded-r-none',
                      viewMode === 'grid'
                        ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <Grid3X3 className='h-4 w-4' />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size='sm'
                    onClick={() => handleViewModeChange('list')}
                    className={cn(
                      'rounded-l-none',
                      viewMode === 'list'
                        ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <List className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>

            {/* Books Grid */}
            {books.length === 0 ? (
              <EmptyState onResetFilters={resetFilters} />
            ) : (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-4'
                  }
                  role='grid'
                  aria-label={`Books in ${viewMode} view`}
                  aria-rowcount={Math.ceil(
                    books.length / (viewMode === 'grid' ? 4 : 1),
                  )}
                >
                  {books.map((book, index) => (
                    <div
                      key={book.id}
                      role='gridcell'
                      aria-rowindex={
                        Math.floor(index / (viewMode === 'grid' ? 4 : 1)) + 1
                      }
                    >
                      <BookCard
                        book={book}
                        viewMode={viewMode}
                      />
                    </div>
                  ))}
                </div>

                {/* Load More */}
                {hasMoreBooks && (
                  <div className='text-center mt-8'>
                    <Button
                      onClick={handleLoadMore}
                      variant='outline'
                      className='border-gray-200 dark:border-gray-700 bg-background dark:bg-background text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-green-500 dark:hover:border-green-400'
                    >
                      Load More Books
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}


const initialFilters = {
  search: '',
  categoryName: '',
  minPrice: 0,
  maxPrice: 1000,
  minRating: 0,
  inStock: false,
  featured: false,
  sortBy: 'createdAt' as SortOption,
  sortOrder: 'desc' as 'asc' | 'desc',
  page: 1,
  limit: 20,
};

export function useFilters(categories: TCategoryBasic[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useSearchState<string>(
    'search',
    initialFilters.search,
  );
  const [categoryName, setCategoryName] = useSearchState<string>(
    'categoryName',
    initialFilters.categoryName,
  );
  const [minPrice, setMinPrice] = useSearchState<number>(
    'minPrice',
    initialFilters.minPrice,
    (value) => parseFloat(value.toString()),
  );
  const [maxPrice, setMaxPrice] = useSearchState<number>(
    'maxPrice',
    initialFilters.maxPrice,
    (value) => parseFloat(value.toString()),
  );
  const [minRating, setMinRating] = useSearchState<number>(
    'minRating',
    initialFilters.minRating,
    (value) => parseFloat(value.toString()),
  );
  const [inStock, setInStock] = useSearchState<boolean>(
    'inStock',
    initialFilters.inStock,
    (value) => value === 'true',
  );
  const [featured, setFeatured] = useSearchState<boolean>(
    'featured',
    initialFilters.featured,
    (value) => value === 'true',
  );
  const [sortBy, setSortBy] = useSearchState<SortOption>(
    'sortBy',
    initialFilters.sortBy,
    (value) => value as SortOption,
  );
  const [sortOrder, setSortOrder] = useSearchState<'asc' | 'desc'>(
    'sortOrder',
    initialFilters.sortOrder,
    (value) => value as 'asc' | 'desc',
  );
  const [page, setPage] = useSearchState<number>(
    'page',
    initialFilters.page,
    (value) => parseInt(value),
  );
  const [limit, setLimit] = useSearchState<number>(
    'limit',
    initialFilters.limit,
    (value) => parseInt(value),
  );
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Accessibility hooks
  useKeyboardNavigation();
  useHighContrastMode();
  useReducedMotion();

  // Load view mode from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('shop-view-mode') as ViewMode;
    if (savedViewMode && ['grid', 'list'].includes(savedViewMode)) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view mode to localStorage
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('shop-view-mode', mode);
  };

  // Update active filters for display
  useEffect(() => {
    const active: string[] = [];
    if (search) active.push(`Search: "${search}"`);
    if (categoryName) {
      const category = categories.find((c) => c.name === categoryName);
      if (category) active.push(`Category: ${category.name}`);
    }
    if (minPrice > 0) active.push(`Min Price: $${minPrice}`);
    if (maxPrice < 1000) active.push(`Max Price: $${maxPrice}`);
    if (minRating > 0) active.push(`Rating: ${minRating}+ stars`);
    if (inStock) active.push('In Stock');
    if (featured) active.push('Featured');

    setActiveFilters(active);
  }, [
    search,
    categoryName,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    featured,
    categories,
  ]);

  // Filter handlers
  const handleFilterChange = (key: keyof TBookQueryFilter, value: string | number | boolean) => {
    switch (key) {
      case 'search':
        setSearch(value);
        break;
      case 'categoryName':
        setCategoryName(value);
        break;
      case 'minPrice':
        setMinPrice(value);
        break;
      case 'maxPrice':
        setMaxPrice(value);
        break;
      case 'minRating':
        setMinRating(value);
        break;
      case 'inStock':
        setInStock(value);
        break;
      case 'featured':
        setFeatured(value);
        break;
      case 'sortBy':
        setSortBy(value);
        break;
      case 'sortOrder':
        setSortOrder(value);
        break;
      case 'page':
        setPage(value);
        break;
      case 'limit':
        setLimit(value);
        break;
    }
  };

  const handlePriceRangeChange = (value: number[]) => {
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
    setPage(1);
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    params.delete('categoryName');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('minRating');
    params.delete('inStock');
    params.delete('featured');
    params.delete('sortBy');
    params.delete('sortOrder');
    params.delete('page');
    params.delete('limit');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const currentFilters: TBookQueryFilter = {
    search,
    categoryName,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    featured,
    sortBy: sortBy as 'createdAt' | 'price' | 'rating' | 'featured' | 'reviewCount' | 'title' | 'updatedAt',
    sortOrder,
    page,
    limit,
  };

  return {
    search,
    categoryName,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    featured,
    sortBy,
    sortOrder,
    handleFilterChange,
    handlePriceRangeChange,
    resetFilters,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    activeFilters,
    setActiveFilters,
    handleViewModeChange,
    currentFilters,
    handleLoadMore,
    viewMode,
    setViewMode,
    page,
    limit,
    setPage,
    setLimit,
    setSearch,
    setCategoryName,
    setMinPrice,
    setMaxPrice,
    setMinRating,
    setInStock,
    setFeatured,
    setSortBy,
    setSortOrder,
  };
}
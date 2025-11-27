'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Filter,
  Search,
  X,
  Calendar,
  Package,
  Star,
  Tag,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Save,
  Loader2,
} from 'lucide-react';
import { useState, useMemo } from 'react';

interface FilterState {
  search: string;
  categories: string[];
  status: string[];
  priceType: 'all' | 'free' | 'paid';
  minPrice?: number;
  maxPrice?: number;
  ratingRange: [number, number];
  inventoryStatus: string[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
  tags: string[];
  featured: boolean | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  onSearch: (query: string) => void;
  categories?: Array<{ id: string; name: string }>;
  tags?: string[];
  className?: string;
}

const defaultFilters: FilterState = {
  search: '',
  categories: [],
  status: [],
  priceType: 'all',
  minPrice: undefined,
  maxPrice: undefined,
  ratingRange: [0, 5],
  inventoryStatus: [],
  dateRange: {},
  tags: [],
  featured: null,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export default function AdvancedFilters({
  onFiltersChange,
  onSearch,
  categories = [],
  tags = [],
  className,
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isOpen, setIsOpen] = useState(false);
  const [savedFilters, setSavedFilters] = useState<
    Array<{ name: string; filters: FilterState }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const saveCurrentFilters = () => {
    const name = prompt('Enter a name for this filter set:');
    if (name) {
      setSavedFilters([...savedFilters, { name, filters: { ...filters } }]);
    }
  };

  const loadSavedFilters = (savedFilter: {
    name: string;
    filters: FilterState;
  }) => {
    setFilters(savedFilter.filters);
    onFiltersChange(savedFilter.filters);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categories.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.priceType !== 'all') count++;
    if (typeof filters.minPrice === 'number' || typeof filters.maxPrice === 'number') count++;
    if (filters.ratingRange[0] !== 0 || filters.ratingRange[1] !== 5) count++;
    if (filters.inventoryStatus.length > 0) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.tags.length > 0) count++;
    if (filters.featured !== null) count++;
    return count;
  }, [filters]);

  const handleSearch = (query: string) => {
    updateFilter('search', query);
    onSearch(query);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search books by name, SKU, or description...'
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
          className='pl-10 pr-20 h-11'
        />
        <div className='absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1'>
          {filters.search && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleSearch('')}
              className='h-7 w-7 p-0'
            >
              <X className='h-3 w-3' />
            </Button>
          )}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant='outline' size='sm' className='h-7'>
                <Filter className='h-3 w-3 mr-1' />
                Filters
                {activeFiltersCount > 0 && (
                  <span className='ml-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'>
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-96 p-0' align='end'>
              <div className='p-4 border-b'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-semibold'>Advanced Filters</h3>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={saveCurrentFilters}
                    >
                      <Save className='h-3 w-3 mr-1' />
                      Save
                    </Button>
                    <Button variant='ghost' size='sm' onClick={clearFilters}>
                      <RotateCcw className='h-3 w-3 mr-1' />
                      Clear
                    </Button>
                  </div>
                </div>
              </div>

              <Tabs defaultValue='basic' className='w-full'>
                <TabsList className='grid w-full grid-cols-3'>
                  <TabsTrigger value='basic'>Basic</TabsTrigger>
                  <TabsTrigger value='advanced'>Advanced</TabsTrigger>
                  <TabsTrigger value='saved'>Saved</TabsTrigger>
                </TabsList>

                <TabsContent value='basic' className='p-4 space-y-4'>
                  {/* Categories */}
                  <div>
                    <Label className='text-sm font-medium'>Categories</Label>
                    <div className='mt-2 space-y-2 max-h-32 overflow-y-auto'>
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className='flex items-center space-x-2'
                        >
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={filters.categories.includes(category.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFilter('categories', [
                                  ...filters.categories,
                                  category.id,
                                ]);
                              } else {
                                updateFilter(
                                  'categories',
                                  filters.categories.filter(
                                    (id) => id !== category.id,
                                  ),
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`category-${category.id}`}
                            className='text-sm'
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <Label className='text-sm font-medium'>Status</Label>
                    <div className='mt-2 space-y-2'>
                      {['active', 'draft', 'archived'].map((status) => (
                        <div
                          key={status}
                          className='flex items-center space-x-2'
                        >
                          <Checkbox
                            id={`status-${status}`}
                            checked={filters.status.includes(status)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFilter('status', [
                                  ...filters.status,
                                  status,
                                ]);
                              } else {
                                updateFilter(
                                  'status',
                                  filters.status.filter((s) => s !== status),
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`status-${status}`}
                            className='text-sm capitalize'
                          >
                            {status}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Featured */}
                  <div>
                    <Label className='text-sm font-medium'>Featured</Label>
                    <div className='mt-2 space-y-2'>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='featured-yes'
                          checked={filters.featured === true}
                          onCheckedChange={(checked) => {
                            updateFilter('featured', checked ? true : null);
                          }}
                        />
                        <Label htmlFor='featured-yes' className='text-sm'>
                          Featured only
                        </Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='featured-no'
                          checked={filters.featured === false}
                          onCheckedChange={(checked) => {
                            updateFilter('featured', checked ? false : null);
                          }}
                        />
                        <Label htmlFor='featured-no' className='text-sm'>
                          Not featured
                        </Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value='advanced' className='p-4 space-y-4'>
                  {/* Price */}
                  <div>
                    <Label className='text-sm font-medium'>Price</Label>
                    <div className='mt-2'>
                      <Select
                        value={filters.priceType}
                        onValueChange={(value) =>
                          updateFilter('priceType', value as FilterState['priceType'])
                        }
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='All prices' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>All</SelectItem>
                          <SelectItem value='free'>Free</SelectItem>
                          <SelectItem value='paid'>Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label className='text-sm font-medium'>
                      Price Range: ${filters.minPrice ?? 0} - ${filters.maxPrice ?? 1000}
                    </Label>
                    <div className='mt-2'>
                      <Slider
                        value={[filters.minPrice ?? 0, filters.maxPrice ?? 1000]}
                        onValueChange={(value) => {
                          const [min, max] = value as [number, number];
                          const next: FilterState = { ...filters, minPrice: min, maxPrice: max };
                          // Sync priceType based on range
                          if (min === 0 && max === 0) {
                            next.priceType = 'free';
                          } else if (min > 0) {
                            next.priceType = 'paid';
                          } else {
                            next.priceType = 'all';
                          }
                          setFilters(next);
                          onFiltersChange(next);
                        }}
                        max={1000}
                        min={0}
                        step={10}
                        className='w-full'
                      />
                    </div>
                  </div>

                  {/* Rating Range */}
                  <div>
                    <Label className='text-sm font-medium'>
                      Rating: {filters.ratingRange[0]} -{' '}
                      {filters.ratingRange[1]} stars
                    </Label>
                    <div className='mt-2'>
                      <Slider
                        value={filters.ratingRange}
                        onValueChange={(value) =>
                          updateFilter('ratingRange', value)
                        }
                        max={5}
                        min={0}
                        step={0.1}
                        className='w-full'
                      />
                    </div>
                  </div>

                  {/* Inventory Status */}
                  <div>
                    <Label className='text-sm font-medium'>
                      Inventory Status
                    </Label>
                    <div className='mt-2 space-y-2'>
                      {[
                        { value: 'in-stock', label: 'In Stock' },
                        { value: 'low-stock', label: 'Low Stock' },
                        { value: 'out-of-stock', label: 'Out of Stock' },
                        { value: 'unlimited', label: 'Unlimited' },
                      ].map((status) => (
                        <div
                          key={status.value}
                          className='flex items-center space-x-2'
                        >
                          <Checkbox
                            id={`inventory-${status.value}`}
                            checked={filters.inventoryStatus.includes(
                              status.value,
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFilter('inventoryStatus', [
                                  ...filters.inventoryStatus,
                                  status.value,
                                ]);
                              } else {
                                updateFilter(
                                  'inventoryStatus',
                                  filters.inventoryStatus.filter(
                                    (s) => s !== status.value,
                                  ),
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`inventory-${status.value}`}
                            className='text-sm'
                          >
                            {status.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <Label className='text-sm font-medium'>Tags</Label>
                    <div className='mt-2 space-y-2 max-h-32 overflow-y-auto'>
                      {tags.map((tag) => (
                        <div key={tag} className='flex items-center space-x-2'>
                          <Checkbox
                            id={`tag-${tag}`}
                            checked={filters.tags.includes(tag)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFilter('tags', [...filters.tags, tag]);
                              } else {
                                updateFilter(
                                  'tags',
                                  filters.tags.filter((t) => t !== tag),
                                );
                              }
                            }}
                          />
                          <Label htmlFor={`tag-${tag}`} className='text-sm'>
                            {tag}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value='saved' className='p-4 space-y-4'>
                  {savedFilters.length > 0 ? (
                    <div className='space-y-2'>
                      {savedFilters.map((savedFilter, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between p-2 border rounded-lg'
                        >
                          <span className='text-sm font-medium'>
                            {savedFilter.name}
                          </span>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => loadSavedFilters(savedFilter)}
                          >
                            Load
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-8'>
                      <Filter className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
                      <p className='text-sm text-muted-foreground'>
                        No saved filters
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-2 flex-wrap'>
              <span className='text-sm font-medium text-muted-foreground'>
                Active filters:
              </span>
              {filters.search && (
                <div className='flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs'>
                  Search: "{filters.search}"
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleSearch('')}
                    className='h-4 w-4 p-0 hover:bg-blue-200'
                  >
                    <X className='h-2 w-2' />
                  </Button>
                </div>
              )}
              {filters.categories.length > 0 && (
                <div className='flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs'>
                  Categories ({filters.categories.length})
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => updateFilter('categories', [])}
                    className='h-4 w-4 p-0 hover:bg-blue-200'
                  >
                    <X className='h-2 w-2' />
                  </Button>
                </div>
              )}
              {filters.status.length > 0 && (
                <div className='flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs'>
                  Status ({filters.status.length})
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => updateFilter('status', [])}
                    className='h-4 w-4 p-0 hover:bg-blue-200'
                  >
                    <X className='h-2 w-2' />
                  </Button>
                </div>
              )}
              {filters.priceType !== 'all' && (
                <div className='flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs'>
                  Price: {filters.priceType === 'free' ? 'Free' : 'Paid'}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => updateFilter('priceType', 'all')}
                    className='h-4 w-4 p-0 hover:bg-blue-200'
                  >
                    <X className='h-2 w-2' />
                  </Button>
                </div>
              )}
              {(typeof filters.minPrice === 'number' || typeof filters.maxPrice === 'number') && (
                <div className='flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs'>
                  Range: ${filters.minPrice ?? 0} - ${filters.maxPrice ?? 1000}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      const next: FilterState = { ...filters, minPrice: undefined, maxPrice: undefined };
                      setFilters(next);
                      onFiltersChange(next);
                    }}
                    className='h-4 w-4 p-0 hover:bg-blue-200'
                  >
                    <X className='h-2 w-2' />
                  </Button>
                </div>
              )}
              <Button
                variant='ghost'
                size='sm'
                onClick={clearFilters}
                className='text-xs text-muted-foreground hover:text-foreground'
              >
                Clear all
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

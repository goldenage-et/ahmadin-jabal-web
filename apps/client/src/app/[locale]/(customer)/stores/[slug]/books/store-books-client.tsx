'use client';

import { useState } from 'react';
import { TStoreDetail, TBookBasic, TUserBasic } from '@repo/common';
import { StoreLayout } from '../components/store-layout';
import { BookGrid } from '../components/book-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Grid, List } from 'lucide-react';

interface StoreBooksClientProps {
  store: TStoreDetail;
  books: TBookBasic[];
  user?: TUserBasic | null;
}

export function StoreBooksClient({
  store,
  books,
  user,
}: StoreBooksClientProps) {
  const [activeTab, setActiveTab] = useState('books');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter books based on search query
  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'rating':
        aValue = a.rating || 0;
        bValue = b.rating || 0;
        break;
      case 'createdAt':
      default:
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <StoreLayout
      store={store}
      user={user}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
        {/* Page Header */}
        <div className='mb-6 sm:mb-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-2'>
            Books from {store.name}
          </h1>
          <p className='text-sm sm:text-base text-gray-600'>
            {books.length} books available
          </p>
        </div>

        {/* Filters and Search */}
        <div className='bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8'>
          <div className='flex flex-col lg:flex-row gap-4'>
            {/* Search */}
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  placeholder='Search books...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            {/* Sort By */}
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='w-full sm:w-[180px]'>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='createdAt'>Newest</SelectItem>
                  <SelectItem value='name'>Name</SelectItem>
                  <SelectItem value='price'>Price</SelectItem>
                  <SelectItem value='rating'>Rating</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className='w-full sm:w-[120px]'>
                  <SelectValue placeholder='Order' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='desc'>Descending</SelectItem>
                  <SelectItem value='asc'>Ascending</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className='flex border rounded-md'>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => setViewMode('grid')}
                  className='rounded-r-none'
                >
                  <Grid className='h-4 w-4' />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => setViewMode('list')}
                  className='rounded-l-none'
                >
                  <List className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className='mb-4'>
          <p className='text-sm text-gray-600'>
            Showing {sortedBooks.length} of {books.length} books
          </p>
        </div>

        {/* Book Grid */}
        <BookGrid books={sortedBooks} />
      </div>
    </StoreLayout>
  );
}

'use client';
import { BooksFilters } from './books-filters';
import React, { useState } from 'react';
import {
  TBookBasic,
  TCategoryBasic,
  TBookQueryFilter,
  EBookStatus,
} from '@repo/common';
import { BulkActions } from './bulk-actions';
import { BooksTable } from './books-table';
import { BooksGrid } from './books-grid';

export default function BookList({
  books,
  categories,
  searchParams,
}: {
  books: TBookBasic[];
  categories: TCategoryBasic[];
  searchParams: Partial<TBookQueryFilter>;
}) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  return (
    <div className='space-y-4'>
      {/* Advanced Filters */}
      <BooksFilters categories={categories} currentFilters={searchParams} viewMode={viewMode} setViewMode={setViewMode} />

      {/* Bulk Actions */}
      <BulkActions selectedBooks={selectedBooks} />

      {/* Books Display */}
      {viewMode === 'table' ? (
        <BooksTable
          books={books}
          categories={categories}
          selectedBooks={selectedBooks}
          setSelectedBooks={setSelectedBooks}
        />
      ) : (
        <BooksGrid
          books={books}
          categories={categories}
          selectedBooks={selectedBooks}
          setSelectedBooks={setSelectedBooks}
        />
      )}
    </div>
  );
}

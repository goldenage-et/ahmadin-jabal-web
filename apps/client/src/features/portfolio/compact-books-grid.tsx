'use client';

import { Button } from '@/components/ui/button';
import { TBookBasic } from '@repo/common';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { BookCard } from '../book/book-card';

interface CompactBooksGridProps {
  books: TBookBasic[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  maxBooks?: number;
  layout?: 'grid' | 'horizontal' | 'mixed';
}

export function CompactBooksGrid({
  books,
  title,
  subtitle,
  showViewAll = true,
  maxBooks = 12,
  layout = 'grid',
}: CompactBooksGridProps) {
  const displayedBooks = books.slice(0, maxBooks);
  if (displayedBooks.length === 0) {
    return null;
  }

  return (
    <section
      id={`books-grid-${title.toLowerCase().replace(/\s+/g, '-')}`}
      className='w-full py-12 bg-background'
    >
      <div className='w-full px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='w-full flex items-center justify-between mb-8'>
          <div>
            <h2 className='text-2xl md:text-3xl font-bold text-foreground mb-2'>
              {title}
            </h2>
            {subtitle && <p className='text-muted-foreground'>{subtitle}</p>}
          </div>
          {showViewAll && (
            <Link href='/books'>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-2'
              >
                View All
                <ArrowRight className='h-4 w-4' />
              </Button>
            </Link>
          )}
        </div>

        {/* Books Grid */}
        {layout === 'grid' && (
          <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-4'>
            {displayedBooks.map((book, index) =>
              <BookCard key={book.id} book={book} viewMode='grid' size='small' />,
            )}
          </div>
        )}

        {layout === 'horizontal' && (
          <div className='w-full flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
            {displayedBooks.map((book, index) => (
              <div key={book.id} className='w-full'>
                <BookCard book={book} viewMode='list' size='medium' />
              </div>
            ))}
          </div>
        )}

        {layout === 'mixed' && (
          <div className='w-full space-y-6'>
            {displayedBooks[0] && (
              <div className='w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                <div className='lg:col-span-1'>
                  <BookCard book={displayedBooks[0]} viewMode='grid' size='medium' />
                </div>
                <div className='w-full grid grid-cols-2 gap-3'>
                  {displayedBooks.slice(1, 5).map((book, index) =>
                    <BookCard key={book.id} book={book} viewMode='grid' size='medium' />,
                  )}
                </div>
              </div>
            )}

            {displayedBooks.length > 5 && (
              <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
                {displayedBooks.slice(5).map((book, index) =>
                  <BookCard key={book.id} book={book} viewMode='grid' size='medium' />,
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

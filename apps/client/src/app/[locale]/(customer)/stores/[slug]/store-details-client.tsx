'use client';

import { useState } from 'react';
import { TStoreDetail, TBookBasic, TUserBasic } from '@repo/common';
import { StoreLayout } from './components/store-layout';
import { HeroBanner } from './components/hero-banner';
import { BookGrid } from './components/book-grid';
import { RecentlyViewed } from './components/recently-viewed';

interface StoreDetailsClientProps {
  store: TStoreDetail;
  books: TBookBasic[];
  user?: TUserBasic | null;
}

export function StoreDetailsClient({
  store,
  books,
  user,
}: StoreDetailsClientProps) {
  const [activeTab, setActiveTab] = useState('home');

  // Defensive programming - ensure we have valid data
  if (!store) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Store not found
          </h1>
          <p className='text-gray-600'>
            The store you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const safeBooks = books || [];

  return (
    <StoreLayout
      store={store}
      user={user}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Hero Banner */}
      <HeroBanner />

      {/* Recently Viewed Section */}
      <RecentlyViewed books={safeBooks.slice(0, 6)} />

      {/* Main Book Grid */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
        <div className='mb-6 sm:mb-8'>
          <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-2'>
            View more deals
          </h2>
          <p className='text-sm sm:text-base text-gray-600'>
            Discover amazing books from {store.name || 'this store'}
          </p>
        </div>

        <BookGrid books={safeBooks} />
      </div>
    </StoreLayout>
  );
}

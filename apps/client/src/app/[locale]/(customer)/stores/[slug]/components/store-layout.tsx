'use client';

import { TStoreDetail, TUserBasic } from '@repo/common';
import { StoreHeader } from './store-header';
import { StoreNavigation } from './store-navigation';

interface StoreLayoutProps {
  store: TStoreDetail;
  user?: TUserBasic | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export function StoreLayout({
  store,
  user,
  activeTab,
  onTabChange,
  children,
}: StoreLayoutProps) {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Store Header */}
      <StoreHeader store={store} user={user} />

      {/* Store Navigation */}
      <StoreNavigation activeTab={activeTab} onTabChange={onTabChange} />

      {/* Page Content */}
      {children}
    </div>
  );
}

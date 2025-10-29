import { Navigation } from '@/layout/navigation';
import { ReactNode } from 'react';
import { getAllCategoriesWithSubcategories } from './lib/categories';
import { getAuth } from '@/actions/auth.action';
import { getPopularSearchAnalytics } from '@/actions/book.action';

export default async function Layout({ children }: { children: ReactNode }) {
  const { user } = await getAuth();
  const categories = await getAllCategoriesWithSubcategories();
  const searchSuggestions = await getPopularSearchAnalytics().catch(() => ({
    popularEvents: [],
    trendingEvents: [],
    recentEvents: [],
  }));

  return (
    <div className='min-h-screen'>
      <Navigation
        user={user}
        categories={categories}
        searchSuggestions={searchSuggestions}
      />
      {children}
    </div>
  );
}

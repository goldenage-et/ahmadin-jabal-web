import { getManyBooks } from '@/actions/book.action';
import { getCategories } from '@/actions/category.action';
import { BookClient } from '@/features/book/book-client';
import { TBookQueryFilter } from '@repo/common';
import { Suspense } from 'react';

// Force dynamic rendering since we use server actions
export const dynamic = 'force-dynamic';

interface BookPageProps {
  searchParams: Promise<{
    search?: string;
    categoryName?: string;
    subcategoryName?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    inStock?: string;
    featured?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function ShopPage({
  searchParams: searchParamsPromise,
}: BookPageProps) {
  // Build query parameters from search params
  const searchParams = await searchParamsPromise;
  const queryParams: Partial<TBookQueryFilter> = {
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit) : 20,
    sortBy: (searchParams.sortBy as any) || 'createdAt',
    sortOrder: (searchParams.sortOrder as any) || 'desc',
    status: 'active' as any,
  };

  if (searchParams.search) queryParams.search = searchParams.search;
  if (searchParams.categoryName) queryParams.categoryName = searchParams.categoryName;
  if (searchParams.subcategoryName) queryParams.subcategoryName = searchParams.subcategoryName;
  if (searchParams.minPrice)
    queryParams.minPrice = parseFloat(searchParams.minPrice);
  if (searchParams.maxPrice)
    queryParams.maxPrice = parseFloat(searchParams.maxPrice);
  if (searchParams.minRating)
    queryParams.minRating = parseFloat(searchParams.minRating);
  if (searchParams.inStock)
    queryParams.inStock = searchParams.inStock === 'true';
  if (searchParams.featured)
    queryParams.featured = searchParams.featured === 'true';

  // Fetch data in parallel
  const [booksResponse, categoriesResponse] =
    await Promise.all([
      getManyBooks(queryParams),
      getCategories(),
    ]);

  // Extract data from responses
  const books = booksResponse.data || [];
  const totalBooks = booksResponse.meta?.total || 0;
  const categories = categoriesResponse.error ? [] : categoriesResponse;

  return (
    <div className='min-h-screen bg-gray-50'>
      <Suspense fallback={<div>Loading...</div>}>
        <BookClient
          books={books}
          totalBooks={totalBooks}
          categories={categories}
        />
      </Suspense>
    </div>
  );
}

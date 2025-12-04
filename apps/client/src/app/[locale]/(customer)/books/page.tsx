import { getManyBooks } from '@/actions/book.action';
import { getCategories } from '@/actions/category.action';
import { BookClient } from '@/features/book/book-client';
import {
  TBookBasic,
  TBookListResponse,
  TBookQueryFilter,
  TCategoryBasic,
  EBookStatus,
  isErrorResponse,
} from '@repo/common';
import { Suspense } from 'react';
import { ErrorState } from '@/components/error-state';

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

  // Valid sortBy values according to ZBookQueryFilter schema
  const validSortBy = [
    'title',
    'price',
    'rating',
    'reviewCount',
    'createdAt',
    'updatedAt',
    'featured',
  ] as const;

  const queryParams: Partial<TBookQueryFilter> = {
    page: searchParams.page ? parseInt(searchParams.page, 10) || 1 : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit, 10) || 20 : 20,
    sortBy: (validSortBy.includes(searchParams.sortBy as any)
      ? searchParams.sortBy
      : 'createdAt') as TBookQueryFilter['sortBy'],
    sortOrder:
      searchParams.sortOrder === 'asc' || searchParams.sortOrder === 'desc'
        ? searchParams.sortOrder
        : 'desc',
    status: EBookStatus.active,
  };

  if (searchParams.search) queryParams.search = searchParams.search;
  if (searchParams.categoryName)
    queryParams.categoryName = searchParams.categoryName;
  if (searchParams.subcategoryName)
    queryParams.subcategoryName = searchParams.subcategoryName;

  // Parse and validate numeric values
  if (searchParams.minPrice) {
    const parsed = parseFloat(searchParams.minPrice);
    if (!isNaN(parsed) && parsed >= 0) {
      queryParams.minPrice = parsed;
    }
  }
  if (searchParams.maxPrice) {
    const parsed = parseFloat(searchParams.maxPrice);
    if (!isNaN(parsed) && parsed >= 0) {
      queryParams.maxPrice = parsed;
    }
  }
  if (searchParams.minRating) {
    const parsed = parseFloat(searchParams.minRating);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 5) {
      queryParams.minRating = parsed;
    }
  }

  // Parse boolean values
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

  // Handle books response errors
  if (isErrorResponse(booksResponse)) {
    return (
      <ErrorState
        title='Error Loading Books'
        message={booksResponse.message}
      />
    );
  }

  // Handle categories response errors
  if (isErrorResponse(categoriesResponse)) {
    return (
      <ErrorState
        title='Error Loading Categories'
        message={categoriesResponse.message}
      />
    );
  }

  // Extract data from responses
  // booksResponse is TBookListResponse when successful: { data: TBookBasic[], meta: TPagination }
  const booksListResponse = booksResponse as TBookListResponse;
  const books: TBookBasic[] = booksListResponse?.data || [];
  const totalBooks = booksListResponse?.meta?.total || 0;

  // categoriesResponse is TCategoryBasic[] when successful (array directly)
  const categories: TCategoryBasic[] = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : [];

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

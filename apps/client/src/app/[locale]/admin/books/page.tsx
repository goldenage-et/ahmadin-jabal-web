import { getCategories } from '@/actions/categories.action';
import { getManyBooks } from '@/actions/book.action';
import BookList from '@/features/book/book-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  EBookStatus,
  TBookQueryFilter,
  TBookBasic,
  TBookListResponse,
  TCategoryBasic,
  isErrorResponse,
} from '@repo/common';
import { ErrorState } from '@/components/error-state';
import {
  AlertTriangle,
  Download,
  BookOpen,
  Plus,
  Star,
  TrendingUp,
  Upload,
} from 'lucide-react';
import Link from 'next/link';

interface BooksPageProps {
  searchParams: Promise<Partial<TBookQueryFilter>>;
}

export default async function BooksPage({
  searchParams: searchParamsPromise,
}: BooksPageProps) {
  const searchParams = await searchParamsPromise;
  // Fetch data on the server
  const [booksResponse, categoriesResponse] = await Promise.all([
    getManyBooks(searchParams),
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

  // categoriesResponse is TCategoryBasic[] when successful (array directly)
  const categories: TCategoryBasic[] = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : [];

  // Calculate stats from real data
  const stats = {
    totalBooks: books.length,
    activeBooks: books.filter((p) => p.status === EBookStatus.active)
      .length,
    lowStockBooks: books.filter(
      (p) =>
        (p.inventoryQuantity || 0) <= (p.inventoryLowStockThreshold || 0),
    ).length,
    averageRating:
      books.length > 0
        ? Math.round(
          (books.reduce((sum, p) => sum + (p.rating || 0), 0) /
            books.length) *
          10,
        ) / 10
        : 0,
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
      <div className='container mx-auto px-4 py-6 space-y-8'>
        {/* Enhanced Header */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground dark:text-foreground'>
              Books
            </h1>
            <p className='text-muted-foreground mt-1'>
              Manage your book catalog and inventory
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <Button variant='outline' size='sm'>
              <Download className='h-4 w-4 mr-2' />
              Export
            </Button>
            <Button variant='outline' size='sm'>
              <Upload className='h-4 w-4 mr-2' />
              Import
            </Button>
            <Button
              asChild
              className='bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/90'
            >
              <Link href='/admin/books/create'>
                <Plus className='h-4 w-4 mr-2' />
                Add Book
              </Link>
            </Button>
          </div>
        </div>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <Card className='border-0 shadow-sm bg-linear-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-900/10'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                    Total Books
                  </p>
                  <p className='text-3xl font-bold text-blue-900 dark:text-blue-100'>
                    {stats.totalBooks}
                  </p>
                  <p className='text-xs text-blue-600 dark:text-blue-400 mt-1'>
                    All books in catalog
                  </p>
                </div>
                <div className='p-3 bg-blue-500/10 rounded-full'>
                  <BookOpen className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='border-0 shadow-sm bg-linear-to-br from-green-50 to-green-100/50 dark:from-green-900/10 dark:to-green-900/10'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-green-600 dark:text-green-400'>
                    Active Books
                  </p>
                  <p className='text-3xl font-bold text-green-900 dark:text-green-100'>
                    {stats.activeBooks}
                  </p>
                  <p className='text-xs text-green-600 dark:text-green-400 mt-1'>
                    Currently selling
                  </p>
                </div>
                <div className='p-3 bg-green-500/10 rounded-full'>
                  <TrendingUp className='h-6 w-6 text-green-600 dark:text-green-400' />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='border-0 shadow-sm bg-linear-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/10 dark:to-orange-900/10'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-orange-600 dark:text-orange-400'>
                    Low Stock
                  </p>
                  <p className='text-3xl font-bold text-orange-900 dark:text-orange-100'>
                    {stats.lowStockBooks}
                  </p>
                  <p className='text-xs text-orange-600 dark:text-orange-400 mt-1'>
                    Need restocking
                  </p>
                </div>
                <div className='p-3 bg-orange-500/10 dark:bg-orange-900/10 rounded-full'>
                  <AlertTriangle className='h-6 w-6 text-orange-600 dark:text-orange-400' />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='border-0 shadow-sm bg-linear-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/10 dark:to-yellow-900/10'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-yellow-600 dark:text-yellow-400'>
                    Avg Rating
                  </p>
                  <p className='text-3xl font-bold text-yellow-900 dark:text-yellow-100'>
                    {stats.averageRating}
                  </p>
                  <p className='text-xs text-yellow-600 dark:text-yellow-400 mt-1'>
                    Customer satisfaction
                  </p>
                </div>
                <div className='p-3 bg-yellow-500/10 rounded-full'>
                  <Star className='h-6 w-6 text-yellow-600 dark:text-yellow-400' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <BookList
          books={books}
          categories={categories}
          searchParams={searchParams}
        />
      </div>
    </div>
  );
}

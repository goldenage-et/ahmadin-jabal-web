import { getCategories } from '@/actions/categories.action';
import { getManyBooks } from '@/actions/book.action';
import BookList from '@/features/book/components/book-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EBookStatus, TBookQueryFilter } from '@repo/common';
import {
  AlertTriangle,
  Download,
  Package,
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

  // Handle responses
  const books = booksResponse.data;
  const categories = categoriesResponse;

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
    <div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100'>
      <div className='container mx-auto px-4 py-6 space-y-8'>
        {/* Enhanced Header */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-slate-900'>
              Books
            </h1>
            <p className='text-slate-600 mt-1'>
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
              className='bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
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
          <Card className='border-0 shadow-sm bg-linear-to-br from-blue-50 to-blue-100/50'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-blue-600'>
                    Total Books
                  </p>
                  <p className='text-3xl font-bold text-blue-900'>
                    {stats.totalBooks}
                  </p>
                  <p className='text-xs text-blue-600 mt-1'>
                    All books in catalog
                  </p>
                </div>
                <div className='p-3 bg-blue-500/10 rounded-full'>
                  <Package className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='border-0 shadow-sm bg-linear-to-br from-green-50 to-green-100/50'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-green-600'>
                    Active Books
                  </p>
                  <p className='text-3xl font-bold text-green-900'>
                    {stats.activeBooks}
                  </p>
                  <p className='text-xs text-green-600 mt-1'>
                    Currently selling
                  </p>
                </div>
                <div className='p-3 bg-green-500/10 rounded-full'>
                  <TrendingUp className='h-6 w-6 text-green-600' />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='border-0 shadow-sm bg-linear-to-br from-orange-50 to-orange-100/50'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-orange-600'>
                    Low Stock
                  </p>
                  <p className='text-3xl font-bold text-orange-900'>
                    {stats.lowStockBooks}
                  </p>
                  <p className='text-xs text-orange-600 mt-1'>
                    Need restocking
                  </p>
                </div>
                <div className='p-3 bg-orange-500/10 rounded-full'>
                  <AlertTriangle className='h-6 w-6 text-orange-600' />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='border-0 shadow-sm bg-linear-to-br from-yellow-50 to-yellow-100/50'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-yellow-600'>
                    Avg Rating
                  </p>
                  <p className='text-3xl font-bold text-yellow-900'>
                    {stats.averageRating}
                  </p>
                  <p className='text-xs text-yellow-600 mt-1'>
                    Customer satisfaction
                  </p>
                </div>
                <div className='p-3 bg-yellow-500/10 rounded-full'>
                  <Star className='h-6 w-6 text-yellow-600' />
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

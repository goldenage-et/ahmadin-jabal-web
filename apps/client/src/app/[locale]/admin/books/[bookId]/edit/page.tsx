import { getCategories } from '@/actions/category.action';
import { getBook } from '@/actions/book.action';
import EditBookForm from '@/features/book/edit-book-form';
import { Button } from '@/components/ui/button';
import {
  TBookDetail,
  TCategoryBasic,
  isErrorResponse,
} from '@repo/common';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ErrorState } from '@/components/error-state';

type PageProps = {
  params: Promise<{
    bookId: string;
  }>;
};

export default async function EditBookPage({ params }: PageProps) {
  const { bookId } = await params;

  // Fetch data in parallel
  const [bookResponse, categoriesResponse] = await Promise.all([
    getBook(bookId),
    getCategories(),
  ]);

  // Handle book response errors
  if (isErrorResponse(bookResponse)) {
    return (
      <ErrorState
        title='Book Not Found'
        message={bookResponse.message || 'The book you are looking for does not exist.'}
      />
    );
  }

  // Handle categories response errors
  if (isErrorResponse(categoriesResponse)) {
    return (
      <ErrorState
        title='Error Loading Categories'
        message={categoriesResponse.message || 'Failed to load categories.'}
      />
    );
  }

  const book = bookResponse as TBookDetail;
  const categories = categoriesResponse as TCategoryBasic[];

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-6 space-y-6'>
        {/* Header */}
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href={`/admin/books/${bookId}`}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Book
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground'>
              Edit Book
            </h1>
            <p className='text-muted-foreground mt-1'>
              Update book information and settings
            </p>
          </div>
        </div>
        <EditBookForm book={book} categories={categories} />
      </div>
    </div>
  );
}

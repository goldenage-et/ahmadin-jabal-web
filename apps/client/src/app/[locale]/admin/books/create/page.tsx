import { getCategories } from '@/actions/category.action';
import CreateBookForm from '@/features/book/create-book-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  TCategoryBasic,
  isErrorResponse,
} from '@repo/common';
import { ErrorState } from '@/components/error-state';

export default async function CreateBookPage() {
  const categoryResponse = await getCategories();

  if (isErrorResponse(categoryResponse)) {
    return (
      <ErrorState
        title='Error Loading Categories'
        message={categoryResponse.message || 'Failed to load categories.'}
      />
    );
  }

  const categories = categoryResponse as TCategoryBasic[];

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-6 space-y-6'>
        {/* Header */}
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href='/admin/books'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground'>
              Create Book
            </h1>
            <p className='text-muted-foreground'>
              Add a new book to your catalog
            </p>
          </div>
        </div>
        <CreateBookForm categories={categories} />
      </div>
    </div>
  );
}

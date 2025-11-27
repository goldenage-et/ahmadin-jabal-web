import { getCategories } from '@/actions/categories.action';
import { getBook } from '@/actions/book.action';
import EditBookForm from '@/features/book/edit-book-form';
import { Button } from '@/components/ui/button';
import { TCategoryBasic } from '@repo/common';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  params: Promise<{
    bookId: string;
  }>;
};

export default async function EditBookPage({ params }: PageProps) {
  const { bookId } = await params;
  const bookResponse = await getBook(bookId);

  if (!bookResponse || bookResponse.error) {
    throw new Error('Book not found');
  }

  const book = bookResponse;
  const categoriesResponse = await getCategories();

  const categories = categoriesResponse;

  let category: TCategoryBasic | undefined = undefined;
  if (categories.length > 0) {
    category = categories.find((cat) => cat.id === book.categoryId);
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900/10 dark:via-slate-900/10 dark:to-slate-900/10'>
      <div className='container mx-auto px-4 py-6 space-y-8'>
        {/* Enhanced Header */}
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href={`/admin/books/${bookId}`}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Book
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
              Edit Book
            </h1>
            <p className='text-slate-600 mt-1 dark:text-slate-400'>
              Update book information and settings
            </p>
          </div>
        </div>
        <EditBookForm
          book={book}
          categories={categories}
        />
      </div>
    </div>
  );
}

import { getAuth } from '@/actions/auth.action';
import { getCategories } from '@/actions/categories.action';
import CreateBookForm from '@/features/book/components/create-book-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Link } from 'lucide-react';

export default async function CreateBookPage() {
  const categoryResponse = await getCategories();
  return (
    <div className='space-y-6 p-6  mx-auto'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='sm' asChild>
          <Link href='/admin/books'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back
          </Link>
        </Button>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Create Book</h1>
          <p className='text-muted-foreground'>
            Add a new book to your catalog
          </p>
        </div>
      </div>
      <CreateBookForm
        categories={categoryResponse}
      />
    </div>
  );
}

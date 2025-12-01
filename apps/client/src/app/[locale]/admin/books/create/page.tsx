import { getCategories } from '@/actions/categories.action';
import CreateBookForm from '@/features/book/create-book-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Link } from 'lucide-react';

export default async function CreateBookPage() {
  const categoryResponse = await getCategories();
  return (
    <div className='space-y-6 p-6  mx-auto bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='sm' asChild>
          <Link href='/admin/books'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back
          </Link>
        </Button>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-foreground dark:text-foreground'>Create Book</h1>
          <p className='text-muted-foreground dark:text-muted-foreground'>
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


87611778228440
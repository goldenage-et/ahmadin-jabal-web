import CreatePhotoForm from '@/features/media/create-photo-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function CreatePhotoPage() {
  return (
    <div className='space-y-6 p-6 mx-auto bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='sm' asChild>
          <Link href='/admin/media/photo-gallery'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back
          </Link>
        </Button>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-foreground dark:text-foreground'>
            Create Photo
          </h1>
          <p className='text-muted-foreground dark:text-muted-foreground'>
            Add a new photo
          </p>
        </div>
      </div>
      <CreatePhotoForm />
    </div>
  );
}


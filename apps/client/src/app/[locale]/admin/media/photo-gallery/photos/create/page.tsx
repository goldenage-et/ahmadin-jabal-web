import CreatePhotoForm from '@/features/media/create-photo-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function CreatePhotoPage() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-6 space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href='/admin/media/photo-gallery'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground'>
              Create Photo
            </h1>
            <p className='text-muted-foreground'>
              Add a new photo
            </p>
          </div>
        </div>
        <CreatePhotoForm />
      </div>
    </div>
  );
}



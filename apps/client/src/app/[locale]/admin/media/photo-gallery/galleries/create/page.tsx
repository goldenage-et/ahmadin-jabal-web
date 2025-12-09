import CreateGalleryForm from '@/features/media/create-gallery-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function CreateGalleryPage() {
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
              Create Gallery
            </h1>
            <p className='text-muted-foreground'>
              Add a new photo gallery
            </p>
          </div>
        </div>
        <CreateGalleryForm />
      </div>
    </div>
  );
}



import { getPhoto } from '@/actions/media.action';
import EditPhotoForm from '@/features/media/edit-photo-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { isErrorResponse } from '@repo/common';
import { ErrorState } from '@/components/error-state';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPhotoPage({ params }: PageProps) {
  const { id } = await params;
  const photoResponse = await getPhoto(id);

  if (isErrorResponse(photoResponse)) {
    return (
      <ErrorState
        title='Photo Not Found'
        message={photoResponse.message || 'The photo you are looking for does not exist.'}
      />
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-6 space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href={`/admin/media/photo-gallery/photos/${id}`}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Photo
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground'>
              Edit Photo
            </h1>
            <p className='text-muted-foreground mt-1'>
              Update photo information and settings
            </p>
          </div>
        </div>
        <EditPhotoForm photo={photoResponse} />
      </div>
    </div>
  );
}



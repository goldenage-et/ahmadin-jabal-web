import { getGallery } from '@/actions/media.action';
import EditGalleryForm from '@/features/media/edit-gallery-form';
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

export default async function EditGalleryPage({ params }: PageProps) {
  const { id } = await params;
  const galleryResponse = await getGallery(id);

  if (isErrorResponse(galleryResponse)) {
    return (
      <ErrorState
        title='Gallery Not Found'
        message={galleryResponse.message || 'The gallery you are looking for does not exist.'}
      />
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-6 space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href={`/admin/media/photo-gallery/galleries/${id}`}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Gallery
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground'>
              Edit Gallery
            </h1>
            <p className='text-muted-foreground mt-1'>
              Update gallery information and settings
            </p>
          </div>
        </div>
        <EditGalleryForm gallery={galleryResponse} />
      </div>
    </div>
  );
}



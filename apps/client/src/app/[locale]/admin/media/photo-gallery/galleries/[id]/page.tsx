import { getGallery } from '@/actions/media.action';
import GalleryDetail from '@/features/media/gallery-detail';
import { notFound } from 'next/navigation';
import { isErrorResponse } from '@repo/common';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GalleryPage({ params }: PageProps) {
  const { id } = await params;
  const galleryResponse = await getGallery(id);

  if (!galleryResponse || isErrorResponse(galleryResponse)) {
    notFound();
  }

  return (
    <div className='space-y-6 p-6'>
      <GalleryDetail gallery={galleryResponse} />
    </div>
  );
}


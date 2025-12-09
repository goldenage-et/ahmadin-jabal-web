import { getPhoto } from '@/actions/media.action';
import PhotoDetail from '@/features/media/photo-detail';
import { notFound } from 'next/navigation';
import { isErrorResponse } from '@repo/common';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PhotoPage({ params }: PageProps) {
  const { id } = await params;
  const photoResponse = await getPhoto(id);

  if (!photoResponse || isErrorResponse(photoResponse)) {
    notFound();
  }

  return (
    <div className='space-y-6 p-6'>
      <PhotoDetail photo={photoResponse} />
    </div>
  );
}



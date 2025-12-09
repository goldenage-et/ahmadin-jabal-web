import { getAudio } from '@/actions/media.action';
import AudioDetail from '@/features/media/audio-detail';
import { notFound } from 'next/navigation';
import { isErrorResponse } from '@repo/common';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AudioPage({ params }: PageProps) {
  const { id } = await params;
  const audioResponse = await getAudio(id);

  if (!audioResponse || isErrorResponse(audioResponse)) {
    notFound();
  }

  return (
    <div className='space-y-6 p-6'>
      <AudioDetail audio={audioResponse} />
    </div>
  );
}



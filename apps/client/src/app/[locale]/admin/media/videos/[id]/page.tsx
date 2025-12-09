import { getVideo } from '@/actions/media.action';
import VideoDetail from '@/features/media/video-detail';
import { notFound } from 'next/navigation';
import { isErrorResponse } from '@repo/common';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function VideoPage({ params }: PageProps) {
  const { id } = await params;
  const videoResponse = await getVideo(id);

  if (!videoResponse || isErrorResponse(videoResponse)) {
    notFound();
  }

  return (
    <div className='space-y-6 p-6'>
      <VideoDetail video={videoResponse} />
    </div>
  );
}



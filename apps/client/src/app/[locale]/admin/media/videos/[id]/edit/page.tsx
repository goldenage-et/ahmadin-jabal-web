import { getVideo } from '@/actions/media.action';
import EditVideoForm from '@/features/media/edit-video-form';
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

export default async function EditVideoPage({ params }: PageProps) {
  const { id } = await params;
  const videoResponse = await getVideo(id);

  if (isErrorResponse(videoResponse)) {
    return (
      <ErrorState
        title='Video Not Found'
        message={videoResponse.message || 'The video you are looking for does not exist.'}
      />
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-6 space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href={`/admin/media/videos/${id}`}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Video
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground'>
              Edit Video
            </h1>
            <p className='text-muted-foreground mt-1'>
              Update video information and settings
            </p>
          </div>
        </div>
        <EditVideoForm video={videoResponse} />
      </div>
    </div>
  );
}



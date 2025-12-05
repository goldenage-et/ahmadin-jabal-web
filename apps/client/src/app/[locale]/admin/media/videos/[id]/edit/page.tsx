import { getVideo } from '@/actions/media.action';
import EditVideoForm from '@/features/media/edit-video-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isErrorResponse } from '@repo/common';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditVideoPage({ params }: PageProps) {
  const { id } = await params;
  const videoResponse = await getVideo(id);

  if (!videoResponse || isErrorResponse(videoResponse)) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
      <div className='container mx-auto px-4 py-6 space-y-8'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href={`/admin/media/videos/${id}`}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Video
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground dark:text-foreground'>
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


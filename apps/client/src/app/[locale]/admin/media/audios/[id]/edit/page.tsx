import { getAudio } from '@/actions/media.action';
import EditAudioForm from '@/features/media/edit-audio-form';
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

export default async function EditAudioPage({ params }: PageProps) {
  const { id } = await params;
  const audioResponse = await getAudio(id);

  if (isErrorResponse(audioResponse)) {
    return (
      <ErrorState
        title='Audio Not Found'
        message={audioResponse.message || 'The audio you are looking for does not exist.'}
      />
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-6 space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href={`/admin/media/audios/${id}`}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Audio
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground'>
              Edit Audio
            </h1>
            <p className='text-muted-foreground mt-1'>
              Update audio information and settings
            </p>
          </div>
        </div>
        <EditAudioForm audio={audioResponse} />
      </div>
    </div>
  );
}



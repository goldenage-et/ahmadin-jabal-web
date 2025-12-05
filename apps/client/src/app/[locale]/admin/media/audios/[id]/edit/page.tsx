import { getAudio } from '@/actions/media.action';
import EditAudioForm from '@/features/media/edit-audio-form';
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

export default async function EditAudioPage({ params }: PageProps) {
  const { id } = await params;
  const audioResponse = await getAudio(id);

  if (!audioResponse || isErrorResponse(audioResponse)) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
      <div className='container mx-auto px-4 py-6 space-y-8'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href={`/admin/media/audios/${id}`}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Audio
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground dark:text-foreground'>
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


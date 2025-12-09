import CreateAudioForm from '@/features/media/create-audio-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function CreateAudioPage() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-6 space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href='/admin/media/audios'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground'>
              Create Audio
            </h1>
            <p className='text-muted-foreground'>
              Add a new audio file
            </p>
          </div>
        </div>
        <CreateAudioForm />
      </div>
    </div>
  );
}



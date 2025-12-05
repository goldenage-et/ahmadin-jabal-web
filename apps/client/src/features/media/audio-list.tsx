'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TAudioBasic, EMediaStatus } from '@repo/common';
import { Headphones, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteAudio } from '@/actions/media.action';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { toast } from 'sonner';

interface AudioListProps {
  audios: TAudioBasic[];
}

export default function AudioList({ audios }: AudioListProps) {
  const router = useRouter();
  const { mutate: deleteMutate, isLoading: isDeleting } = useApiMutation();

  const getStatusBadge = (status: EMediaStatus) => {
    switch (status) {
      case 'draft':
        return (
          <Badge variant='default' className='bg-gray-500'>
            Draft
          </Badge>
        );
      case 'published':
        return (
          <Badge variant='default' className='bg-green-500'>
            Published
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge variant='default' className='bg-yellow-500'>
            Scheduled
          </Badge>
        );
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  const handleDelete = (id: string) => {
    deleteMutate(async () => await deleteAudio(id), {
      onSuccess: () => {
        router.refresh();
        toast.success('Audio deleted successfully');
      },
      errorMessage: 'Failed to delete audio',
    });
  };

  if (audios.length === 0) {
    return (
      <Card>
        <CardContent className='p-12 text-center'>
          <Headphones className='h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50' />
          <p className='text-muted-foreground'>No audio files found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-4'>
      {audios.map((audio) => (
        <Card key={audio.id} className='hover:shadow-md transition-shadow'>
          <CardContent className='p-6'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex-1 space-y-2'>
                <div className='flex items-center gap-2'>
                  <h3 className='text-lg font-semibold'>{audio.title}</h3>
                  {getStatusBadge(audio.status as EMediaStatus)}
                  {audio.featured && (
                    <Badge variant='default' className='bg-yellow-500'>
                      Featured
                    </Badge>
                  )}
                </div>
                {audio.description && (
                  <p className='text-sm text-muted-foreground line-clamp-2'>
                    {audio.description}
                  </p>
                )}
                <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                  {audio.url && (
                    <a
                      href={audio.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
                    >
                      Listen
                    </a>
                  )}
                  {audio.publishedAt && (
                    <span>
                      Published: {format(new Date(audio.publishedAt), 'PP')}
                    </span>
                  )}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Button variant='ghost' size='sm' asChild>
                  <Link href={`/admin/media/audios/${audio.id}`}>
                    View
                  </Link>
                </Button>
                <Button variant='ghost' size='sm' asChild>
                  <Link href={`/admin/media/audios/${audio.id}/edit`}>
                    <Edit className='h-4 w-4' />
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      disabled={isDeleting}
                    >
                      <Trash2 className='h-4 w-4 text-destructive' />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the audio file.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(audio.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


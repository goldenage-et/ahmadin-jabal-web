'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TAudioDetail, EMediaStatus } from '@repo/common';
import {
  Edit,
  Trash2,
  Headphones,
  Calendar,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
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

interface AudioDetailProps {
  audio: TAudioDetail;
}

export default function AudioDetail({ audio }: AudioDetailProps) {
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

  const handleDelete = () => {
    deleteMutate(async () => await deleteAudio(audio.id), {
      onSuccess: () => {
        router.push('/admin/media/audios');
        toast.success('Audio deleted successfully');
      },
      errorMessage: 'Failed to delete audio',
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Button variant='ghost' size='sm' asChild>
          <Link href='/admin/media/audios'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Audios
          </Link>
        </Button>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' asChild>
            <Link href={`/admin/media/audios/${audio.id}/edit`}>
              <Edit className='h-4 w-4 mr-2' />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' size='sm' disabled={isDeleting}>
                <Trash2 className='h-4 w-4 mr-2' />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  audio file.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-2'>
                {getStatusBadge(audio.status as EMediaStatus)}
                {audio.featured && (
                  <Badge variant='default' className='bg-yellow-500'>
                    Featured
                  </Badge>
                )}
              </div>
              <CardTitle className='text-3xl'>{audio.title}</CardTitle>
              {audio.titleEn && (
                <p className='text-muted-foreground mt-2'>{audio.titleEn}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          {audio.url && (
            <div className='space-y-2'>
              <h3 className='font-semibold'>Audio URL</h3>
              <a
                href={audio.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:underline flex items-center gap-2'
              >
                <ExternalLink className='h-4 w-4' />
                {audio.url}
              </a>
            </div>
          )}

          {audio.description && (
            <div>
              <h3 className='font-semibold mb-2'>Description</h3>
              <p className='text-muted-foreground'>{audio.description}</p>
            </div>
          )}

          <Separator />

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {audio.publishedAt && (
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Published</p>
                  <p className='font-semibold text-xs'>
                    {format(new Date(audio.publishedAt), 'PP')}
                  </p>
                </div>
              </div>
            )}
            {audio.duration && (
              <div className='flex items-center gap-2'>
                <Headphones className='h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Duration</p>
                  <p className='font-semibold text-xs'>{audio.duration}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


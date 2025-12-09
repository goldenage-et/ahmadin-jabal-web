'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TPhotoDetail, EMediaStatus } from '@repo/common';
import {
  Edit,
  Trash2,
  Image as ImageIcon,
  Calendar,
  ArrowLeft,
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
import { deletePhoto } from '@/actions/media.action';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { toast } from 'sonner';

interface PhotoDetailProps {
  photo: TPhotoDetail;
}

export default function PhotoDetail({ photo }: PhotoDetailProps) {
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
    deleteMutate(async () => await deletePhoto(photo.id), {
      onSuccess: () => {
        router.push('/admin/media/photo-gallery');
        toast.success('Photo deleted successfully');
      },
      errorMessage: 'Failed to delete photo',
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Button variant='ghost' size='sm' asChild>
          <Link href='/admin/media/photo-gallery'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Photo Gallery
          </Link>
        </Button>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' asChild>
            <Link href={`/admin/media/photo-gallery/photos/${photo.id}/edit`}>
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
                  photo.
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
                {getStatusBadge(photo.status as EMediaStatus)}
                {photo.featured && (
                  <Badge variant='default' className='bg-yellow-500'>
                    Featured
                  </Badge>
                )}
              </div>
              <CardTitle className='text-3xl'>
                {photo.caption || 'Untitled Photo'}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          {photo.url && (
            <div className='relative w-full h-96 rounded-lg overflow-hidden'>
              <img
                src={photo.url}
                alt={photo.caption || 'Photo'}
                className='w-full h-full object-contain'
              />
            </div>
          )}

          {photo.description && (
            <div>
              <h3 className='font-semibold mb-2'>Description</h3>
              <p className='text-muted-foreground'>{photo.description}</p>
            </div>
          )}

          <Separator />

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {photo.publishedAt && (
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Published</p>
                  <p className='font-semibold text-xs'>
                    {format(new Date(photo.publishedAt), 'PP')}
                  </p>
                </div>
              </div>
            )}
            {photo.url && (
              <div className='flex items-center gap-2'>
                <ImageIcon className='h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>URL</p>
                  <p className='font-semibold text-xs truncate max-w-[150px]'>
                    {photo.url}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



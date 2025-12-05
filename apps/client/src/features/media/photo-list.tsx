'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TPhotoBasic, EMediaStatus } from '@repo/common';
import { Image as ImageIcon, Edit, Trash2 } from 'lucide-react';
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

interface PhotoListProps {
  photos: TPhotoBasic[];
}

export default function PhotoList({ photos }: PhotoListProps) {
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
    deleteMutate(async () => await deletePhoto(id), {
      onSuccess: () => {
        router.refresh();
        toast.success('Photo deleted successfully');
      },
      errorMessage: 'Failed to delete photo',
    });
  };

  if (photos.length === 0) {
    return (
      <Card>
        <CardContent className='p-12 text-center'>
          <ImageIcon className='h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50' />
          <p className='text-muted-foreground'>No photos found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-4'>
      {photos.map((photo) => (
        <Card key={photo.id} className='hover:shadow-md transition-shadow'>
          <CardContent className='p-6'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex items-center gap-4 flex-1'>
                {photo.url && (
                  <div className='relative w-20 h-20 rounded-lg overflow-hidden'>
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Photo'}
                      className='w-full h-full object-cover'
                    />
                  </div>
                )}
                <div className='flex-1 space-y-2'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-semibold'>
                      {photo.caption || 'Untitled Photo'}
                    </h3>
                    {getStatusBadge(photo.status as EMediaStatus)}
                    {photo.featured && (
                      <Badge variant='default' className='bg-yellow-500'>
                        Featured
                      </Badge>
                    )}
                  </div>
                  {photo.description && (
                    <p className='text-sm text-muted-foreground line-clamp-2'>
                      {photo.description}
                    </p>
                  )}
                  <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                    {photo.publishedAt && (
                      <span>
                        Published:{' '}
                        {format(new Date(photo.publishedAt), 'PP')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Button variant='ghost' size='sm' asChild>
                  <Link href={`/admin/media/photos/${photo.id}`}>
                    View
                  </Link>
                </Button>
                <Button variant='ghost' size='sm' asChild>
                  <Link href={`/admin/media/photos/${photo.id}/edit`}>
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
                        delete the photo.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(photo.id)}
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


'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TGalleryDetail, EMediaStatus } from '@repo/common';
import {
  Edit,
  Trash2,
  Folder,
  Calendar,
  ArrowLeft,
  Image as ImageIcon,
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
import { deleteGallery } from '@/actions/media.action';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { toast } from 'sonner';

interface GalleryDetailProps {
  gallery: TGalleryDetail;
}

export default function GalleryDetail({ gallery }: GalleryDetailProps) {
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
    deleteMutate(async () => await deleteGallery(gallery.id), {
      onSuccess: () => {
        router.push('/admin/media');
        toast.success('Gallery deleted successfully');
      },
      errorMessage: 'Failed to delete gallery',
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Button variant='ghost' size='sm' asChild>
          <Link href='/admin/media'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Media
          </Link>
        </Button>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' asChild>
            <Link href={`/admin/media/galleries/${gallery.id}/edit`}>
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
                  gallery.
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
                {getStatusBadge(gallery.status as EMediaStatus)}
                {gallery.featured && (
                  <Badge variant='default' className='bg-yellow-500'>
                    Featured
                  </Badge>
                )}
              </div>
              <CardTitle className='text-3xl'>{gallery.title}</CardTitle>
              {gallery.titleEn && (
                <p className='text-muted-foreground mt-2'>{gallery.titleEn}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          {gallery.coverImage && (
            <div className='relative w-full h-64 rounded-lg overflow-hidden'>
              <img
                src={gallery.coverImage}
                alt={gallery.title}
                className='w-full h-full object-cover'
              />
            </div>
          )}

          {gallery.description && (
            <div>
              <h3 className='font-semibold mb-2'>Description</h3>
              <p className='text-muted-foreground'>{gallery.description}</p>
            </div>
          )}

          <Separator />

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='flex items-center gap-2'>
              <Folder className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Slug</p>
                <p className='font-semibold text-xs'>{gallery.slug}</p>
              </div>
            </div>
            {gallery.category && (
              <div className='flex items-center gap-2'>
                <ImageIcon className='h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Category</p>
                  <p className='font-semibold text-xs'>{gallery.category}</p>
                </div>
              </div>
            )}
            {gallery.publishedAt && (
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Published</p>
                  <p className='font-semibold text-xs'>
                    {format(new Date(gallery.publishedAt), 'PP')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {gallery.photos && gallery.photos.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className='font-semibold mb-4'>
                  Photos ({gallery.photos.length})
                </h3>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  {gallery.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className='relative aspect-square rounded-lg overflow-hidden'
                    >
                      <img
                        src={photo.photo?.url || '/placeholder.jpg'}
                        alt={photo.photo?.caption || 'Gallery photo'}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}



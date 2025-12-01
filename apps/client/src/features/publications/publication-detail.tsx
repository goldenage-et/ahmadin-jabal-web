'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TPublicationDetail, EPublicationStatus } from '@repo/common';
import {
  Edit,
  Trash2,
  Eye,
  Heart,
  Download,
  Calendar,
  ArrowLeft,
  Tag,
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
import { deletePublication } from '@/actions/publication.action';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { toast } from 'sonner';

interface PublicationDetailProps {
  publication: TPublicationDetail;
}

export default function PublicationDetail({
  publication,
}: PublicationDetailProps) {
  const router = useRouter();
  const { mutate: deleteMutate, isLoading: isDeleting } = useApiMutation();

  const getStatusBadge = (status: EPublicationStatus) => {
    switch (status) {
      case EPublicationStatus.published:
        return (
          <Badge variant='default' className='bg-green-500'>
            Published
          </Badge>
        );
      case EPublicationStatus.draft:
        return (
          <Badge variant='secondary' className='bg-gray-500'>
            Draft
          </Badge>
        );
      case EPublicationStatus.archived:
        return (
          <Badge variant='outline'>Archived</Badge>
        );
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  const handleDelete = () => {
    deleteMutate(async () => await deletePublication(publication.id), {
      onSuccess: () => {
        router.push('/admin/publications');
        toast.success('Publication deleted successfully');
      },
      errorMessage: 'Failed to delete publication',
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Button variant='ghost' size='sm' asChild>
          <Link href='/admin/publications'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Publications
          </Link>
        </Button>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' asChild>
            <Link href={`/admin/publications/${publication.id}/edit`}>
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
                  publication.
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
                {getStatusBadge(publication.status as EPublicationStatus)}
                {publication.featured && (
                  <Badge variant='default' className='bg-yellow-500'>
                    Featured
                  </Badge>
                )}
                {publication.isPremium && (
                  <Badge variant='outline'>Premium</Badge>
                )}
              </div>
              <CardTitle className='text-3xl'>{publication.title}</CardTitle>
              {publication.titleEn && (
                <p className='text-muted-foreground mt-2'>{publication.titleEn}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          {publication.featuredImage && (
            <div className='relative w-full h-64 rounded-lg overflow-hidden'>
              <img
                src={publication.featuredImage}
                alt={publication.title}
                className='w-full h-full object-cover'
              />
            </div>
          )}

          {publication.excerpt && (
            <div>
              <h3 className='font-semibold mb-2'>Excerpt</h3>
              <p className='text-muted-foreground'>{publication.excerpt}</p>
            </div>
          )}

          {publication.content && (
            <div>
              <h3 className='font-semibold mb-2'>Content</h3>
              <div
                className='prose dark:prose-invert max-w-none'
                dangerouslySetInnerHTML={{
                  __html:
                    typeof publication.content === 'string'
                      ? publication.content
                      : JSON.stringify(publication.content),
                }}
              />
            </div>
          )}

          <Separator />

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='flex items-center gap-2'>
              <Eye className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Views</p>
                <p className='font-semibold'>{publication.viewCount || 0}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Heart className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Likes</p>
                <p className='font-semibold'>{publication.likeCount || 0}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Download className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Downloads</p>
                <p className='font-semibold'>{publication.downloadCount || 0}</p>
              </div>
            </div>
            {publication.publishedAt && (
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Published</p>
                  <p className='font-semibold text-xs'>
                    {format(new Date(publication.publishedAt), 'PP')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {publication.tags && publication.tags.length > 0 && (
            <div>
              <h3 className='font-semibold mb-2 flex items-center gap-2'>
                <Tag className='h-4 w-4' />
                Tags
              </h3>
              <div className='flex flex-wrap gap-2'>
                {publication.tags.map((tag) => (
                  <Badge key={tag} variant='secondary'>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}



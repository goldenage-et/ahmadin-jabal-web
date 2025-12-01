'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TGalleryBasic, EMediaStatus } from '@repo/common';
import { Folder, Edit } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface GalleryListProps {
  galleries: TGalleryBasic[];
}

export default function GalleryList({ galleries }: GalleryListProps) {
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

  if (galleries.length === 0) {
    return (
      <Card>
        <CardContent className='p-12 text-center'>
          <Folder className='h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50' />
          <p className='text-muted-foreground'>No galleries found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-4'>
      {galleries.map((gallery) => (
        <Card key={gallery.id} className='hover:shadow-md transition-shadow'>
          <CardContent className='p-6'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex-1 space-y-2'>
                <div className='flex items-center gap-2'>
                  <h3 className='text-lg font-semibold'>{gallery.title}</h3>
                  {getStatusBadge(gallery.status as EMediaStatus)}
                  {gallery.featured && (
                    <Badge variant='default' className='bg-yellow-500'>
                      Featured
                    </Badge>
                  )}
                </div>
                {gallery.description && (
                  <p className='text-sm text-muted-foreground line-clamp-2'>
                    {gallery.description}
                  </p>
                )}
                <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                  <span>Slug: {gallery.slug}</span>
                  {gallery.publishedAt && (
                    <span>
                      Published: {format(new Date(gallery.publishedAt), 'PP')}
                    </span>
                  )}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Button variant='ghost' size='sm' asChild>
                  <Link href={`/admin/media/galleries/${gallery.id}`}>
                    View
                  </Link>
                </Button>
                <Button variant='ghost' size='sm' asChild>
                  <Link href={`/admin/media/galleries/${gallery.id}/edit`}>
                    <Edit className='h-4 w-4' />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}



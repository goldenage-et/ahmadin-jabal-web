import { getManyPhotos, getManyGalleries } from '@/actions/media.action';
import PhotoList from '@/features/media/photo-list';
import GalleryList from '@/features/media/gallery-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Folder, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { isErrorResponse } from '@repo/common';

export default async function PhotoGalleryPage() {
  const [photosResponse, galleriesResponse] = await Promise.all([
    getManyPhotos({ limit: 100 }),
    getManyGalleries({ limit: 100 }),
  ]);

  const photos = isErrorResponse(photosResponse) || !photosResponse.data
    ? []
    : photosResponse.data || [];

  const galleries = isErrorResponse(galleriesResponse) || !galleriesResponse.data
    ? []
    : galleriesResponse.data || [];

  const totalPhotos = isErrorResponse(photosResponse) || !photosResponse.data
    ? 0
    : photosResponse.meta?.total || 0;

  const totalGalleries = isErrorResponse(galleriesResponse) || !galleriesResponse.data
    ? 0
    : galleriesResponse.meta?.total || 0;

  return (
    <div className='min-h-screen bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
      <div className='container mx-auto px-4 py-6 space-y-8'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/admin/media'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back to Media
              </Link>
            </Button>
            <div>
              <h1 className='text-3xl font-bold tracking-tight text-foreground dark:text-foreground'>
                Photo Gallery
              </h1>
              <p className='text-muted-foreground mt-1'>
                Manage photos and galleries
              </p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <Button variant='outline' asChild>
              <Link href='/admin/media/photo-gallery/photos/create'>
                <Plus className='h-4 w-4 mr-2' />
                New Photo
              </Link>
            </Button>
            <Button variant='outline' asChild>
              <Link href='/admin/media/photo-gallery/galleries/create'>
                <Plus className='h-4 w-4 mr-2' />
                New Gallery
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Card className='border-0 shadow-sm bg-linear-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-900/10'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                    Photos
                  </p>
                  <p className='text-3xl font-bold text-blue-900 dark:text-blue-100'>
                    {totalPhotos}
                  </p>
                </div>
                <div className='p-3 bg-blue-500/10 rounded-full'>
                  <Image className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-sm bg-linear-to-br from-green-50 to-green-100/50 dark:from-green-900/10 dark:to-green-900/10'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-green-600 dark:text-green-400'>
                    Galleries
                  </p>
                  <p className='text-3xl font-bold text-green-900 dark:text-green-100'>
                    {totalGalleries}
                  </p>
                </div>
                <div className='p-3 bg-green-500/10 rounded-full'>
                  <Folder className='h-6 w-6 text-green-600 dark:text-green-400' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Photos and Galleries */}
        <Tabs defaultValue='photos' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='photos'>Photos ({totalPhotos})</TabsTrigger>
            <TabsTrigger value='galleries'>
              Galleries ({totalGalleries})
            </TabsTrigger>
          </TabsList>

          <TabsContent value='photos'>
            <PhotoList photos={photos} />
          </TabsContent>

          <TabsContent value='galleries'>
            <GalleryList galleries={galleries} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


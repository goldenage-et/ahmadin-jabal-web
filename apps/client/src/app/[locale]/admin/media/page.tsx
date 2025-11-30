import {
    getManyVideos,
    getManyAudios,
    getManyPhotos,
    getManyGalleries,
} from '@/actions/media.action';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Headphones, Image, Folder, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function MediaPage() {
    const [videosResponse, audiosResponse, photosResponse, galleriesResponse] =
        await Promise.all([
            getManyVideos({ limit: 5 }),
            getManyAudios({ limit: 5 }),
            getManyPhotos({ limit: 5 }),
            getManyGalleries({ limit: 5 }),
        ]);

    const videos =
        videosResponse.error || !videosResponse.data
            ? []
            : videosResponse.data || [];
    const audios =
        audiosResponse.error || !audiosResponse.data
            ? []
            : audiosResponse.data || [];
    const photos =
        photosResponse.error || !photosResponse.data
            ? []
            : photosResponse.data || [];
    const galleries =
        galleriesResponse.error || !galleriesResponse.data
            ? []
            : galleriesResponse.data || [];

    const stats = {
        totalVideos:
            videosResponse.error || !videosResponse.data
                ? 0
                : videosResponse.meta?.total || 0,
        totalAudios:
            audiosResponse.error || !audiosResponse.data
                ? 0
                : audiosResponse.meta?.total || 0,
        totalPhotos:
            photosResponse.error || !photosResponse.data
                ? 0
                : photosResponse.meta?.total || 0,
        totalGalleries:
            galleriesResponse.error || !galleriesResponse.data
                ? 0
                : galleriesResponse.meta?.total || 0,
    };

    return (
        <div className='min-h-screen bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
            <div className='container mx-auto px-4 py-6 space-y-8'>
                {/* Header */}
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight text-foreground dark:text-foreground'>
                            Media & Gallery
                        </h1>
                        <p className='text-muted-foreground mt-1'>
                            Manage videos, audio, photos, and galleries
                        </p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <Button variant='outline' asChild>
                            <Link href='/admin/media/galleries/create'>
                                <Plus className='h-4 w-4 mr-2' />
                                New Gallery
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    <Card className='border-0 shadow-sm bg-linear-to-br from-red-50 to-red-100/50 dark:from-red-900/10 dark:to-red-900/10'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-red-600 dark:text-red-400'>
                                        Videos
                                    </p>
                                    <p className='text-3xl font-bold text-red-900 dark:text-red-100'>
                                        {stats.totalVideos}
                                    </p>
                                </div>
                                <div className='p-3 bg-red-500/10 rounded-full'>
                                    <Play className='h-6 w-6 text-red-600 dark:text-red-400' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='border-0 shadow-sm bg-linear-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/10 dark:to-purple-900/10'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-purple-600 dark:text-purple-400'>
                                        Audio
                                    </p>
                                    <p className='text-3xl font-bold text-purple-900 dark:text-purple-100'>
                                        {stats.totalAudios}
                                    </p>
                                </div>
                                <div className='p-3 bg-purple-500/10 rounded-full'>
                                    <Headphones className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='border-0 shadow-sm bg-linear-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-900/10'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                                        Photos
                                    </p>
                                    <p className='text-3xl font-bold text-blue-900 dark:text-blue-100'>
                                        {stats.totalPhotos}
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
                                        {stats.totalGalleries}
                                    </p>
                                </div>
                                <div className='p-3 bg-green-500/10 rounded-full'>
                                    <Folder className='h-6 w-6 text-green-600 dark:text-green-400' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Links */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    <Card className='hover:shadow-md transition-shadow'>
                        <CardContent className='p-6'>
                            <div className='space-y-2'>
                                <h3 className='font-semibold'>Videos</h3>
                                <p className='text-sm text-muted-foreground'>
                                    {videos.length} recent videos
                                </p>
                                <Button variant='outline' size='sm' className='w-full mt-4' asChild>
                                    <Link href='/admin/media/videos'>Manage Videos</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='hover:shadow-md transition-shadow'>
                        <CardContent className='p-6'>
                            <div className='space-y-2'>
                                <h3 className='font-semibold'>Audio</h3>
                                <p className='text-sm text-muted-foreground'>
                                    {audios.length} recent audio files
                                </p>
                                <Button variant='outline' size='sm' className='w-full mt-4' asChild>
                                    <Link href='/admin/media/audios'>Manage Audio</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='hover:shadow-md transition-shadow'>
                        <CardContent className='p-6'>
                            <div className='space-y-2'>
                                <h3 className='font-semibold'>Photos</h3>
                                <p className='text-sm text-muted-foreground'>
                                    {photos.length} recent photos
                                </p>
                                <Button variant='outline' size='sm' className='w-full mt-4' asChild>
                                    <Link href='/admin/media/photos'>Manage Photos</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='hover:shadow-md transition-shadow'>
                        <CardContent className='p-6'>
                            <div className='space-y-2'>
                                <h3 className='font-semibold'>Galleries</h3>
                                <p className='text-sm text-muted-foreground'>
                                    {galleries.length} recent galleries
                                </p>
                                <Button variant='outline' size='sm' className='w-full mt-4' asChild>
                                    <Link href='/admin/media/galleries'>Manage Galleries</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

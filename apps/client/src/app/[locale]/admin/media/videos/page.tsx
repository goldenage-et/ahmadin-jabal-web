import { getManyVideos } from '@/actions/media.action';
import VideoList from '@/features/media/video-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { isErrorResponse } from '@repo/common';

export default async function VideosPage() {
  const videosResponse = await getManyVideos({ limit: 100 });

  const videos = isErrorResponse(videosResponse) || !videosResponse.data
    ? []
    : videosResponse.data || [];

  const totalVideos = isErrorResponse(videosResponse) || !videosResponse.data
    ? 0
    : videosResponse.meta?.total || 0;

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
                Videos
              </h1>
              <p className='text-muted-foreground mt-1'>
                Manage video content ({totalVideos} total)
              </p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <Button variant='outline' asChild>
              <Link href='/admin/media/videos/create'>
                <Plus className='h-4 w-4 mr-2' />
                New Video
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Card */}
        <Card className='border-0 shadow-sm bg-linear-to-br from-red-50 to-red-100/50 dark:from-red-900/10 dark:to-red-900/10'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-red-600 dark:text-red-400'>
                  Total Videos
                </p>
                <p className='text-3xl font-bold text-red-900 dark:text-red-100'>
                  {totalVideos}
                </p>
              </div>
              <div className='p-3 bg-red-500/10 rounded-full'>
                <Play className='h-6 w-6 text-red-600 dark:text-red-400' />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Videos List */}
        <VideoList videos={videos} />
      </div>
    </div>
  );
}



'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TVideoDetail, EMediaStatus } from '@repo/common';
import {
    Edit,
    Trash2,
    Play,
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
import { deleteVideo } from '@/actions/media.action';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { toast } from 'sonner';

interface VideoDetailProps {
    video: TVideoDetail;
}

export default function VideoDetail({ video }: VideoDetailProps) {
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
        deleteMutate(async () => await deleteVideo(video.id), {
            onSuccess: () => {
                router.push('/admin/media/videos');
                toast.success('Video deleted successfully');
            },
            errorMessage: 'Failed to delete video',
        });
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <Button variant='ghost' size='sm' asChild>
                    <Link href='/admin/media/videos'>
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Back to Videos
                    </Link>
                </Button>
                <div className='flex items-center gap-2'>
                    <Button variant='outline' size='sm' asChild>
                        <Link href={`/admin/media/videos/${video.id}/edit`}>
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
                                    video.
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
                                {getStatusBadge(video.status as EMediaStatus)}
                                {video.featured && (
                                    <Badge variant='default' className='bg-yellow-500'>
                                        Featured
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className='text-3xl'>{video.title}</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                    {video.url && (
                        <div className='space-y-2'>
                            <h3 className='font-semibold'>Video URL</h3>
                            <a
                                href={video.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-600 hover:underline flex items-center gap-2'
                            >
                                <ExternalLink className='h-4 w-4' />
                                {video.url}
                            </a>
                        </div>
                    )}

                    {video.description && (
                        <div>
                            <h3 className='font-semibold mb-2'>Description</h3>
                            <p className='text-muted-foreground'>{video.description}</p>
                        </div>
                    )}

                    <Separator />

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {video.publishedAt && (
                            <div className='flex items-center gap-2'>
                                <Calendar className='h-4 w-4 text-muted-foreground' />
                                <div>
                                    <p className='text-sm text-muted-foreground'>Published</p>
                                    <p className='font-semibold text-xs'>
                                        {format(new Date(video.publishedAt), 'PP')}
                                    </p>
                                </div>
                            </div>
                        )}
                        {video.duration && (
                            <div className='flex items-center gap-2'>
                                <Play className='h-4 w-4 text-muted-foreground' />
                                <div>
                                    <p className='text-sm text-muted-foreground'>Duration</p>
                                    <p className='font-semibold text-xs'>{video.duration}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


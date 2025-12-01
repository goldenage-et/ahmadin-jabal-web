'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TMediaDetail, TUserBasic, EMediaType, EMediaSource } from '@repo/common';
import {
    Calendar,
    User,
    Tag,
    Eye,
    Download,
    Share2,
    ArrowLeft,
    Play,
    Headphones,
    Image as ImageIcon,
    ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface MediaDetailsProps {
    media: TMediaDetail;
    user: TUserBasic | null;
}

export default function MediaDetails({
    media,
    user,
}: MediaDetailsProps) {
    const router = useRouter();

    const getCategoryColor = (category?: string) => {
        if (!category) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        const colors: Record<string, string> = {
            'Interview': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
            'Speech': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
            'Lecture': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
            'Educational': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
            'Friday Sermon': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
            'Ramadan': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
            'Community': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
            'Youth': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
        };
        return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    };

    const getMediaTypeIcon = (type: string) => {
        switch (type) {
            case EMediaType.video:
                return <Play className='h-5 w-5' />;
            case EMediaType.audio:
                return <Headphones className='h-5 w-5' />;
            case EMediaType.image:
                return <ImageIcon className='h-5 w-5' />;
            default:
                return <ImageIcon className='h-5 w-5' />;
        }
    };

    const renderMediaContent = () => {
        if (media.type === EMediaType.video) {
            // Check if it's a YouTube video
            if (media.externalId && media.source === EMediaSource.youtube) {
                return (
                    <div className='relative w-full aspect-video rounded-lg overflow-hidden'>
                        <iframe
                            src={`https://www.youtube.com/embed/${media.externalId}`}
                            title={media.title}
                            className='w-full h-full'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                        />
                    </div>
                );
            }
            // Regular video
            return (
                <div className='relative w-full aspect-video rounded-lg overflow-hidden bg-black'>
                    {media.url && (
                        <video
                            src={media.url}
                            controls
                            className='w-full h-full'
                            poster={media.thumbnailUrl || undefined}
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>
            );
        }

        if (media.type === EMediaType.audio) {
            return (
                <div className='w-full rounded-lg bg-gray-100 dark:bg-gray-800 p-8'>
                    {media.thumbnailUrl && (
                        <div className='relative w-64 h-64 mx-auto mb-6 rounded-lg overflow-hidden'>
                            <Image
                                src={media.thumbnailUrl}
                                alt={media.title}
                                fill
                                className='object-cover'
                            />
                        </div>
                    )}
                    {media.url && (
                        <audio controls className='w-full'>
                            <source src={media.url} type={media.mimeType || 'audio/mpeg'} />
                            Your browser does not support the audio element.
                        </audio>
                    )}
                </div>
            );
        }

        // Photo/Image
        return (
            <div className='relative w-full aspect-square rounded-lg overflow-hidden'>
                {media.url && (
                    <Image
                        src={media.url}
                        alt={media.title}
                        fill
                        className='object-cover'
                        priority
                    />
                )}
            </div>
        );
    };

    return (
        <div className='space-y-6'>
            {/* Back Button */}
            <Button variant='ghost' size='sm' onClick={() => router.back()}>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back
            </Button>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Main Content */}
                <div className='lg:col-span-2 space-y-6'>
                    {/* Media Content */}
                    <div className='w-full'>
                        {renderMediaContent()}
                    </div>

                    {/* Title and Meta */}
                    <div className='space-y-4'>
                        <div className='flex items-center gap-2 flex-wrap'>
                            {media.category && (
                                <Badge className={getCategoryColor(media.category)}>
                                    {media.category}
                                </Badge>
                            )}
                            <Badge variant='outline' className='flex items-center gap-1'>
                                {getMediaTypeIcon(media.type)}
                                <span className='capitalize'>{media.type}</span>
                            </Badge>
                        </div>

                        <h1 className='text-4xl font-bold text-foreground'>
                            {media.title}
                        </h1>
                        {media.titleEn && (
                            <p className='text-xl text-muted-foreground italic'>
                                {media.titleEn}
                            </p>
                        )}

                        {/* Meta Information */}
                        <div className='flex items-center gap-6 text-sm text-muted-foreground'>
                            {media.uploader && (
                                <div className='flex items-center gap-2'>
                                    <User className='h-4 w-4' />
                                    <span>
                                        {media.uploader.firstName} {media.uploader.middleName}{' '}
                                        {media.uploader.lastName || ''}
                                    </span>
                                </div>
                            )}
                            {media.createdAt && (
                                <div className='flex items-center gap-2'>
                                    <Calendar className='h-4 w-4' />
                                    <span>{format(new Date(media.createdAt), 'MMMM d, yyyy')}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Description */}
                    {media.description && (
                        <div className='space-y-2'>
                            <h2 className='text-2xl font-semibold'>Description</h2>
                            <p className='text-lg text-muted-foreground leading-relaxed'>
                                {media.description}
                            </p>
                        </div>
                    )}

                    {/* External Link */}
                    {media.externalId && media.source === EMediaSource.youtube && (
                        <div className='space-y-2'>
                            <Button
                                variant='outline'
                                asChild
                                className='w-full sm:w-auto'
                            >
                                <a
                                    href={`https://www.youtube.com/watch?v=${media.externalId}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <ExternalLink className='h-4 w-4 mr-2' />
                                    Watch on YouTube
                                </a>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className='lg:col-span-1'>
                    <div className='sticky top-24 space-y-6'>
                        <Card>
                            <CardContent className='p-6 space-y-6'>
                                {/* Media Info */}
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-sm text-muted-foreground'>Type</span>
                                        <Badge variant='outline' className='capitalize'>
                                            {media.type}
                                        </Badge>
                                    </div>
                                    {media.source && (
                                        <div className='flex items-center justify-between'>
                                            <span className='text-sm text-muted-foreground'>Source</span>
                                            <Badge variant='outline' className='capitalize'>
                                                {media.source}
                                            </Badge>
                                        </div>
                                    )}
                                    {media.mimeType && (
                                        <div className='flex items-center justify-between'>
                                            <span className='text-sm text-muted-foreground'>Format</span>
                                            <span className='font-semibold text-sm'>{media.mimeType}</span>
                                        </div>
                                    )}
                                    {media.createdAt && (
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-2 text-muted-foreground'>
                                                <Calendar className='h-4 w-4' />
                                                <span className='text-sm'>Created</span>
                                            </div>
                                            <span className='font-semibold text-xs'>
                                                {format(new Date(media.createdAt), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                {/* Actions */}
                                <div className='space-y-3'>
                                    {media.url && (
                                        <Button
                                            className='w-full'
                                            variant='outline'
                                            asChild
                                        >
                                            <a href={media.url} download target='_blank' rel='noopener noreferrer'>
                                                <Download className='h-4 w-4 mr-2' />
                                                Download
                                            </a>
                                        </Button>
                                    )}
                                    <Button className='w-full' variant='outline'>
                                        <Share2 className='h-4 w-4 mr-2' />
                                        Share Media
                                    </Button>
                                </div>

                                {/* Uploader Info */}
                                {media.uploader && (
                                    <>
                                        <Separator />
                                        <div className='space-y-3'>
                                            <h3 className='font-semibold'>Uploaded By</h3>
                                            <div className='flex items-center gap-3'>
                                                {media.uploader.image && (
                                                    <div className='relative w-12 h-12 rounded-full overflow-hidden'>
                                                        <Image
                                                            src={media.uploader.image}
                                                            alt={media.uploader.firstName}
                                                            fill
                                                            className='object-cover'
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className='font-medium'>
                                                        {media.uploader.firstName} {media.uploader.middleName}{' '}
                                                        {media.uploader.lastName || ''}
                                                    </p>
                                                    <p className='text-sm text-muted-foreground'>
                                                        {media.uploader.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}


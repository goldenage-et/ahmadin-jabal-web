'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TPublicationDetail, TUserBasic } from '@repo/common';
import {
    Heart,
    Calendar,
    User,
    Tag,
    Eye,
    Download,
    Share2,
    ArrowLeft,
    MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { likePublication, downloadPublication } from '@/actions/publication.action';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { toast } from 'sonner';

interface PublicationDetailsProps {
    publication: TPublicationDetail;
    user: TUserBasic | null;
}

export default function PublicationDetails({
    publication,
    user,
}: PublicationDetailsProps) {
    const router = useRouter();
    const { mutate: likeMutate } = useApiMutation();
    const { mutate: downloadMutate } = useApiMutation();

    const handleLike = () => {
        if (!user) {
            toast.error('Please sign in to like publications');
            return;
        }
        likeMutate(async () => await likePublication(publication.id), {
            onSuccess: (data) => {
                if (data?.data) {
                    toast.success('Publication liked!');
                }
            },
            errorMessage: 'Failed to like publication',
        });
    };

    const handleDownload = () => {
        if (!user) {
            toast.error('Please sign in to download publications');
            return;
        }
        downloadMutate(async () => await downloadPublication(publication.id), {
            onSuccess: (data) => {
                if (data?.data) {
                    toast.success('Download started!');
                }
            },
            errorMessage: 'Failed to download publication',
        });
    };

    const getCategoryColor = (category?: string) => {
        if (!category) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        const colors: Record<string, string> = {
            'History': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
            'Education': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
            'Rights': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
            'Leadership': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
        };
        return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
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
                    {/* Featured Image */}
                    {publication.featuredImage && (
                        <div className='relative w-full h-96 rounded-lg overflow-hidden'>
                            <Image
                                src={publication.featuredImage}
                                alt={publication.title}
                                fill
                                className='object-cover'
                                priority
                            />
                        </div>
                    )}

                    {/* Title and Meta */}
                    <div className='space-y-4'>
                        <div className='flex items-center gap-2 flex-wrap'>
                            {publication.category && (
                                <Badge className={getCategoryColor(publication.category.name)}>
                                    {publication.category.name}
                                </Badge>
                            )}
                            {publication.featured && (
                                <Badge variant='default' className='bg-yellow-500'>
                                    Featured
                                </Badge>
                            )}
                            {publication.isPremium && (
                                <Badge variant='outline' className='bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'>
                                    Premium
                                </Badge>
                            )}
                        </div>

                        <h1 className='text-4xl font-bold text-foreground'>
                            {publication.title}
                        </h1>
                        {publication.titleEn && (
                            <p className='text-xl text-muted-foreground italic'>
                                {publication.titleEn}
                            </p>
                        )}

                        {/* Meta Information */}
                        <div className='flex items-center gap-6 text-sm text-muted-foreground'>
                            {publication.author && (
                                <div className='flex items-center gap-2'>
                                    <User className='h-4 w-4' />
                                    <span>
                                        {publication.author.firstName} {publication.author.middleName}{' '}
                                        {publication.author.lastName || ''}
                                    </span>
                                </div>
                            )}
                            {publication.publishedAt && (
                                <div className='flex items-center gap-2'>
                                    <Calendar className='h-4 w-4' />
                                    <span>{format(new Date(publication.publishedAt), 'MMMM d, yyyy')}</span>
                                </div>
                            )}
                            <div className='flex items-center gap-2'>
                                <Eye className='h-4 w-4' />
                                <span>{publication.viewCount || 0} views</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Excerpt */}
                    {publication.excerpt && (
                        <div className='space-y-2'>
                            <h2 className='text-2xl font-semibold'>Summary</h2>
                            <div
                                className='text-lg text-muted-foreground leading-relaxed prose dark:prose-invert'
                                dangerouslySetInnerHTML={{
                                    __html:
                                        typeof publication.excerpt === 'string'
                                            ? publication.excerpt
                                            : JSON.stringify(publication.excerpt),
                                }}
                            />
                        </div>
                    )}

                    {/* Content */}
                    {publication.content && (
                        <div className='space-y-4'>
                            <h2 className='text-2xl font-semibold'>Content</h2>
                            <div
                                className='prose dark:prose-invert max-w-none prose-lg'
                                dangerouslySetInnerHTML={{
                                    __html:
                                        typeof publication.content === 'string'
                                            ? publication.content
                                            : JSON.stringify(publication.content),
                                }}
                            />
                        </div>
                    )}

                    {/* Media Gallery */}
                    {publication.media && publication.media.length > 0 && (
                        <div className='space-y-4'>
                            <h2 className='text-2xl font-semibold'>Media</h2>
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                                {publication.media.map((mediaItem) => (
                                    <div
                                        key={mediaItem.id}
                                        className='relative aspect-square rounded-lg overflow-hidden'
                                    >
                                        <Image
                                            src={mediaItem.url}
                                            alt={mediaItem.alt || publication.title}
                                            fill
                                            className='object-cover'
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {publication.tags && publication.tags.length > 0 && (
                        <div className='space-y-3'>
                            <div className='flex items-center gap-2'>
                                <Tag className='h-5 w-5' />
                                <h3 className='text-lg font-semibold'>Tags</h3>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {publication.tags.map((tag) => (
                                    <Badge key={tag} variant='outline' className='text-sm'>
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className='lg:col-span-1'>
                    <div className='sticky top-24 space-y-6'>
                        <Card>
                            <CardContent className='p-6 space-y-6'>
                                {/* Stats */}
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2 text-muted-foreground'>
                                            <Eye className='h-4 w-4' />
                                            <span className='text-sm'>Views</span>
                                        </div>
                                        <span className='font-semibold'>{publication.viewCount || 0}</span>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2 text-muted-foreground'>
                                            <Heart className='h-4 w-4' />
                                            <span className='text-sm'>Likes</span>
                                        </div>
                                        <span className='font-semibold'>{publication.likeCount || 0}</span>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2 text-muted-foreground'>
                                            <Download className='h-4 w-4' />
                                            <span className='text-sm'>Downloads</span>
                                        </div>
                                        <span className='font-semibold'>{publication.downloadCount || 0}</span>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2 text-muted-foreground'>
                                            <MessageSquare className='h-4 w-4' />
                                            <span className='text-sm'>Comments</span>
                                        </div>
                                        <span className='font-semibold'>{publication.commentCount || 0}</span>
                                    </div>
                                    {publication.publishedAt && (
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-2 text-muted-foreground'>
                                                <Calendar className='h-4 w-4' />
                                                <span className='text-sm'>Published</span>
                                            </div>
                                            <span className='font-semibold text-xs'>
                                                {format(new Date(publication.publishedAt), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                {/* Actions */}
                                <div className='space-y-3'>
                                    <Button
                                        className='w-full'
                                        variant='outline'
                                        onClick={handleLike}
                                    >
                                        <Heart className='h-4 w-4 mr-2' />
                                        Like Publication
                                    </Button>
                                    <Button
                                        className='w-full'
                                        variant='outline'
                                        onClick={handleDownload}
                                    >
                                        <Download className='h-4 w-4 mr-2' />
                                        Download
                                    </Button>
                                    <Button className='w-full' variant='outline'>
                                        <Share2 className='h-4 w-4 mr-2' />
                                        Share Publication
                                    </Button>
                                </div>

                                {/* Author Info */}
                                {publication.author && (
                                    <>
                                        <Separator />
                                        <div className='space-y-3'>
                                            <h3 className='font-semibold'>Author</h3>
                                            <div className='flex items-center gap-3'>
                                                {publication.author.image && (
                                                    <div className='relative w-12 h-12 rounded-full overflow-hidden'>
                                                        <Image
                                                            src={publication.author.image}
                                                            alt={publication.author.firstName}
                                                            fill
                                                            className='object-cover'
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className='font-medium'>
                                                        {publication.author.firstName} {publication.author.middleName}{' '}
                                                        {publication.author.lastName || ''}
                                                    </p>
                                                    <p className='text-sm text-muted-foreground'>
                                                        {publication.author.email}
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


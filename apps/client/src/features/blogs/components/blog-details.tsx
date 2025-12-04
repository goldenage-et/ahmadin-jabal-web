'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TBlogDetail, TUserBasic } from '@repo/common';
import {
    Heart,
    Calendar,
    User,
    Tag,
    Eye,
    Download,
    Share2,
    ArrowLeft,
    FileText,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { likeBlog } from '@/actions/blog.action';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';
import { getLocalizedTitle, getLocalizedExcerpt, getLocalizedContent } from '@/lib/locale-utils';

interface BlogDetailsProps {
    blog: TBlogDetail;
    user: TUserBasic | null;
    locale: 'en' | 'am' | 'om';
}

export default function BlogDetails({
    blog,
    user,
    locale,
}: BlogDetailsProps) {
    const title = getLocalizedTitle(blog, locale);
    const excerpt = getLocalizedExcerpt(blog, locale);
    const content = getLocalizedContent(blog, locale);
    const router = useRouter();
    const { mutate: likeMutate } = useApiMutation();

    const handleLike = () => {
        if (!user) {
            toast.error('Please sign in to like blogs');
            return;
        }
        likeMutate(async () => await likeBlog(blog.id), {
            onSuccess: (data) => {
                if (data) {
                    toast.success('Blog liked!');
                    // Update the like count in the UI if needed
                }
            },
            errorMessage: 'Failed to like blog',
        });
    };

    const getCategoryColor = (category?: string) => {
        if (!category) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        const colors: Record<string, string> = {
            'Education': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
            'Community': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
            'Advocacy': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
            'History': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
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
                    {blog.featuredImage && (
                        <div className='relative w-full h-96 rounded-lg overflow-hidden'>
                            <Image
                                src={blog.featuredImage}
                                alt={title}
                                fill
                                className='object-cover'
                                priority
                            />
                        </div>
                    )}

                    {/* Title and Meta */}
                    <div className='space-y-4'>
                        <div className='flex items-center gap-2 flex-wrap'>
                            {blog.category && (
                                <Badge className={getCategoryColor(blog.category.name)}>
                                    {blog.category.name}
                                </Badge>
                            )}
                            {blog.featured && (
                                <Badge variant='default' className='bg-yellow-500'>
                                    Featured
                                </Badge>
                            )}
                            {!blog.isFree && blog.price && (
                                <Badge variant='outline'>
                                    {formatPrice(blog.price)}
                                </Badge>
                            )}
                            {blog.isFree && (
                                <Badge variant='default' className='bg-green-600'>
                                    Free
                                </Badge>
                            )}
                        </div>

                        <h1 className='text-4xl font-bold text-foreground'>
                            {title}
                        </h1>
                        {/* Show other language titles as subtitles if available */}
                        {locale === 'en' && blog.titleAm && (
                            <p className='text-xl text-muted-foreground italic'>
                                {blog.titleAm}
                            </p>
                        )}
                        {locale === 'en' && blog.titleOr && (
                            <p className='text-xl text-muted-foreground italic'>
                                {blog.titleOr}
                            </p>
                        )}

                        {/* Meta Information */}
                        <div className='flex items-center gap-6 text-sm text-muted-foreground'>
                            {blog.author && (
                                <div className='flex items-center gap-2'>
                                    <User className='h-4 w-4' />
                                    <span>
                                        {blog.author.firstName} {blog.author.middleName}{' '}
                                        {blog.author.lastName || ''}
                                    </span>
                                </div>
                            )}
                            {blog.publishedAt && (
                                <div className='flex items-center gap-2'>
                                    <Calendar className='h-4 w-4' />
                                    <span>{format(new Date(blog.publishedAt), 'MMMM d, yyyy')}</span>
                                </div>
                            )}
                            <div className='flex items-center gap-2'>
                                <Eye className='h-4 w-4' />
                                <span>{blog.viewCount || 0} views</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Excerpt */}
                    {excerpt && (
                        <div className='space-y-2'>
                            <h2 className='text-2xl font-semibold'>Summary</h2>
                            <p className='text-lg text-muted-foreground leading-relaxed'>
                                {excerpt}
                            </p>
                        </div>
                    )}

                    {/* Content */}
                    {content && (
                        <div className='space-y-4'>
                            <h2 className='text-2xl font-semibold'>Blog Content</h2>
                            <div
                                className='prose dark:prose-invert max-w-none prose-lg'
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        </div>
                    )}

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className='space-y-3'>
                            <div className='flex items-center gap-2'>
                                <Tag className='h-5 w-5' />
                                <h3 className='text-lg font-semibold'>Tags</h3>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {blog.tags.map((tag) => (
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
                                        <span className='font-semibold'>{blog.viewCount || 0}</span>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2 text-muted-foreground'>
                                            <Heart className='h-4 w-4' />
                                            <span className='text-sm'>Likes</span>
                                        </div>
                                        <span className='font-semibold'>{blog.likeCount || 0}</span>
                                    </div>
                                    {blog.publishedAt && (
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-2 text-muted-foreground'>
                                                <Calendar className='h-4 w-4' />
                                                <span className='text-sm'>Published</span>
                                            </div>
                                            <span className='font-semibold text-xs'>
                                                {format(new Date(blog.publishedAt), 'MMM d, yyyy')}
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
                                        Like Blog
                                    </Button>
                                    {blog.isFree && (
                                        <Button className='w-full' variant='outline'>
                                            <Download className='h-4 w-4 mr-2' />
                                            Download PDF
                                        </Button>
                                    )}
                                    <Button className='w-full' variant='outline'>
                                        <Share2 className='h-4 w-4 mr-2' />
                                        Share Blog
                                    </Button>
                                </div>

                                {/* Author Info */}
                                {blog.author && (
                                    <>
                                        <Separator />
                                        <div className='space-y-3'>
                                            <h3 className='font-semibold'>Author</h3>
                                            <div className='flex items-center gap-3'>
                                                {blog.author.image && (
                                                    <div className='relative w-12 h-12 rounded-full overflow-hidden'>
                                                        <Image
                                                            src={blog.author.image}
                                                            alt={blog.author.firstName}
                                                            fill
                                                            className='object-cover'
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className='font-medium'>
                                                        {blog.author.firstName} {blog.author.middleName}{' '}
                                                        {blog.author.lastName || ''}
                                                    </p>
                                                    <p className='text-sm text-muted-foreground'>
                                                        {blog.author.email}
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


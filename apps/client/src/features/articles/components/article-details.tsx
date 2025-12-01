'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TArticleDetail, TUserBasic } from '@repo/common';
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
import { likeArticle } from '@/actions/article.action';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';

interface ArticleDetailsProps {
    article: TArticleDetail;
    user: TUserBasic | null;
}

export default function ArticleDetails({
    article,
    user,
}: ArticleDetailsProps) {
    const router = useRouter();
    const { mutate: likeMutate } = useApiMutation();

    const handleLike = () => {
        if (!user) {
            toast.error('Please sign in to like articles');
            return;
        }
        likeMutate(async () => await likeArticle(article.id), {
            onSuccess: (data) => {
                if (data?.data) {
                    toast.success('Article liked!');
                }
            },
            errorMessage: 'Failed to like article',
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
                    {article.featuredImage && (
                        <div className='relative w-full h-96 rounded-lg overflow-hidden'>
                            <Image
                                src={article.featuredImage}
                                alt={article.title}
                                fill
                                className='object-cover'
                                priority
                            />
                        </div>
                    )}

                    {/* Title and Meta */}
                    <div className='space-y-4'>
                        <div className='flex items-center gap-2 flex-wrap'>
                            {article.category && (
                                <Badge className={getCategoryColor(article.category.name)}>
                                    {article.category.name}
                                </Badge>
                            )}
                            {article.featured && (
                                <Badge variant='default' className='bg-yellow-500'>
                                    Featured
                                </Badge>
                            )}
                            {!article.isFree && article.price && (
                                <Badge variant='outline'>
                                    {formatPrice(article.price)}
                                </Badge>
                            )}
                            {article.isFree && (
                                <Badge variant='default' className='bg-green-600'>
                                    Free
                                </Badge>
                            )}
                        </div>

                        <h1 className='text-4xl font-bold text-foreground'>
                            {article.title}
                        </h1>
                        {article.titleEn && (
                            <p className='text-xl text-muted-foreground italic'>
                                {article.titleEn}
                            </p>
                        )}

                        {/* Meta Information */}
                        <div className='flex items-center gap-6 text-sm text-muted-foreground'>
                            {article.author && (
                                <div className='flex items-center gap-2'>
                                    <User className='h-4 w-4' />
                                    <span>
                                        {article.author.firstName} {article.author.middleName}{' '}
                                        {article.author.lastName || ''}
                                    </span>
                                </div>
                            )}
                            {article.publishedAt && (
                                <div className='flex items-center gap-2'>
                                    <Calendar className='h-4 w-4' />
                                    <span>{format(new Date(article.publishedAt), 'MMMM d, yyyy')}</span>
                                </div>
                            )}
                            <div className='flex items-center gap-2'>
                                <Eye className='h-4 w-4' />
                                <span>{article.viewCount || 0} views</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Excerpt */}
                    {article.excerpt && (
                        <div className='space-y-2'>
                            <h2 className='text-2xl font-semibold'>Summary</h2>
                            <p className='text-lg text-muted-foreground leading-relaxed'>
                                {article.excerpt}
                            </p>
                        </div>
                    )}

                    {/* Content */}
                    {article.content && (
                        <div className='space-y-4'>
                            <h2 className='text-2xl font-semibold'>Article Content</h2>
                            <div
                                className='prose dark:prose-invert max-w-none prose-lg'
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        </div>
                    )}

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className='space-y-3'>
                            <div className='flex items-center gap-2'>
                                <Tag className='h-5 w-5' />
                                <h3 className='text-lg font-semibold'>Tags</h3>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {article.tags.map((tag) => (
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
                                        <span className='font-semibold'>{article.viewCount || 0}</span>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2 text-muted-foreground'>
                                            <Heart className='h-4 w-4' />
                                            <span className='text-sm'>Likes</span>
                                        </div>
                                        <span className='font-semibold'>{article.likeCount || 0}</span>
                                    </div>
                                    {article.publishedAt && (
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-2 text-muted-foreground'>
                                                <Calendar className='h-4 w-4' />
                                                <span className='text-sm'>Published</span>
                                            </div>
                                            <span className='font-semibold text-xs'>
                                                {format(new Date(article.publishedAt), 'MMM d, yyyy')}
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
                                        Like Article
                                    </Button>
                                    {article.isFree && (
                                        <Button className='w-full' variant='outline'>
                                            <Download className='h-4 w-4 mr-2' />
                                            Download PDF
                                        </Button>
                                    )}
                                    <Button className='w-full' variant='outline'>
                                        <Share2 className='h-4 w-4 mr-2' />
                                        Share Article
                                    </Button>
                                </div>

                                {/* Author Info */}
                                {article.author && (
                                    <>
                                        <Separator />
                                        <div className='space-y-3'>
                                            <h3 className='font-semibold'>Author</h3>
                                            <div className='flex items-center gap-3'>
                                                {article.author.image && (
                                                    <div className='relative w-12 h-12 rounded-full overflow-hidden'>
                                                        <Image
                                                            src={article.author.image}
                                                            alt={article.author.firstName}
                                                            fill
                                                            className='object-cover'
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className='font-medium'>
                                                        {article.author.firstName} {article.author.middleName}{' '}
                                                        {article.author.lastName || ''}
                                                    </p>
                                                    <p className='text-sm text-muted-foreground'>
                                                        {article.author.email}
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


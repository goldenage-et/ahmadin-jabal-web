'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TArticleDetail, EArticleStatus } from '@repo/common';
import {
    Edit,
    Trash2,
    Eye,
    Heart,
    Calendar,
    User,
    Tag,
    ArrowLeft,
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
import { deleteArticle } from '@/actions/article.action';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { toast } from 'sonner';

interface ArticleDetailProps {
    article: TArticleDetail;
}

export default function ArticleDetail({ article }: ArticleDetailProps) {
    const router = useRouter();
    const { mutate: deleteMutate, isLoading: isDeleting } = useApiMutation();

    const getStatusBadge = (status: EArticleStatus) => {
        switch (status) {
            case EArticleStatus.published:
                return (
                    <Badge variant='default' className='bg-green-500'>
                        Published
                    </Badge>
                );
            case EArticleStatus.draft:
                return (
                    <Badge variant='secondary' className='bg-gray-500'>
                        Draft
                    </Badge>
                );
            case EArticleStatus.archived:
                return (
                    <Badge variant='outline'>Archived</Badge>
                );
            default:
                return <Badge variant='outline'>{status}</Badge>;
        }
    };

    const handleDelete = () => {
        deleteMutate(async () => await deleteArticle(article.id), {
            onSuccess: () => {
                router.push('/admin/articles');
                toast.success('Article deleted successfully');
            },
            errorMessage: 'Failed to delete article',
        });
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <Button variant='ghost' size='sm' asChild>
                    <Link href='/admin/articles'>
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Back to Articles
                    </Link>
                </Button>
                <div className='flex items-center gap-2'>
                    <Button variant='outline' size='sm' asChild>
                        <Link href={`/admin/articles/${article.id}/edit`}>
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
                                    article.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>
                                    Delete
                                </AlertDialogAction>
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
                                {getStatusBadge(article.status)}
                                {article.featured && (
                                    <Badge variant='default' className='bg-yellow-500'>
                                        Featured
                                    </Badge>
                                )}
                                {!article.isFree && (
                                    <Badge variant='outline'>
                                        ${article.price?.toFixed(2) || '0.00'}
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className='text-3xl'>{article.title}</CardTitle>
                            {article.titleEn && (
                                <p className='text-muted-foreground mt-2'>{article.titleEn}</p>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                    {article.featuredImage && (
                        <div className='relative w-full h-64 rounded-lg overflow-hidden'>
                            <img
                                src={article.featuredImage}
                                alt={article.title}
                                className='w-full h-full object-cover'
                            />
                        </div>
                    )}

                    {article.excerpt && (
                        <div>
                            <h3 className='font-semibold mb-2'>Excerpt</h3>
                            <p className='text-muted-foreground'>{article.excerpt}</p>
                        </div>
                    )}

                    {article.content && (
                        <div>
                            <h3 className='font-semibold mb-2'>Content</h3>
                            <div
                                className='prose dark:prose-invert max-w-none'
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        </div>
                    )}

                    <Separator />

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        <div className='flex items-center gap-2'>
                            <Eye className='h-4 w-4 text-muted-foreground' />
                            <div>
                                <p className='text-sm text-muted-foreground'>Views</p>
                                <p className='font-semibold'>{article.viewCount || 0}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Heart className='h-4 w-4 text-muted-foreground' />
                            <div>
                                <p className='text-sm text-muted-foreground'>Likes</p>
                                <p className='font-semibold'>{article.likeCount || 0}</p>
                            </div>
                        </div>
                        {article.publishedAt && (
                            <div className='flex items-center gap-2'>
                                <Calendar className='h-4 w-4 text-muted-foreground' />
                                <div>
                                    <p className='text-sm text-muted-foreground'>Published</p>
                                    <p className='font-semibold text-xs'>
                                        {format(new Date(article.publishedAt), 'PP')}
                                    </p>
                                </div>
                            </div>
                        )}
                        {article.author && (
                            <div className='flex items-center gap-2'>
                                <User className='h-4 w-4 text-muted-foreground' />
                                <div>
                                    <p className='text-sm text-muted-foreground'>Author</p>
                                    <p className='font-semibold text-xs'>
                                        {article.author.firstName} {article.author.lastName}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {article.tags && article.tags.length > 0 && (
                        <div>
                            <h3 className='font-semibold mb-2 flex items-center gap-2'>
                                <Tag className='h-4 w-4' />
                                Tags
                            </h3>
                            <div className='flex flex-wrap gap-2'>
                                {article.tags.map((tag) => (
                                    <Badge key={tag} variant='secondary'>
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {article.category && (
                        <div>
                            <h3 className='font-semibold mb-2'>Category</h3>
                            <Badge variant='outline'>{article.category.name}</Badge>
                        </div>
                    )}

                    {(article.metaTitle || article.metaDescription) && (
                        <>
                            <Separator />
                            <div>
                                <h3 className='font-semibold mb-2'>SEO Information</h3>
                                {article.metaTitle && (
                                    <div className='mb-2'>
                                        <p className='text-sm text-muted-foreground'>Meta Title</p>
                                        <p>{article.metaTitle}</p>
                                    </div>
                                )}
                                {article.metaDescription && (
                                    <div>
                                        <p className='text-sm text-muted-foreground'>
                                            Meta Description
                                        </p>
                                        <p>{article.metaDescription}</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}


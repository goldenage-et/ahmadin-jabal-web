'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TBlogDetail, EBlogStatus } from '@repo/common';
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
import Image from 'next/image';
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
import { deleteBlog } from '@/actions/blog.action';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';

interface BlogDetailProps {
    blog: TBlogDetail;
}

export default function BlogDetail({ blog }: BlogDetailProps) {
    const router = useRouter();
    const { mutate: deleteMutate, isLoading: isDeleting } = useApiMutation();

    const getStatusBadge = (status: EBlogStatus) => {
        switch (status) {
            case EBlogStatus.published:
                return (
                    <Badge variant='default' className='bg-green-500'>
                        Published
                    </Badge>
                );
            case EBlogStatus.draft:
                return (
                    <Badge variant='secondary' className='bg-gray-500'>
                        Draft
                    </Badge>
                );
            case EBlogStatus.archived:
                return (
                    <Badge variant='outline'>Archived</Badge>
                );
            default:
                return <Badge variant='outline'>{status}</Badge>;
        }
    };

    const handleDelete = () => {
        deleteMutate(async () => await deleteBlog(blog.id), {
            onSuccess: () => {
                router.push('/admin/blogs');
                toast.success('Blog deleted successfully');
            },
            errorMessage: 'Failed to delete blog',
        });
    };

    return (
        <div className='space-y-6'>
            {/* Back Button and Admin Actions */}
            <div className='flex items-center justify-between'>
                <Button variant='ghost' size='sm' asChild>
                    <Link href='/admin/blogs'>
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Back to Blogs
                    </Link>
                </Button>
                <div className='flex items-center gap-2'>
                    <Button variant='outline' size='sm' asChild>
                        <Link href={`/admin/blogs/${blog.id}/edit`}>
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
                                    blog.
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

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Main Content */}
                <div className='lg:col-span-2 space-y-6'>
                    {/* Featured Image */}
                    {blog.featuredImage && (
                        <div className='relative w-full h-96 rounded-lg overflow-hidden'>
                            <Image
                                src={blog.featuredImage}
                                alt={blog.title}
                                fill
                                className='object-cover'
                                priority
                            />
                        </div>
                    )}

                    {/* Title and Meta */}
                    <div className='space-y-4'>
                        <div className='flex items-center gap-2 flex-wrap'>
                            {getStatusBadge(blog.status)}
                            {blog.category && (
                                <Badge variant='outline'>
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
                            {blog.title}
                        </h1>
                        {blog.titleAm && (
                            <p className='text-xl text-muted-foreground'>
                                {blog.titleAm}
                            </p>
                        )}
                        {blog.titleOr && (
                            <p className='text-xl text-muted-foreground'>
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
                    {blog.excerpt && (
                        <div className='space-y-2'>
                            <h2 className='text-2xl font-semibold'>Summary</h2>
                            <p className='text-lg text-muted-foreground leading-relaxed'>
                                {blog.excerpt}
                            </p>
                        </div>
                    )}
                    {blog.excerptAm && (
                        <div className='space-y-2'>
                            <h2 className='text-2xl font-semibold'>Summary (Amharic)</h2>
                            <p className='text-lg text-muted-foreground leading-relaxed'>
                                {blog.excerptAm}
                            </p>
                        </div>
                    )}
                    {blog.excerptOr && (
                        <div className='space-y-2'>
                            <h2 className='text-2xl font-semibold'>Summary (Oromo)</h2>
                            <p className='text-lg text-muted-foreground leading-relaxed'>
                                {blog.excerptOr}
                            </p>
                        </div>
                    )}

                    {/* Content */}
                    {blog.content && (
                        <div className='space-y-4'>
                            <h2 className='text-2xl font-semibold'>Blog Content</h2>
                            <div className='prose dark:prose-invert max-w-none prose-lg'>
                                {typeof blog.content === 'string' ? (
                                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                                ) : blog.content && typeof blog.content === 'object' && 'html' in blog.content ? (
                                    <div dangerouslySetInnerHTML={{ __html: (blog.content as any).html || '' }} />
                                ) : (
                                    <pre className='whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg'>
                                        {JSON.stringify(blog.content, null, 2)}
                                    </pre>
                                )}
                            </div>
                        </div>
                    )}
                    {blog.contentAm && (
                        <div className='space-y-4'>
                            <h2 className='text-2xl font-semibold'>Blog Content (Amharic)</h2>
                            <div className='prose dark:prose-invert max-w-none prose-lg'>
                                {typeof blog.contentAm === 'string' ? (
                                    <div dangerouslySetInnerHTML={{ __html: blog.contentAm }} />
                                ) : blog.contentAm && typeof blog.contentAm === 'object' && 'html' in blog.contentAm ? (
                                    <div dangerouslySetInnerHTML={{ __html: (blog.contentAm as any).html || '' }} />
                                ) : (
                                    <pre className='whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg'>
                                        {JSON.stringify(blog.contentAm, null, 2)}
                                    </pre>
                                )}
                            </div>
                        </div>
                    )}
                    {blog.contentOr && (
                        <div className='space-y-4'>
                            <h2 className='text-2xl font-semibold'>Blog Content (Oromo)</h2>
                            <div className='prose dark:prose-invert max-w-none prose-lg'>
                                {typeof blog.contentOr === 'string' ? (
                                    <div dangerouslySetInnerHTML={{ __html: blog.contentOr }} />
                                ) : blog.contentOr && typeof blog.contentOr === 'object' && 'html' in blog.contentOr ? (
                                    <div dangerouslySetInnerHTML={{ __html: (blog.contentOr as any).html || '' }} />
                                ) : (
                                    <pre className='whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg'>
                                        {JSON.stringify(blog.contentOr, null, 2)}
                                    </pre>
                                )}
                            </div>
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
                                    {blog.createdAt && (
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-2 text-muted-foreground'>
                                                <Calendar className='h-4 w-4' />
                                                <span className='text-sm'>Created</span>
                                            </div>
                                            <span className='font-semibold text-xs'>
                                                {format(new Date(blog.createdAt), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                    )}
                                    {blog.updatedAt && (
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-2 text-muted-foreground'>
                                                <Calendar className='h-4 w-4' />
                                                <span className='text-sm'>Updated</span>
                                            </div>
                                            <span className='font-semibold text-xs'>
                                                {format(new Date(blog.updatedAt), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                {/* Author Info */}
                                {blog.author && (
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
                                )}

                                {blog.category && (
                                    <>
                                        <Separator />
                                        <div className='space-y-2'>
                                            <h3 className='font-semibold'>Category</h3>
                                            <Badge variant='outline'>{blog.category.name}</Badge>
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


'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TArticleBasic, EArticleStatus } from '@repo/common';
import { FileText, Eye, Heart, Edit } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface ArticleListProps {
    articles: TArticleBasic[];
}

export default function ArticleList({ articles }: ArticleListProps) {
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

    if (articles.length === 0) {
        return (
            <Card>
                <CardContent className='p-12 text-center'>
                    <FileText className='h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50' />
                    <p className='text-muted-foreground'>No articles found</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className='space-y-4'>
            {articles.map((article) => (
                <Card key={article.id} className='hover:shadow-md transition-shadow'>
                    <CardContent className='p-6'>
                        <div className='flex items-start justify-between gap-4'>
                            <div className='flex-1 space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <h3 className='text-lg font-semibold'>{article.title}</h3>
                                    {getStatusBadge(article.status)}
                                    {article.featured && (
                                        <Badge variant='default' className='bg-yellow-500'>
                                            Featured
                                        </Badge>
                                    )}
                                </div>
                                {article.excerpt && (
                                    <p className='text-sm text-muted-foreground line-clamp-2'>
                                        {article.excerpt}
                                    </p>
                                )}
                                <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                                    <span className='flex items-center gap-1'>
                                        <Eye className='h-3 w-3' />
                                        {article.viewCount || 0} views
                                    </span>
                                    <span className='flex items-center gap-1'>
                                        <Heart className='h-3 w-3' />
                                        {article.likeCount || 0} likes
                                    </span>
                                    {article.publishedAt && (
                                        <span>
                                            Published: {format(new Date(article.publishedAt), 'PP')}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Button variant='ghost' size='sm' asChild>
                                    <Link href={`/admin/articles/${article.id}`}>
                                        View
                                    </Link>
                                </Button>
                                <Button variant='ghost' size='sm' asChild>
                                    <Link href={`/admin/articles/${article.id}/edit`}>
                                        <Edit className='h-4 w-4' />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}


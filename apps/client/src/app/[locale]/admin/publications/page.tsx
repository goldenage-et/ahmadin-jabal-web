import { getManyPublications } from '@/actions/publication.action';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EPublicationStatus, TPublicationQueryFilter } from '@repo/common';
import { FileText, Plus, Eye, Download, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface PublicationsPageProps {
    searchParams: Promise<Partial<TPublicationQueryFilter>>;
}

export default async function PublicationsPage({
    searchParams: searchParamsPromise,
}: PublicationsPageProps) {
    const searchParams = await searchParamsPromise;
    const publicationsResponse = await getManyPublications(searchParams);

    const publications =
        !publicationsResponse.error && 'data' in publicationsResponse
            ? publicationsResponse.data || []
            : [];
    const meta =
        !publicationsResponse.error && 'meta' in publicationsResponse
            ? publicationsResponse.meta
            : { total: 0, page: 1, limit: 10, totalPages: 0 };

    // Calculate stats
    const stats = {
        totalPublications: meta?.total || publications.length,
        published: publications.filter(
            (p) => p.status === EPublicationStatus.published,
        ).length,
        draft: publications.filter(
            (p) => p.status === EPublicationStatus.draft,
        ).length,
        totalViews: publications.reduce(
            (sum, p) => sum + (p.viewCount || 0),
            0,
        ),
        totalDownloads: publications.reduce(
            (sum, p) => sum + (p.downloadCount || 0),
            0,
        ),
    };

    return (
        <div className='min-h-screen bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
            <div className='container mx-auto px-4 py-6 space-y-8'>
                {/* Header */}
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight text-foreground dark:text-foreground'>
                            Publications
                        </h1>
                        <p className='text-muted-foreground mt-1'>
                            Manage publications and documents
                        </p>
                    </div>
                    <Button asChild>
                        <Link href='/admin/publications/create'>
                            <Plus className='h-4 w-4 mr-2' />
                            Add Publication
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    <Card className='border-0 shadow-sm bg-linear-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-900/10'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                                        Total Publications
                                    </p>
                                    <p className='text-3xl font-bold text-blue-900 dark:text-blue-100'>
                                        {stats.totalPublications}
                                    </p>
                                </div>
                                <div className='p-3 bg-blue-500/10 rounded-full'>
                                    <FileText className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='border-0 shadow-sm bg-linear-to-br from-green-50 to-green-100/50 dark:from-green-900/10 dark:to-green-900/10'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-green-600 dark:text-green-400'>
                                        Published
                                    </p>
                                    <p className='text-3xl font-bold text-green-900 dark:text-green-100'>
                                        {stats.published}
                                    </p>
                                </div>
                                <div className='p-3 bg-green-500/10 rounded-full'>
                                    <CheckCircle className='h-6 w-6 text-green-600 dark:text-green-400' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='border-0 shadow-sm bg-linear-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/10 dark:to-purple-900/10'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-purple-600 dark:text-purple-400'>
                                        Total Views
                                    </p>
                                    <p className='text-3xl font-bold text-purple-900 dark:text-purple-100'>
                                        {stats.totalViews.toLocaleString()}
                                    </p>
                                </div>
                                <div className='p-3 bg-purple-500/10 rounded-full'>
                                    <Eye className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='border-0 shadow-sm bg-linear-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/10 dark:to-orange-900/10'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-orange-600 dark:text-orange-400'>
                                        Downloads
                                    </p>
                                    <p className='text-3xl font-bold text-orange-900 dark:text-orange-100'>
                                        {stats.totalDownloads.toLocaleString()}
                                    </p>
                                </div>
                                <div className='p-3 bg-orange-500/10 rounded-full'>
                                    <Download className='h-6 w-6 text-orange-600 dark:text-orange-400' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Publications List */}
                <Card>
                    <CardContent className='p-6'>
                        <div className='space-y-4'>
                            <h2 className='text-xl font-semibold'>Recent Publications</h2>
                            {publications.length === 0 ? (
                                <p className='text-muted-foreground text-center py-8'>
                                    No publications found
                                </p>
                            ) : (
                                <div className='space-y-2'>
                                    {publications.slice(0, 10).map((publication) => (
                                        <div
                                            key={publication.id}
                                            className='flex items-center justify-between p-3 border rounded-lg hover:bg-accent'
                                        >
                                            <div className='flex-1'>
                                                <h3 className='font-medium'>{publication.title}</h3>
                                                <p className='text-sm text-muted-foreground'>
                                                    {publication.status} • {publication.viewCount} views •{' '}
                                                    {publication.downloadCount} downloads
                                                </p>
                                            </div>
                                            <Button variant='ghost' size='sm' asChild>
                                                <Link href={`/admin/publications/${publication.id}`}>
                                                    View
                                                </Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

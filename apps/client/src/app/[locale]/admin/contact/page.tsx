import { getManyContactSubmissions } from '@/actions/contact.action';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    EContactSubmissionStatus,
    TContactSubmissionQueryFilter,
} from '@repo/common';
import { Mail, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface ContactPageProps {
    searchParams: Promise<Partial<TContactSubmissionQueryFilter>>;
}

export default async function ContactPage({
    searchParams: searchParamsPromise,
}: ContactPageProps) {
    const searchParams = await searchParamsPromise;
    const submissionsResponse = await getManyContactSubmissions(searchParams);

    const submissions =
        !submissionsResponse.error && 'data' in submissionsResponse
            ? submissionsResponse.data || []
            : [];
    const meta =
        !submissionsResponse.error && 'meta' in submissionsResponse
            ? submissionsResponse.meta
            : { total: 0, page: 1, limit: 10, totalPages: 0 };

    // Calculate stats
    const stats = {
        total: meta?.total || submissions.length,
        new: submissions.filter(
            (s) => s.status === EContactSubmissionStatus.new,
        ).length,
        replied: submissions.filter(
            (s) => s.status === EContactSubmissionStatus.replied,
        ).length,
        read: submissions.filter(
            (s) => s.status === EContactSubmissionStatus.read,
        ).length,
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case EContactSubmissionStatus.new:
                return (
                    <Badge variant='default' className='bg-blue-500'>
                        New
                    </Badge>
                );
            case EContactSubmissionStatus.read:
                return (
                    <Badge variant='secondary' className='bg-gray-500'>
                        Read
                    </Badge>
                );
            case EContactSubmissionStatus.replied:
                return (
                    <Badge variant='default' className='bg-green-500'>
                        Replied
                    </Badge>
                );
            default:
                return <Badge variant='outline'>{status}</Badge>;
        }
    };

    return (
        <div className='min-h-screen bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
            <div className='container mx-auto px-4 py-6 space-y-8'>
                {/* Header */}
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight text-foreground dark:text-foreground'>
                            Contact Submissions
                        </h1>
                        <p className='text-muted-foreground mt-1'>
                            Manage contact form submissions and inquiries
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    <Card className='border-0 shadow-sm bg-linear-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-900/10'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                                        Total Submissions
                                    </p>
                                    <p className='text-3xl font-bold text-blue-900 dark:text-blue-100'>
                                        {stats.total}
                                    </p>
                                </div>
                                <div className='p-3 bg-blue-500/10 rounded-full'>
                                    <Mail className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='border-0 shadow-sm bg-linear-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/10 dark:to-orange-900/10'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-orange-600 dark:text-orange-400'>
                                        New
                                    </p>
                                    <p className='text-3xl font-bold text-orange-900 dark:text-orange-100'>
                                        {stats.new}
                                    </p>
                                </div>
                                <div className='p-3 bg-orange-500/10 rounded-full'>
                                    <Clock className='h-6 w-6 text-orange-600 dark:text-orange-400' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='border-0 shadow-sm bg-linear-to-br from-green-50 to-green-100/50 dark:from-green-900/10 dark:to-green-900/10'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-green-600 dark:text-green-400'>
                                        Replied
                                    </p>
                                    <p className='text-3xl font-bold text-green-900 dark:text-green-100'>
                                        {stats.replied}
                                    </p>
                                </div>
                                <div className='p-3 bg-green-500/10 rounded-full'>
                                    <CheckCircle className='h-6 w-6 text-green-600 dark:text-green-400' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='border-0 shadow-sm bg-linear-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/10 dark:to-gray-900/10'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                                        Read
                                    </p>
                                    <p className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                        {stats.read}
                                    </p>
                                </div>
                                <div className='p-3 bg-gray-500/10 rounded-full'>
                                    <MessageSquare className='h-6 w-6 text-gray-600 dark:text-gray-400' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Submissions List */}
                <Card>
                    <CardContent className='p-6'>
                        <div className='space-y-4'>
                            <h2 className='text-xl font-semibold'>Recent Submissions</h2>
                            {submissions.length === 0 ? (
                                <p className='text-muted-foreground text-center py-8'>
                                    No submissions found
                                </p>
                            ) : (
                                <div className='space-y-2'>
                                    {submissions.slice(0, 10).map((submission) => (
                                        <div
                                            key={submission.id}
                                            className='flex items-center justify-between p-3 border rounded-lg hover:bg-accent'
                                        >
                                            <div className='flex-1'>
                                                <div className='flex items-center gap-2 mb-1'>
                                                    <h3 className='font-medium'>{submission.name}</h3>
                                                    {getStatusBadge(submission.status)}
                                                </div>
                                                <p className='text-sm text-muted-foreground'>
                                                    {submission.email} • {submission.subject}
                                                </p>
                                            </div>
                                            <Button variant='ghost' size='sm' asChild>
                                                <Link href={`/admin/contact/${submission.id}`}>
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

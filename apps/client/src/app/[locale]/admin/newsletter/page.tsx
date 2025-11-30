import {
    getManyNewsletters,
} from '@/actions/newsletter.action';
import { getManyNewsletterSubscriptions } from '@/actions/newsletter-subscription.action';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ENewsletterStatus, TNewsletterQueryFilter } from '@repo/common';
import { Mail, Plus, Users, Send } from 'lucide-react';
import Link from 'next/link';

interface NewsletterPageProps {
    searchParams: Promise<Partial<TNewsletterQueryFilter>>;
}

export default async function NewsletterPage({
    searchParams: searchParamsPromise,
}: NewsletterPageProps) {
    const searchParams = await searchParamsPromise;
    const [newslettersResponse, subscriptionsResponse] = await Promise.all([
        getManyNewsletters(searchParams),
        getManyNewsletterSubscriptions({ limit: 5 }),
    ]);

    const newsletters =
        !newslettersResponse.error && 'data' in newslettersResponse
            ? newslettersResponse.data || []
            : [];
    const subscriptions =
        !subscriptionsResponse.error && 'data' in subscriptionsResponse
            ? subscriptionsResponse.data || []
            : [];
    const meta =
        !newslettersResponse.error && 'data' in newslettersResponse
            ? newslettersResponse.meta
            : undefined;

    // Calculate stats
    const stats = {
        totalNewsletters: meta?.total || newsletters.length,
        sent: newsletters.filter((n) => n.status === 'sent').length,
        draft: newsletters.filter((n) => n.status === 'draft').length,
        totalSubscriptions:
            subscriptionsResponse.error || !subscriptionsResponse.data
                ? 0
                : subscriptionsResponse.meta?.total || 0,
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case ENewsletterStatus.sent:
                return (
                    <Badge variant='default' className='bg-green-500'>
                        Sent
                    </Badge>
                );
            case ENewsletterStatus.draft:
                return (
                    <Badge variant='secondary' className='bg-gray-500'>
                        Draft
                    </Badge>
                );
            case ENewsletterStatus.scheduled:
                return (
                    <Badge variant='default' className='bg-blue-500'>
                        Scheduled
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
                            Newsletter
                        </h1>
                        <p className='text-muted-foreground mt-1'>
                            Manage newsletters and subscriptions
                        </p>
                    </div>
                    <Button asChild>
                        <Link href='/admin/newsletter/create'>
                            <Plus className='h-4 w-4 mr-2' />
                            Create Newsletter
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
                                        Total Newsletters
                                    </p>
                                    <p className='text-3xl font-bold text-blue-900 dark:text-blue-100'>
                                        {stats.totalNewsletters}
                                    </p>
                                </div>
                                <div className='p-3 bg-blue-500/10 rounded-full'>
                                    <Mail className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='border-0 shadow-sm bg-linear-to-br from-green-50 to-green-100/50 dark:from-green-900/10 dark:to-green-900/10'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-green-600 dark:text-green-400'>
                                        Sent
                                    </p>
                                    <p className='text-3xl font-bold text-green-900 dark:text-green-100'>
                                        {stats.sent}
                                    </p>
                                </div>
                                <div className='p-3 bg-green-500/10 rounded-full'>
                                    <Send className='h-6 w-6 text-green-600 dark:text-green-400' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='border-0 shadow-sm bg-linear-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/10 dark:to-orange-900/10'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-orange-600 dark:text-orange-400'>
                                        Drafts
                                    </p>
                                    <p className='text-3xl font-bold text-orange-900 dark:text-orange-100'>
                                        {stats.draft}
                                    </p>
                                </div>
                                <div className='p-3 bg-orange-500/10 rounded-full'>
                                    <Mail className='h-6 w-6 text-orange-600 dark:text-orange-400' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='border-0 shadow-sm bg-linear-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/10 dark:to-purple-900/10'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-purple-600 dark:text-purple-400'>
                                        Subscribers
                                    </p>
                                    <p className='text-3xl font-bold text-purple-900 dark:text-purple-100'>
                                        {stats.totalSubscriptions}
                                    </p>
                                </div>
                                <div className='p-3 bg-purple-500/10 rounded-full'>
                                    <Users className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Newsletters List */}
                <Card>
                    <CardContent className='p-6'>
                        <div className='space-y-4'>
                            <h2 className='text-xl font-semibold'>Recent Newsletters</h2>
                            {newsletters.length === 0 ? (
                                <p className='text-muted-foreground text-center py-8'>
                                    No newsletters found
                                </p>
                            ) : (
                                <div className='space-y-2'>
                                    {newsletters.slice(0, 10).map((newsletter) => (
                                        <div
                                            key={newsletter.id}
                                            className='flex items-center justify-between p-3 border rounded-lg hover:bg-accent'
                                        >
                                            <div className='flex-1'>
                                                <div className='flex items-center gap-2 mb-1'>
                                                    <h3 className='font-medium'>{newsletter.title}</h3>
                                                    {getStatusBadge(newsletter.status)}
                                                </div>
                                                <p className='text-sm text-muted-foreground'>
                                                    {newsletter.subject} • {newsletter.recipientCount}{' '}
                                                    recipients
                                                </p>
                                            </div>
                                            <Button variant='ghost' size='sm' asChild>
                                                <Link href={`/admin/newsletter/${newsletter.id}`}>
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

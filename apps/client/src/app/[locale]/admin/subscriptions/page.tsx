import { getSubscriptions } from '@/actions/subscription.action';
import { Card, CardContent } from '@/components/ui/card';
import { ESubscriptionStatus, TPagination, TSubscriptionQueryFilter, TSubscriptionWithPlan, isErrorResponse } from '@repo/common';
import { CreditCard, Users, Clock, XCircle } from 'lucide-react';
import { SubscriptionsTable } from './subscriptions-table';
import { SubscriptionsFilters } from './subscriptions-filters';
import { SubscriptionsPagination } from './subscriptions-pagination';

interface SubscriptionsPageProps {
    searchParams: Promise<TSubscriptionQueryFilter>;
}

export default async function SubscriptionsPage({
    searchParams: searchParamsPromise,
}: SubscriptionsPageProps) {
    const searchParams = await searchParamsPromise;
    // Clean up the search params - remove 'all' status value
    const cleanedParams: TSubscriptionQueryFilter = {
        ...searchParams,
        status: (searchParams.status as string) === 'all' ? undefined : searchParams.status,
    };
    const subscriptionsResponse = await getSubscriptions(cleanedParams);


    if (!subscriptionsResponse || isErrorResponse(subscriptionsResponse)) {
        throw new Error(subscriptionsResponse?.message || 'Failed to fetch subscriptions');
    }
    const meta: TPagination = ('meta' in subscriptionsResponse) ? (subscriptionsResponse.meta as TPagination) : {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
    };
    const total = meta.total;
    const page = meta.page;
    const limit = meta.limit;
    const totalPages = meta.totalPages;
    const hasNext = meta.hasNext;
    const hasPrev = meta.hasPrev;

    const subscriptionsData = ('data' in subscriptionsResponse) ? subscriptionsResponse.data : null;

    // Ensure we have valid data structure
    const subscriptions = Array.isArray(subscriptionsData)
        ? subscriptionsData
        : [];
    console.log({ subscriptions });

    const activeCount = subscriptions.filter(
        (sub: TSubscriptionWithPlan) => sub.status === ESubscriptionStatus.active
    ).length;
    const expiredCount = subscriptions.filter(
        (sub: TSubscriptionWithPlan) => sub.status === ESubscriptionStatus.expired
    ).length;
    const cancelledCount = subscriptions.filter(
        (sub: TSubscriptionWithPlan) => sub.status === ESubscriptionStatus.cancelled
    ).length;

    return (
        <div className='space-y-6 p-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold text-foreground dark:text-foreground'>Subscriptions</h1>
                    <p className='text-muted-foreground dark:text-muted-foreground'>Manage user subscriptions</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <Card>
                    <CardContent className='p-6'>
                        <div className='flex items-center'>
                            <div className='p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30 dark:text-blue-400'>
                                <Users className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                            </div>
                            <div className='ml-4'>
                                <p className='text-sm font-medium text-muted-foreground dark:text-muted-foreground'>
                                    Total Subscriptions
                                </p>
                                <p className='text-2xl font-bold text-foreground dark:text-foreground'>{total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className='p-6'>
                        <div className='flex items-center'>
                            <div className='p-2 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-400'>
                                <CreditCard className='h-6 w-6 text-green-600 dark:text-green-400' />
                            </div>
                            <div className='ml-4'>
                                <p className='text-sm font-medium text-muted-foreground dark:text-muted-foreground'>
                                    Active
                                </p>
                                <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{activeCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className='p-6'>
                        <div className='flex items-center'>
                            <div className='p-2 bg-yellow-100 rounded-lg dark:bg-yellow-900/30 dark:text-yellow-400'>
                                <Clock className='h-6 w-6 text-yellow-600 dark:text-yellow-400' />
                            </div>
                            <div className='ml-4'>
                                <p className='text-sm font-medium text-muted-foreground dark:text-muted-foreground'>
                                    Expired
                                </p>
                                <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{expiredCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className='p-6'>
                        <div className='flex items-center'>
                            <div className='p-2 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400'>
                                <XCircle className='h-6 w-6 text-red-600 dark:text-red-400' />
                            </div>
                            <div className='ml-4'>
                                <p className='text-sm font-medium text-muted-foreground dark:text-muted-foreground'>
                                    Cancelled
                                </p>
                                <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{cancelledCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <SubscriptionsFilters currentFilters={searchParams} />

            {/* Subscriptions Table */}
            <SubscriptionsTable subscriptions={subscriptions} total={total} />

            {/* Pagination */}
            {totalPages > 1 && (
                <SubscriptionsPagination
                    currentPage={page}
                    totalPages={totalPages}
                    total={total}
                    limit={limit}
                />
            )}
        </div>
    );
}


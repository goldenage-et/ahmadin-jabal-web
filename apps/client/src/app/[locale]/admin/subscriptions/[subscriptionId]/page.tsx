import { getSubscription } from '@/actions/subscription.action';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ESubscriptionStatus, isErrorResponse } from '@repo/common';
import { ArrowLeft, Calendar, CreditCard, User, Infinity } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface SubscriptionDetailPageProps {
    params: Promise<{ subscriptionId: string }>;
}

export default async function SubscriptionDetailPage({
    params: paramsPromise,
}: SubscriptionDetailPageProps) {
    const { subscriptionId } = await paramsPromise;
    const subscriptionData = await getSubscription(subscriptionId);

    if (!subscriptionData || isErrorResponse(subscriptionData)) {
        notFound();
    }

    const subscription = subscriptionData;

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: ESubscriptionStatus) => {
        switch (status) {
            case ESubscriptionStatus.active:
                return (
                    <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                    </Badge>
                );
            case ESubscriptionStatus.expired:
                return (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Expired
                    </Badge>
                );
            case ESubscriptionStatus.cancelled:
                return (
                    <Badge variant="destructive" className="bg-destructive text-destructive-foreground">
                        Cancelled
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const calculateDaysRemaining = () => {
        if (subscription.plan.isLifetime) {
            return 'Lifetime';
        }
        if (!subscription.endDate) {
            return 'N/A';
        }
        const end = new Date(subscription.endDate);
        const now = new Date();
        const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diff < 0) {
            return 'Expired';
        }
        return `${diff} day${diff !== 1 ? 's' : ''}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/subscriptions">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Subscription Details</h1>
                    <p className="text-muted-foreground">View and manage subscription information</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subscription Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription Information</CardTitle>
                        <CardDescription>Details about this subscription</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Status</span>
                            {getStatusBadge(subscription.status)}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Subscription ID</span>
                            <span className="text-sm font-mono">{subscription.id.slice(0, 8)}...</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">User ID</span>
                            <span className="text-sm font-mono">{subscription.userId.slice(0, 8)}...</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Start Date</span>
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{formatDate(subscription.startDate)}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">End Date</span>
                            <div className="flex items-center space-x-2">
                                {subscription.endDate ? (
                                    <>
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{formatDate(subscription.endDate)}</span>
                                    </>
                                ) : subscription.plan.isLifetime ? (
                                    <>
                                        <Infinity className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Never</span>
                                    </>
                                ) : (
                                    <span className="text-sm text-muted-foreground">N/A</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Days Remaining</span>
                            <span className="text-sm font-medium">{calculateDaysRemaining()}</span>
                        </div>
                        {subscription.paymentId && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Payment ID</span>
                                <span className="text-sm font-mono">{subscription.paymentId.slice(0, 8)}...</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Plan Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Plan Information</CardTitle>
                        <CardDescription>Details about the subscription plan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Plan Name</span>
                            <span className="text-sm font-medium">{subscription.plan.name}</span>
                        </div>
                        {subscription.plan.description && (
                            <div className="flex items-start justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Description</span>
                                <span className="text-sm text-right max-w-xs">{subscription.plan.description}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Price</span>
                            <div className="flex items-center space-x-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                    {subscription.plan.price.toFixed(2)} {subscription.plan.currency}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Duration</span>
                            <div className="flex items-center space-x-2">
                                {subscription.plan.isLifetime ? (
                                    <>
                                        <Infinity className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Lifetime</span>
                                    </>
                                ) : subscription.plan.durationDays ? (
                                    <span className="text-sm">
                                        {subscription.plan.durationDays} day{subscription.plan.durationDays !== 1 ? 's' : ''}
                                    </span>
                                ) : (
                                    <span className="text-sm text-muted-foreground">N/A</span>
                                )}
                            </div>
                        </div>
                        {subscription.plan.features && Object.keys(subscription.plan.features).length > 0 && (
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Features</span>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(subscription.plan.features).map(([key, value]) => (
                                        <Badge key={key} variant="outline" className="text-xs">
                                            {key}: {String(value)}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Payment History */}
            {subscription.paymentId && (
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Information</CardTitle>
                        <CardDescription>Payment details for this subscription</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Payment ID</span>
                            <Link href={`/admin/orders?paymentId=${subscription.paymentId}`}>
                                <Button variant="link" className="text-sm font-mono">
                                    {subscription.paymentId}
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}



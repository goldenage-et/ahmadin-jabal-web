'use client';

import { cancelSubscription } from '@/actions/subscription.action';
import { SubscriptionStatus } from '@/components/subscription-status';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TSubscriptionWithPlan, ESubscriptionStatus } from '@repo/common';
import { CreditCard, Calendar, Infinity, AlertCircle, XCircle, Link as LinkIcon } from 'lucide-react';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MySubscriptionClientProps {
    subscription: TSubscriptionWithPlan | null;
}

export function MySubscriptionClient({ subscription }: MySubscriptionClientProps) {
    const router = useRouter();
    const { mutate, isLoading } = useApiMutation();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleCancel = () => {
        if (!subscription) return;

        if (!confirm(`Are you sure you want to cancel your subscription? This action cannot be undone.`)) {
            return;
        }

        setError(null);
        setSuccess(null);

        mutate(
            () => cancelSubscription(subscription.id),
            {
                onSuccess: () => {
                    setSuccess('Subscription cancelled successfully');
                    router.refresh();
                },
                onError: (err: any) => {
                    setError(err.message || 'Failed to cancel subscription. Please try again.');
                },
                errorMessage: 'Failed to cancel subscription',
            }
        );
    };

    if (!subscription) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>No Active Subscription</CardTitle>
                        <CardDescription>You don't have an active subscription</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Subscribe to a plan to access premium features and content.
                        </p>
                        <Link href="/subscriptions">
                            <Button>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Browse Plans
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
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
        return `${diff} day${diff !== 1 ? 's' : ''} remaining`;
    };

    const canCancel = subscription.status === ESubscriptionStatus.active;

    return (
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            <SubscriptionStatus subscription={subscription} />

            <Card>
                <CardHeader>
                    <CardTitle>Plan Details</CardTitle>
                    <CardDescription>Information about your subscription plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Plan Name</span>
                            <span className="text-sm font-medium">{subscription.plan.name}</span>
                        </div>
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
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Status</span>
                            <span className="text-sm font-medium">{calculateDaysRemaining()}</span>
                        </div>
                    </div>

                    {subscription.plan.features && Object.keys(subscription.plan.features).length > 0 && (
                        <div className="space-y-2 pt-4 border-t">
                            <h4 className="text-sm font-semibold">Plan Features:</h4>
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

            {subscription.paymentId && (
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Information</CardTitle>
                        <CardDescription>Payment details for this subscription</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Payment ID</span>
                            <Link href={`/my-orders?paymentId=${subscription.paymentId}`}>
                                <Button variant="link" className="text-sm font-mono">
                                    <LinkIcon className="w-4 h-4 mr-2" />
                                    View Payment
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {canCancel && (
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">Cancel Subscription</CardTitle>
                        <CardDescription>
                            Cancel your subscription. You will lose access to premium features at the end of your billing period.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            variant="destructive"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            <XCircle className="w-4 h-4 mr-2" />
                            {isLoading ? 'Cancelling...' : 'Cancel Subscription'}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {subscription.status === ESubscriptionStatus.expired && (
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription Expired</CardTitle>
                        <CardDescription>Your subscription has expired</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/subscriptions">
                            <Button>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Renew Subscription
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}



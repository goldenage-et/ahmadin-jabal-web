'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ESubscriptionStatus, TSubscriptionWithPlan } from '@repo/common';
import { Calendar, Infinity, CreditCard } from 'lucide-react';

interface SubscriptionStatusProps {
    subscription: TSubscriptionWithPlan | null;
    className?: string;
}

export function SubscriptionStatus({ subscription, className }: SubscriptionStatusProps) {
    if (!subscription) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle>No Active Subscription</CardTitle>
                    <CardDescription>You don't have an active subscription</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Subscribe to a plan to access premium features.
                    </p>
                </CardContent>
            </Card>
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

    const getStatusBadge = (status: ESubscriptionStatus) => {
        switch (status) {
            case ESubscriptionStatus.active:
                return (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                        Active
                    </Badge>
                );
            case ESubscriptionStatus.expired:
                return (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Expired
                    </Badge>
                );
            case ESubscriptionStatus.cancelled:
                return (
                    <Badge variant="destructive">
                        Cancelled
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Current Subscription</CardTitle>
                    {getStatusBadge(subscription.status)}
                </div>
                <CardDescription>{subscription.plan.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Plan</span>
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
                    <span className="text-sm font-medium text-muted-foreground">Status</span>
                    <span className="text-sm font-medium">{calculateDaysRemaining()}</span>
                </div>
            </CardContent>
        </Card>
    );
}






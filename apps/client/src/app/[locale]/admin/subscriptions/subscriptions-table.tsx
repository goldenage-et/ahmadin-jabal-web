'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { ESubscriptionStatus, TSubscriptionWithPlan } from '@repo/common';
import { Eye, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SubscriptionsTableProps {
    subscriptions: TSubscriptionWithPlan[];
    total: number;
}

export function SubscriptionsTable({ subscriptions, total }: SubscriptionsTableProps) {
    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
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
                return <Badge variant="secondary" className="bg-secondary text-secondary-foreground">{status}</Badge>;
        }
    };

    if (subscriptions.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground">No subscriptions found</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subscriptions.map((subscription) => (
                                <TableRow key={subscription.id} className="hover:bg-muted/50">
                                    <TableCell>
                                        <div className="font-medium">
                                            User ID: {subscription.userId.slice(0, 8)}...
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{subscription.plan.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {subscription.plan.price.toFixed(2)} {subscription.plan.currency}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(subscription.status)}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(subscription.startDate)}
                                    </TableCell>
                                    <TableCell>
                                        {subscription.endDate
                                            ? formatDate(subscription.endDate)
                                            : subscription.plan.isLifetime
                                                ? 'Never'
                                                : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/subscriptions/${subscription.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}



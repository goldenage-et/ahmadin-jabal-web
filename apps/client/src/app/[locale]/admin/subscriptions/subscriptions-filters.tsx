'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TSubscriptionQueryFilter, ESubscriptionStatus } from '@repo/common';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Search } from 'lucide-react';

interface SubscriptionsFiltersProps {
    currentFilters: TSubscriptionQueryFilter;
}

export function SubscriptionsFilters({ currentFilters }: SubscriptionsFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [filters, setFilters] = useState({
        status: currentFilters.status ? String(currentFilters.status) : 'all',
        sortBy: currentFilters.sortBy || 'createdAt',
        sortOrder: currentFilters.sortOrder || 'desc',
    });

    const updateFilters = (newFilters: Partial<typeof filters>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);

        const params = new URLSearchParams(searchParams);

        Object.entries(updatedFilters).forEach(([key, value]) => {
            if (value && value !== '' && value !== 'all') {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        params.delete('page');

        startTransition(() => {
            router.push(`/admin/subscriptions?${params.toString()}`);
        });
    };

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        updateFilters({ [key]: value });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={filters.status || 'all'}
                            onValueChange={(value) => handleFilterChange('status', value)}
                            disabled={isPending}
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                <SelectItem value={ESubscriptionStatus.active}>Active</SelectItem>
                                <SelectItem value={ESubscriptionStatus.expired}>Expired</SelectItem>
                                <SelectItem value={ESubscriptionStatus.cancelled}>Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sortBy">Sort By</Label>
                        <Select
                            value={filters.sortBy}
                            onValueChange={(value) => handleFilterChange('sortBy', value)}
                            disabled={isPending}
                        >
                            <SelectTrigger id="sortBy">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="startDate">Start Date</SelectItem>
                                <SelectItem value="endDate">End Date</SelectItem>
                                <SelectItem value="createdAt">Created At</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sortOrder">Sort Order</Label>
                        <Select
                            value={filters.sortOrder}
                            onValueChange={(value) => handleFilterChange('sortOrder', value)}
                            disabled={isPending}
                        >
                            <SelectTrigger id="sortOrder">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="asc">Ascending</SelectItem>
                                <SelectItem value="desc">Descending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


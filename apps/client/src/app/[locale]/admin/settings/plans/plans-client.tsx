'use client';

import { deletePlan } from '@/actions/plan.action';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { TPlan } from '@repo/common';
import {
    Edit,
    Eye,
    EyeOff,
    MoreHorizontal,
    Plus,
    Search,
    CreditCard,
    Trash2,
    Infinity,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

interface PlansClientProps {
    initialPlans: TPlan[];
}

export function PlansClient({ initialPlans }: PlansClientProps) {
    console.log({ initialPlans });
    const [plans, setPlans] = useState<TPlan[]>(initialPlans);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [lifetimeFilter, setLifetimeFilter] = useState<'all' | 'lifetime' | 'time-based'>('all');
    const { mutate, isLoading } = useApiMutation();

    const handleDeletePlan = async (planId: string, planName: string) => {
        if (!confirm(`Are you sure you want to delete the plan "${planName}"?`)) {
            return;
        }

        mutate(
            () => deletePlan(planId),
            {
                onSuccess: () => {
                    setPlans(prev => prev.filter(plan => plan.id !== planId));
                },
                successMessage: 'Plan deleted successfully',
                errorMessage: 'Failed to delete plan',
            }
        );
    };

    const filteredPlans = useMemo(() => {
        return plans.filter((plan) => {
            const matchesSearch =
                searchTerm === '' ||
                plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                plan.description?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && plan.active) ||
                (statusFilter === 'inactive' && !plan.active);

            const matchesLifetime =
                lifetimeFilter === 'all' ||
                (lifetimeFilter === 'lifetime' && plan.isLifetime) ||
                (lifetimeFilter === 'time-based' && !plan.isLifetime);

            return matchesSearch && matchesStatus && matchesLifetime;
        });
    }, [plans, searchTerm, statusFilter, lifetimeFilter]);

    const formatDuration = (plan: TPlan) => {
        if (plan.isLifetime) {
            return 'Lifetime';
        }
        if (plan.durationDays) {
            const days = plan.durationDays;
            if (days >= 365) {
                const years = Math.floor(days / 365);
                const remainingDays = days % 365;
                if (remainingDays === 0) {
                    return `${years} ${years === 1 ? 'year' : 'years'}`;
                }
                return `${years} ${years === 1 ? 'year' : 'years'}, ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`;
            }
            if (days >= 30) {
                const months = Math.floor(days / 30);
                const remainingDays = days % 30;
                if (remainingDays === 0) {
                    return `${months} ${months === 1 ? 'month' : 'months'}`;
                }
                return `${months} ${months === 1 ? 'month' : 'months'}, ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`;
            }
            return `${days} ${days === 1 ? 'day' : 'days'}`;
        }
        return 'N/A';
    };

    const formatPrice = (plan: TPlan) => {
        return `${plan.price.toFixed(2)} ${plan.currency || 'ETB'}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Subscription Plans</h1>
                    <p className="text-muted-foreground">Manage subscription plans and pricing</p>
                </div>
                <Link href={`/admin/settings/plans/new`}>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Plan
                    </Button>
                </Link>
            </div>

            {plans.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No plans found</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Get started by creating your first subscription plan.
                        </p>
                        <Link href={`/admin/settings/plans/new`}>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Plan
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Plans</CardTitle>
                        <CardDescription>
                            Manage subscription plans and their pricing
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search plans..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={lifetimeFilter} onValueChange={(value: any) => setLifetimeFilter(value)}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="lifetime">Lifetime</SelectItem>
                                    <SelectItem value="time-based">Time-based</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12"></TableHead>
                                        <TableHead>Plan Name</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Features</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPlans.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-2">
                                                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground">
                                                        {searchTerm || statusFilter !== 'all' || lifetimeFilter !== 'all'
                                                            ? 'No plans match your filters'
                                                            : 'No plans found'
                                                        }
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredPlans.map((plan) => (
                                            <TableRow key={plan.id} className="hover:bg-muted/50">
                                                <TableCell>
                                                    <CreditCard className="h-4 w-4 text-primary" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{plan.name}</div>
                                                    {plan.description && (
                                                        <div className="text-sm text-muted-foreground line-clamp-1">
                                                            {plan.description}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{formatPrice(plan)}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        {plan.isLifetime && (
                                                            <Infinity className="h-4 w-4 text-primary" />
                                                        )}
                                                        <span className="text-sm">{formatDuration(plan)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {plan.active ? (
                                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                                            <Eye className="w-3 h-3 mr-1" />
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">
                                                            <EyeOff className="w-3 h-3 mr-1" />
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {plan.features && Object.keys(plan.features).length > 0 ? (
                                                        <Badge variant="outline" className="text-xs">
                                                            {Object.keys(plan.features).length} feature{Object.keys(plan.features).length !== 1 ? 's' : ''}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">No features</span>
                                                    )}
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
                                                                <Link href={`/admin/settings/plans/${plan.id}`}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Plan
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeletePlan(plan.id, plan.name)}
                                                                disabled={isLoading}
                                                                className="text-destructive focus:text-destructive"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                {isLoading ? 'Deleting...' : 'Delete Plan'}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Summary */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                            <div>
                                Showing {filteredPlans.length} of {plans.length} plans
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Active: {plans.filter(p => p.active).length}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    <span>Inactive: {plans.filter(p => !p.active).length}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}


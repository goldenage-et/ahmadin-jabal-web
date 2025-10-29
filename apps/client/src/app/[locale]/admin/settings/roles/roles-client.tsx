'use client';

import { deleteRole } from '@/actions/role.action';
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
import { EResources, TRole } from '@repo/common';
import {
    Edit,
    Eye,
    EyeOff,
    MoreHorizontal,
    Plus,
    Search,
    Shield,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

interface RolesClientProps {
    initialRoles: TRole[];
}

const resourceLabels: Partial<Record<EResources, string>> = {
    [EResources.USER]: 'User',
    [EResources.BOOK]: 'Book',
    [EResources.ORDER]: 'Order',
    [EResources.PAYMENT]: 'Payment',
    [EResources.ROLE]: 'Role',
    [EResources.SETTING]: 'Setting',
};

export function RolesClient({ initialRoles }: RolesClientProps) {
    const [roles, setRoles] = useState<TRole[]>(initialRoles);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const { mutate, isLoading } = useApiMutation();

    const handleDeleteRole = async (roleId: string, roleName: string) => {
        if (!confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
            return;
        }

        mutate(
            () => deleteRole(roleId),
            {
                onSuccess: () => {
                    setRoles(prev => prev.filter(role => role.id !== roleId));
                },
                successMessage: 'Role deleted successfully',
                errorMessage: 'Failed to delete role',
            }
        );
    };

    const filteredRoles = useMemo(() => {
        return roles.filter((role) => {
            const matchesSearch =
                searchTerm === '' ||
                role.name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && role.active) ||
                (statusFilter === 'inactive' && !role.active);

            return matchesSearch && matchesStatus;
        });
    }, [roles, searchTerm, statusFilter]);

    const getPermissionSummary = (permission: TRole['permission']) => {
        const totalPermissions = Object.values(permission).reduce(
            (total, resource) => total + Object.values(resource).length,
            0
        );
        const activePermissions = Object.values(permission).reduce(
            (total, resource) => total + Object.values(resource).filter(Boolean).length,
            0
        );
        return `${activePermissions}/${totalPermissions}`;
    };

    const getResourcePermissions = (permission: TRole['permission'], resource: EResources) => {
        const resourcePerms = permission[resource];
        if (!resourcePerms) return [];

        return Object.entries(resourcePerms)
            .filter(([, allowed]) => allowed)
            .map(([action]) => action);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Roles</h1>
                    <p className="text-muted-foreground">Manage root roles and permissions</p>
                </div>
                <Link href={`/admin/roles/new`}>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Role
                    </Button>
                </Link>
            </div>

            {roles.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Shield className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No roles found</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Get started by creating your first role for your root users.
                        </p>
                        <Link href={`/admin/roles/new`}>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Role
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Root Roles</CardTitle>
                        <CardDescription>
                            Manage roles and their permissions for your root users
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search roles..."
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
                        </div>

                        {/* Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12"></TableHead>
                                        <TableHead>Role Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead>Key Resources</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRoles.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-2">
                                                    <Shield className="h-8 w-8 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground">
                                                        {searchTerm || statusFilter !== 'all'
                                                            ? 'No roles match your filters'
                                                            : 'No roles found'
                                                        }
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredRoles.map((role) => (
                                            <TableRow key={role.id} className="hover:bg-muted/50">
                                                <TableCell>
                                                    <Shield className="h-4 w-4 text-primary" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{role.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {getPermissionSummary(role.permission)} permissions
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {role.active ? (
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
                                                    <div className="text-sm">
                                                        {getPermissionSummary(role.permission)} total
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {Object.keys(role.permission).slice(0, 3).map((resource) => {
                                                            const perms = getResourcePermissions(role.permission, resource as EResources);
                                                            if (perms.length === 0) return null;

                                                            return (
                                                                <Badge key={resource} variant="outline" className="text-xs">
                                                                    {resourceLabels[resource as EResources] || resource}
                                                                </Badge>
                                                            );
                                                        })}
                                                        {Object.keys(role.permission).length > 3 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{Object.keys(role.permission).length - 3} more
                                                            </Badge>
                                                        )}
                                                    </div>
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
                                                                <Link href={`/admin/roles/${role.id}`}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Role
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {role.name !== 'owner' && (
                                                                <>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDeleteRole(role.id, role.name)}
                                                                        disabled={isLoading}
                                                                        className="text-destructive focus:text-destructive"
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        {isLoading ? 'Deleting...' : 'Delete Role'}
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
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
                                Showing {filteredRoles.length} of {roles.length} roles
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Active: {roles.filter(r => r.active).length}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    <span>Inactive: {roles.filter(r => !r.active).length}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

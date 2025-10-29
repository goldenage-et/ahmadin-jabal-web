'use client';

import UserHoverCard from '@/features/users/user-hover-card';
import { TStoreMemberBasic, TStoreMemberDetail, TUserBasic } from '@repo/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Filter, Mail, MoreVertical, Phone, Plus, Search, UserCheck, Users, UserX } from 'lucide-react';
import { useState } from 'react';


export function MembersTable({ members, user }: { members: TStoreMemberBasic[], user: TUserBasic | null }) {
    const [searchTerm, setSearchTerm] = useState('');


    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'superAdmin':
                return <Badge key={role} variant="secondary" className="bg-red-100 text-red-800">Super Admin</Badge>;
            case 'admin':
                return <Badge key={role} variant="secondary" className="bg-blue-100 text-blue-800">Admin</Badge>;
            case 'user':
                return <Badge key={role} variant="secondary" className="bg-green-100 text-green-800">User</Badge>;
            default:
                return <Badge key={role} variant="secondary">Unknown</Badge>;
        }
    };

    const getStatusBadge = (active: boolean, emailVerified: boolean) => {
        if (!active) {
            return <Badge variant="secondary" className="bg-red-100 text-red-800">Inactive</Badge>;
        }
        if (!emailVerified) {
            return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Unverified</Badge>;
        }
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDateTime = (date: string | Date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filteredMembers = members.filter(({ user }) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Members Management
                    </CardTitle>
                    <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {/* Search and Filters */}
                <div className="flex items-center space-x-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                </div>

                {/* Members Table */}
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-background">
                            <TableHead>User</TableHead>
                            <TableHead>Contacts</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            {/* <TableHead>Store</TableHead>
                            <TableHead>Last Login</TableHead> */}
                            <TableHead>Joined At</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMembers.map(({ user: usr, joinedAt }) => (
                            <TableRow key={usr.id} className="hover:bg-background">
                                <TableCell>
                                    <UserHoverCard
                                        user={usr}
                                        key={usr.id}
                                        showName
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="flex items-center text-sm">
                                            <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                                            {usr.email}
                                        </div>
                                        {usr.phone && (
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Phone className="h-3 w-3 mr-1" />
                                                {usr.phone}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                {/* <TableCell>
                                    {roles.map((role) => getRoleBadge(role))}
                                </TableCell> */}
                                <TableCell>
                                    {getStatusBadge(usr.active, usr.emailVerified)}
                                </TableCell>
                                {/* <TableCell>
                                    <div className="text-sm">{usr.store?.name || 'N/A'}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        {usr.lastLoginAt ? formatDateTime(usr.lastLoginAt.toISOString()) : 'Never'}
                                    </div>
                                </TableCell> */}
                                <TableCell>
                                    <div className="text-sm">{formatDateTime(joinedAt || '')}</div>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>
                                                View Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Edit User
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Change Role
                                            </DropdownMenuItem>
                                            {!usr.emailVerified && (
                                                <DropdownMenuItem>
                                                    <UserCheck className="h-4 w-4 mr-2" />
                                                    Verify Email
                                                </DropdownMenuItem>
                                            )}
                                            {!usr.systemOwner && user?.id !== usr.id && (
                                                usr.active ? (
                                                    <DropdownMenuItem className="text-orange-600">
                                                        <UserX className="h-4 w-4 mr-2" />
                                                        Deactivate
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem className="text-green-600">
                                                        <UserCheck className="h-4 w-4 mr-2" />
                                                        Activate
                                                    </DropdownMenuItem>
                                                )
                                            )}
                                            {!usr.systemOwner && user?.id !== usr.id && (
                                                <DropdownMenuItem className="text-red-600">
                                                    Delete User
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

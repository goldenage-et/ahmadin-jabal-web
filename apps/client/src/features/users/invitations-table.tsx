'use client';

import { cancelInvitation, deleteInvitation, resendInvitation } from '@/actions/invitations.action';
import { useApiMutation, UseApiMutationRef } from '@/hooks/use-api-mutation';
import { convertDateString, EInvitationStatus, EUserRole, TInvitation } from '@repo/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AlertCircle, CheckCircle, Clock, Mail, MoreHorizontal, XCircle } from 'lucide-react';
import { useRef } from 'react';

interface InvitationsTableProps {
    invitations: TInvitation[];
}

export function InvitationsTable({ invitations }: InvitationsTableProps) {
    const resendingRef = useRef<UseApiMutationRef<TInvitation>>(null);
    const cancelingRef = useRef<UseApiMutationRef<TInvitation>>(null);
    const { mutate } = useApiMutation()

    const getStatusIcon = (status: EInvitationStatus) => {
        switch (status) {
            case EInvitationStatus.pending:
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case EInvitationStatus.accepted:
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case EInvitationStatus.rejected:
                return <XCircle className="h-4 w-4 text-red-500" />;
            case EInvitationStatus.expired:
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusBadge = (status: EInvitationStatus) => {
        const variants = {
            [EInvitationStatus.pending]: 'default',
            [EInvitationStatus.accepted]: 'outline',
            [EInvitationStatus.rejected]: 'destructive',
            [EInvitationStatus.expired]: 'destructive',
        } as const;

        return (
            <Badge variant={variants[status] || 'default'}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const handleResend = async (invitationId: string) => {
        mutate(() => resendInvitation(invitationId), {
            successMessage: 'Invitation resent successfully',
            errorMessage: 'Failed to resend invitation'
        }, resendingRef);
    };

    const handleCancel = async (invitationId: string) => {
        mutate(() => cancelInvitation(invitationId), {
            successMessage: 'Invitation canceled successfully',
            errorMessage: 'Failed to cancel invitation'
        });
    };

    const handleDeleted = async (invitationId: string) => {
        mutate(() => deleteInvitation(invitationId), {
            successMessage: 'Invitation deleted successfully',
            errorMessage: 'Failed to deleted invitation'
        });
    };

    if (invitations.length === 0) {
        return (
            <div className="text-center py-12">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Invitations</h3>
                <p className="text-muted-foreground">
                    No pending invitations found.
                </p>
            </div>
        );
    }

    return (
        <Table className="w-full bg-background1 px-4 py-8 border rounded-lg">
            <TableHeader>
                <TableRow className="hover:bg-background1 rounded-lg">
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invited At</TableHead>
                    <TableHead>Expires At</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invitations.map((invitation) => (
                    <TableRow
                        key={invitation.id}
                        className="hover:bg-background/50 rounded-lg"
                    >
                        <TableCell className="font-medium">
                            {invitation.email}
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">
                                {invitation.roles?.join(', ')}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(invitation.status as EInvitationStatus)}
                                {getStatusBadge(invitation.status as EInvitationStatus)}
                            </div>
                        </TableCell>
                        <TableCell className="text-nowrap">
                            {convertDateString(invitation.createdAt?.toString()!)}
                        </TableCell>
                        <TableCell className="text-nowrap">
                            {invitation.expiresAt
                                ? convertDateString(invitation.expiresAt.toString())
                                : 'Never'
                            }
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={resendingRef.current?.isLoading || cancelingRef.current?.isLoading}
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {invitation.status === EInvitationStatus.pending ? (
                                        <>
                                            <DropdownMenuItem
                                                onClick={() => handleResend(invitation.id)}
                                                disabled={resendingRef.current?.isLoading}
                                            >
                                                <Mail className="h-4 w-4 mr-2" />
                                                Resend
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleCancel(invitation.id)}
                                                disabled={cancelingRef.current?.isLoading}
                                                className="text-red-600"
                                            >
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Cancel
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <DropdownMenuItem
                                            onClick={() => handleDeleted(invitation.id)}
                                            disabled={cancelingRef.current?.isLoading}
                                            className="text-red-600"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Deleted
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}


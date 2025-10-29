'use server';

import { api } from '@/lib/api';
import {
    TInvitation,
    TInvitationQueryFilter,
    TUpdateInvitationStatus,
    TFetcherResponse,
} from '@repo/common';

// ==========================
// Core CRUD Operations
// ==========================
export async function getManyInvitations(filters?: TInvitationQueryFilter): Promise<TFetcherResponse<TInvitation[]>> {
    return api.get<TInvitation[]>('/invitations', {
        params: filters,
    });
}

export async function getMyInvitations(filters?: TInvitationQueryFilter): Promise<TFetcherResponse<TInvitation[]>> {
    return api.get<TInvitation[]>('/invitations/my', {
        params: filters,
    });
}

export async function getOneInvitation(id: string): Promise<TFetcherResponse<TInvitation>> {
    return api.get<TInvitation>(`/invitations/${id}`);
}

// ==========================
// Status Management
// ==========================

export async function updateInvitationStatus(
    id: string,
    data: TUpdateInvitationStatus
): Promise<TFetcherResponse<TInvitation>> {
    return api.put<TInvitation>(`/invitations/${id}/status`, data);
}


// ==========================
// Invitation Actions
// ==========================

export async function acceptInvitation(id: string): Promise<TFetcherResponse<TInvitation>> {
    return api.post<TInvitation>(`/invitations/${id}/accept`, {});
}

export async function declineInvitation(id: string): Promise<TFetcherResponse<TInvitation>> {
    return api.post<TInvitation>(`/invitations/${id}/decline`, {});
}

export async function resendInvitation(id: string): Promise<TFetcherResponse<TInvitation>> {
    return api.post<TInvitation>(`/invitations/${id}/resend`, {});
}

export async function cancelInvitation(id: string): Promise<TFetcherResponse<boolean>> {
    return api.post<boolean>(`/invitations/${id}/cancel`, {});
}

export async function cleanupExpiredInvitations(): Promise<TFetcherResponse<{ count: number }>> {
    return api.post<{ count: number }>('/invitations/cleanup', {});
}

export async function deleteInvitation(id: string): Promise<TFetcherResponse<boolean>> {
    return api.delete<boolean>(`/invitations/${id}`);
}

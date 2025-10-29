'use server';

import { api } from '@/lib/api';
import {
    TCreateRole,
    TFetcherResponse,
    TRole,
    TUpdateRole,
} from '@repo/common';

// ==================== ROOT ROLES ====================

// Get all root roles
export async function getRoles(): Promise<TFetcherResponse<TRole[]>> {
    return api.get<TRole[]>('/roles');
}

// Get a single root role by ID
export async function getRole(id: string): Promise<TFetcherResponse<TRole>> {
    return api.get<TRole>(`/roles/${id}`);
}

// Create a new root role
export async function createRole(
    data: TCreateRole,
): Promise<TFetcherResponse<TRole>> {
    return api.post<TRole>('/roles', data);
}

// Update a root role
export async function updateRole(
    id: string,
    data: TUpdateRole,
): Promise<TFetcherResponse<TRole>> {
    return api.put<TRole>(`/roles/${id}`, data);
}

// Delete a root role
export async function deleteRole(
    id: string,
): Promise<TFetcherResponse<{ message: string }>> {
    return api.delete<{ message: string }>(`/roles/${id}`);
}

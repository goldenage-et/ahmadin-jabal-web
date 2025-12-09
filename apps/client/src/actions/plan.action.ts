'use server';

import { api } from '@/lib/api';
import {
    TCreatePlan,
    TFetcherResponse,
    TPlan,
    TPlanQueryFilter,
    TUpdatePlan,
} from '@repo/common';

// Clean up undefined values from query parameters
function cleanQuery<T>(query?: Partial<T>) {
    return query
        ? Object.fromEntries(
            Object.entries(query).filter(([_, value]) => value !== undefined),
        )
        : undefined;
}

// Get all plans
export async function getPlans(
    query?: Partial<TPlanQueryFilter>,
): Promise<TFetcherResponse<TPlan[]>> {
    const response = await api.get<TPlan[]>('/plans', {
        params: cleanQuery(query),
    });
    return response;
}

// Get a single plan by ID
export async function getPlan(id: string): Promise<TFetcherResponse<TPlan>> {
    return api.get<TPlan>(`/plans/${id}`);
}

// Create a new plan
export async function createPlan(
    data: TCreatePlan,
): Promise<TFetcherResponse<TPlan>> {
    return api.post<TPlan>('/plans', data);
}

// Update a plan
export async function updatePlan(
    id: string,
    data: TUpdatePlan,
): Promise<TFetcherResponse<TPlan>> {
    return api.put<TPlan>(`/plans/${id}`, data);
}

// Delete a plan
export async function deletePlan(
    id: string,
): Promise<TFetcherResponse<{ message: string }>> {
    return api.delete<{ message: string }>(`/plans/${id}`);
}


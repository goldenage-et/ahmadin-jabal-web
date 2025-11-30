'use server';

import { api } from '@/lib/api';
import {
    TNewsletterBasic,
    TNewsletterDetail,
    TNewsletterQueryFilter,
    TNewsletterListResponse,
    TCreateNewsletter,
    TUpdateNewsletter,
    TFetcherResponse,
} from '@repo/common';

// Clean up undefined values from query parameters
function cleanQuery<T>(query?: Partial<T>) {
    return query
        ? Object.fromEntries(
            Object.entries(query).filter(([_, value]) => value !== undefined),
        )
        : undefined;
}

// ==================== NEWSLETTER ACTIONS ====================

export async function getManyNewsletters(
    query?: Partial<TNewsletterQueryFilter>,
): Promise<TFetcherResponse<TNewsletterListResponse>> {
    return await api.get<TNewsletterListResponse>('/newsletters', {
        params: cleanQuery(query),
    });
}

export async function getNewsletter(
    id: string,
): Promise<TFetcherResponse<TNewsletterDetail>> {
    return await api.get<TNewsletterDetail>(`/newsletters/${id}`);
}

export async function createNewsletter(
    data: TCreateNewsletter,
): Promise<TFetcherResponse<TNewsletterBasic>> {
    return await api.post<TNewsletterBasic>('/newsletters', data);
}

export async function updateNewsletter(
    id: string,
    data: TUpdateNewsletter,
): Promise<TFetcherResponse<TNewsletterBasic>> {
    return await api.put<TNewsletterBasic>(`/newsletters/${id}`, data);
}

export async function deleteNewsletter(
    id: string,
): Promise<TFetcherResponse<{ message: string }>> {
    return await api.delete<{ message: string }>(`/newsletters/${id}`);
}

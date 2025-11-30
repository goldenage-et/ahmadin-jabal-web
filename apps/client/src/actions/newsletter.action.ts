'use server';

import { api } from '@/lib/api';
import {
    TNewsletterBasic,
    TNewsletterDetail,
    TNewsletterQueryFilter,
    TNewsletterListResponse,
    TCreateNewsletter,
    TUpdateNewsletter,
    TNewsletterSubscription,
    TNewsletterSubscriptionDetail,
    TNewsletterSubscriptionQueryFilter,
    TNewsletterSubscriptionListResponse,
    TCreateNewsletterSubscription,
    TUpdateNewsletterSubscription,
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

// ==================== NEWSLETTER SUBSCRIPTION ACTIONS ====================

export async function createNewsletterSubscription(
    data: TCreateNewsletterSubscription,
): Promise<TFetcherResponse<TNewsletterSubscription>> {
    return await api.post<TNewsletterSubscription>(
        '/newsletters/subscriptions',
        data,
    );
}

export async function getManyNewsletterSubscriptions(
    query?: Partial<TNewsletterSubscriptionQueryFilter>,
): Promise<TFetcherResponse<TNewsletterSubscriptionListResponse>> {
    return await api.get<TNewsletterSubscriptionListResponse>(
        '/newsletters/subscriptions',
        {
            params: cleanQuery(query),
        },
    );
}

export async function getNewsletterSubscription(
    id: string,
): Promise<TFetcherResponse<TNewsletterSubscriptionDetail>> {
    return await api.get<TNewsletterSubscriptionDetail>(
        `/newsletters/subscriptions/${id}`,
    );
}

export async function getNewsletterSubscriptionByEmail(
    email: string,
): Promise<TFetcherResponse<TNewsletterSubscriptionDetail>> {
    return await api.get<TNewsletterSubscriptionDetail>(
        `/newsletters/subscriptions/email/${email}`,
    );
}

export async function updateNewsletterSubscription(
    id: string,
    data: TUpdateNewsletterSubscription,
): Promise<TFetcherResponse<TNewsletterSubscription>> {
    return await api.put<TNewsletterSubscription>(
        `/newsletters/subscriptions/${id}`,
        data,
    );
}

export async function unsubscribeNewsletterSubscription(
    id: string,
): Promise<TFetcherResponse<TNewsletterSubscription>> {
    return await api.post<TNewsletterSubscription>(
        `/newsletters/subscriptions/${id}/unsubscribe`,
        {},
    );
}

export async function unsubscribeNewsletterSubscriptionByEmail(
    email: string,
): Promise<TFetcherResponse<TNewsletterSubscription>> {
    return await api.post<TNewsletterSubscription>(
        `/newsletters/subscriptions/email/${email}/unsubscribe`,
        {},
    );
}

export async function deleteNewsletterSubscription(
    id: string,
): Promise<TFetcherResponse<{ message: string }>> {
    return await api.delete<{ message: string }>(
        `/newsletters/subscriptions/${id}`,
    );
}


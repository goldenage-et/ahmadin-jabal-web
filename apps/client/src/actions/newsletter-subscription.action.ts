'use server';

import {
    TCreateNewsletterSubscription,
    TFetcherResponse,
    TNewsletterSubscription,
    TNewsletterSubscriptionDetail,
    TNewsletterSubscriptionListResponse,
    TNewsletterSubscriptionQueryFilter,
    TUpdateNewsletterSubscription
} from "@repo/common";
import { api } from "@/lib/api";

// Clean up undefined values from query parameters
function cleanQuery<T>(query?: Partial<T>) {
    return query
        ? Object.fromEntries(
            Object.entries(query).filter(([_, value]) => value !== undefined),
        )
        : undefined;
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


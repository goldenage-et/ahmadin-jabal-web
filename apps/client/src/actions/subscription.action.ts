'use server';

import { api } from '@/lib/api';
import {
    TCreateSubscription,
    TFetcherResponse,
    TSubscription,
    TSubscriptionQueryFilter,
    TSubscriptionWithPlan,
    TUpdateSubscription,
} from '@repo/common';

// Clean up undefined values from query parameters
function cleanQuery<T>(query?: Partial<T>) {
    return query
        ? Object.fromEntries(
            Object.entries(query).filter(([_, value]) => value !== undefined),
        )
        : undefined;
}

// Get current user's active subscription
export async function getMySubscription(): Promise<
    TFetcherResponse<TSubscriptionWithPlan | null>
> {
    return api.get<TSubscriptionWithPlan | null>('/subscriptions/me');
}

// Get all subscriptions (admin only)
export async function getSubscriptions(
    query?: Partial<TSubscriptionQueryFilter>,
): Promise<
    TFetcherResponse<{
        subscriptions: TSubscriptionWithPlan[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>
> {
    return api.get<{
        subscriptions: TSubscriptionWithPlan[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>('/subscriptions', {
        params: cleanQuery(query),
    });
}

// Get a single subscription by ID
export async function getSubscription(
    id: string,
): Promise<TFetcherResponse<TSubscriptionWithPlan>> {
    return api.get<TSubscriptionWithPlan>(`/subscriptions/${id}`);
}

// Subscribe to a plan
// Returns subscription for free plans, or { orderId, paymentId } for paid plans
export async function subscribeToPlan(
    planId: string,
): Promise<TFetcherResponse<TSubscription | { orderId: string; paymentId: string }>> {
    return api.post<TSubscription | { orderId: string; paymentId: string }>('/subscriptions', { planId } as TCreateSubscription);
}

// Cancel a subscription
export async function cancelSubscription(
    subscriptionId: string,
): Promise<TFetcherResponse<TSubscriptionWithPlan>> {
    return api.put<TSubscriptionWithPlan>(`/subscriptions/me/${subscriptionId}/cancel`, {});
}

// Update a subscription (admin only)
export async function updateSubscription(
    id: string,
    data: TUpdateSubscription,
): Promise<TFetcherResponse<TSubscription>> {
    return api.put<TSubscription>(`/subscriptions/${id}`, data);
}


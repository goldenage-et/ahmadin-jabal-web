'use server';

import { api } from '@/lib/api';
import {
    TTransaction,
    TCreateTransaction,
    TUpdateTransaction,
    TTransactionQueryFilter,
    ETransactionStatus,
    TFetcherResponse,
} from '@repo/common';

export async function getTransactions(query?: TTransactionQueryFilter) {
    return await api.get<{ transactions: TTransaction[]; total: number }>('/transactions', {
        params: query,
    });
}

export async function getTransaction(id: string) {
    return await api.get<TTransaction>(`/transactions/${id}`);
}

export async function getTransactionsByPayment(paymentId: string) {
    return await api.get<TTransaction[]>(`/transactions/payment/${paymentId}`);
}

export async function getTransactionsByOrder(orderId: string) {
    return await api.get<TTransaction[]>(`/transactions/order/${orderId}`);
}

export async function createTransaction(data: TCreateTransaction) {
    return await api.post<TTransaction>('/transactions', data);
}

export async function updateTransaction(id: string, data: TUpdateTransaction) {
    return await api.put<TTransaction>(`/transactions/${id}`, data);
}

export async function updateTransactionStatus(
    id: string,
    status: ETransactionStatus,
    metadata?: any,
) {
    return await api.put<TTransaction>(`/transactions/${id}/status`, { status, metadata });
}

export async function deleteTransaction(id: string) {
    return await api.delete<{ message: string }>(`/transactions/${id}`);
}



'use server';

import { api } from '@/lib/api';
import {
    TPayment,
    TCreatePayment,
    TUpdatePayment,
    TPaymentQueryFilter,
    EPaymentStatus,
    TFetcherResponse,
} from '@repo/common';

export async function getPayments(query?: TPaymentQueryFilter) {
    return await api.get<{ payments: TPayment[]; total: number }>('/payments', {
        params: query,
    });
}

export async function getPayment(id: string) {
    return await api.get<TPayment>(`/payments/${id}`);
}

export async function getPaymentsByOrder(orderId: string) {
    return await api.get<TPayment[]>(`/payments/order/${orderId}`);
}

export async function createPayment(data: TCreatePayment) {
    return await api.post<TPayment>('/payments', data);
}

export async function updatePayment(id: string, data: TUpdatePayment) {
    return await api.put<TPayment>(`/payments/${id}`, data);
}

export async function updatePaymentStatus(
    id: string,
    status: EPaymentStatus,
    metadata?: any,
) {
    return await api.put<TPayment>(`/payments/${id}/status`, { status, metadata });
}

export async function completePayment(
    orderId: string,
    bankCode: string,
    referenceNumber: string,
    bankAccountId: string,
) {
    return await api.post<{ payment: TPayment; receiptData: any }>('/payments/complete-payment', {
        orderId,
        bankCode,
        referenceNumber,
        bankAccountId,
    });
}

export async function confirmBankTransfer(
    orderId: string,
    referenceNumber: string,
    receiptData: any,
) {
    return await api.post<TPayment>('/payments/confirm-bank-transfer', {
        orderId,
        referenceNumber,
        receiptData,
    });
}

export async function deletePayment(id: string) {
    return await api.delete<{ message: string }>(`/payments/${id}`);
}


'use server';

import { api } from '@/lib/api';
import {
  TOrder,
  TCreateOrder,
  TUpdateOrder,
  TOrderQueryFilter,
  EOrderStatus,
  EPaymentStatus,
  TOrderBasic,
  TOrderDetail,
  TOrderMini,
} from '@repo/common';

export async function getOrders(query?: TOrderQueryFilter) {
  return await api.get<{ orders: TOrderBasic[]; total: number }>('/orders', {
    params: query,
  });
}

export async function getOrder(id: string) {
  return await api.get<TOrderDetail>(`/orders/${id}`);
}

export async function createOrder(data: TCreateOrder[]) {
  return await api.post<TOrderMini[]>('/orders', data);
}

export async function updateOrder(id: string, data: TUpdateOrder) {
  return await api.put<TOrderMini>(`/orders/${id}`, data);
}

export async function deleteOrder(id: string) {
  return await api.delete<{ message: string }>(`/orders/${id}`);
}

export async function updateOrderStatus(
  id: string,
  status: EOrderStatus,
  notes?: string,
) {
  return await api.put<TOrderMini>(`/orders/${id}/status`, { status, notes });
}

export async function updateOrderPaymentStatus(
  id: string,
  paymentStatus: EPaymentStatus,
) {
  return await api.put<TOrderMini>(`/orders/${id}/payment-status`, {
    paymentStatus,
  });
}

export async function addTrackingNumber(id: string, trackingNumber: string) {
  return await api.put<TOrderMini>(`/orders/${id}/tracking`, {
    trackingNumber,
  });
}

'use server';

import { api } from '@/lib/api';
import {
  TCustomerBasic,
  TCreateCustomer,
  TUpdateCustomer,
  TCustomerQueryFilter,
  TCustomerStats,
  ECustomerStatus,
  TOrderBasic,
} from '@repo/common';

// Get customers with pagination and filtering
export async function getCustomers(query?: TCustomerQueryFilter) {
  return await api.get<{ customers: TCustomerBasic[]; total: number }>(
    '/customers',
    { params: query },
  );
}

// Get customer statistics
export async function getCustomerStats() {
  return await api.get<TCustomerStats>('/customers/stats');
}

// Get a specific customer
export async function getCustomer(id: string) {
  return await api.get<TCustomerBasic>(`/customers/${id}`);
}

// Create a new customer
export async function createCustomer(data: TCreateCustomer) {
  return await api.post<TCustomerBasic>('/customers', data);
}

// Update customer
export async function updateCustomer(id: string, data: TUpdateCustomer) {
  return await api.put<TCustomerBasic>(`/customers/${id}`, data);
}

// Update customer status
export async function updateCustomerStatus(
  id: string,
  status: ECustomerStatus,
) {
  return await api.put<TCustomerBasic>(`/customers/${id}`, { status });
}

// Delete customer
export async function deleteCustomer(id: string) {
  return await api.delete<{ message: string }>(`/customers/${id}`);
}

// Get customer orders
export async function getCustomerOrders(customerId: string) {
  return await api.get<TOrderBasic[]>(`/customers/${customerId}/orders`);
}

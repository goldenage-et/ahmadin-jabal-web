'use server';

import { api } from '@/lib/api';
import {
  TAddress,
  TAddressQueryFilter,
  TCreateAddress,
  TUpdateAddress,
  TFetcherResponse,
} from '@repo/common';

export async function getAddresses(query?: TAddressQueryFilter): Promise<
  TFetcherResponse<{
    data: TAddress[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>
> {
  // Clean up undefined values from query parameters
  const cleanQuery = query
    ? Object.fromEntries(
        Object.entries(query).filter(([_, value]) => value !== undefined),
      )
    : undefined;

  return await api.get<{
    data: TAddress[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>('/addresses', { params: cleanQuery });
}

export async function getAddress(
  id: string,
): Promise<TFetcherResponse<TAddress>> {
  return await api.get<TAddress>(`/addresses/${id}`);
}

export async function createAddress(
  data: TCreateAddress,
): Promise<TFetcherResponse<TAddress>> {
  return await api.post<TAddress>('/addresses', data);
}

export async function updateAddress(
  id: string,
  data: TUpdateAddress,
): Promise<TFetcherResponse<TAddress>> {
  return await api.put<TAddress>(`/addresses/${id}`, data);
}

export async function deleteAddress(
  id: string,
): Promise<TFetcherResponse<void>> {
  return await api.delete<void>(`/addresses/${id}`);
}

// Admin function to get all addresses
export async function getAllAddresses(query?: TAddressQueryFilter): Promise<
  TFetcherResponse<{
    data: TAddress[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>
> {
  // Clean up undefined values from query parameters
  const cleanQuery = query
    ? Object.fromEntries(
        Object.entries(query).filter(([_, value]) => value !== undefined),
      )
    : undefined;

  return await api.get<{
    data: TAddress[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>('/addresses/admin', { params: cleanQuery });
}

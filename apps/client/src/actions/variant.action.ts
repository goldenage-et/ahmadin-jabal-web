'use server';

import { api } from '@/lib/api';
import {
  TCreateBookVariant,
  TBookVariant,
  TBookVariantQueryFilter,
  TUpdateBookVariant,
} from '@repo/common';

// Get many book variants
export async function getBookVariants(
  query?: Partial<TBookVariantQueryFilter>,
) {
  return await api.get<TBookVariant[]>('/variants', { params: query });
}

// Get one book variant
export async function getBookVariant(id: string) {
  return await api.get<TBookVariant>(`/variants/${id}`);
}

// Create a new book variant
export async function createBookVariant(data: TCreateBookVariant) {
  return await api.post<TBookVariant>('/variants', data);
}

// Update a book variant
export async function updateBookVariant(
  id: string,
  data: TUpdateBookVariant,
) {
  return await api.put<TBookVariant>(`/variants/${id}`, data);
}

// Delete a book variant
export async function deleteBookVariant(id: string) {
  return await api.delete<{ message: string }>(`/variants/${id}`);
}

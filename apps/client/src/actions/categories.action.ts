'use server';

import { api } from '@/lib/api';
import {
  TCategoryBasic,
  TCategoryQueryFilter,
  TCreateCategory,
  TUpdateCategory,
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

// Get all categories
export async function getCategories(
  query?: Partial<TCategoryQueryFilter>,
): Promise<TFetcherResponse<TCategoryBasic[]>> {
  return await api.get<TCategoryBasic[]>('/categories', {
    params: cleanQuery(query),
  });
}

// Create a new category
export async function createCategory(
  data: TCreateCategory,
): Promise<TFetcherResponse<TCategoryBasic>> {
  return await api.post<TCategoryBasic>('/categories', data);
}

// Update a category
export async function updateCategory(
  id: string,
  data: TUpdateCategory,
): Promise<TFetcherResponse<TCategoryBasic>> {
  return await api.put<TCategoryBasic>(`/categories/${id}`, data);
}

// Delete a category
export async function deleteCategory(
  id: string,
): Promise<TFetcherResponse<{ message: string }>> {
  return await api.delete<{ message: string }>(`/categories/${id}`);
}

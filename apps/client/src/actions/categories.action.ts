'use server';

import { api } from '@/lib/api';
import {
  TCategory,
  TCreateCategory,
  TUpdateCategory,
  TFetcherResponse,
} from '@repo/common';

// Get all categories
export async function getCategories(): Promise<TCategory[]> {
  return await api
    .get<TCategory[]>('/categories')
    .then((response) => (response.error ? [] : response));
}

// Create a new category
export async function createCategory(
  data: TCreateCategory,
): Promise<TFetcherResponse<TCategory>> {
  return await api
    .post<TCategory>('/categories', data)
    .then((response) => (response.error ? response : response));
}

// Update a category
export async function updateCategory(
  id: string,
  data: TUpdateCategory,
): Promise<TFetcherResponse<TCategory>> {
  return await api.put<TCategory>(`/categories/${id}`, data);
}

// Delete a category
export async function deleteCategory(
  id: string,
): Promise<TFetcherResponse<{ message: string }>> {
  return await api.delete<{ message: string }>(`/categories/${id}`);
}

'use server';

import { api } from '@/lib/api';
import {
  TCategoryBasic,
  TCategoryQueryFilter,
  TCreateCategory,
  TUpdateCategory,
} from '@repo/common';

// Categories

// Get many categories
export async function getCategories(query?: Partial<TCategoryQueryFilter>) {
  return await api.get<TCategoryBasic[]>('/categories', { params: query });
}

// Get one category
export async function getCategory(id: string) {
  return await api.get<TCategoryBasic>(`/categories/${id}`);
}

// Create a new category
export async function createCategory(data: TCreateCategory) {
  return await api.post<TCategoryBasic>('/categories', data);
}

// Update a category
export async function updateCategory(id: string, data: TUpdateCategory) {
  return await api.put<TCategoryBasic>(`/categories/${id}`, data);
}

// Delete a category
export async function deleteCategory(id: string) {
  return await api.delete<{ message: string }>(`/categories/${id}`);
}

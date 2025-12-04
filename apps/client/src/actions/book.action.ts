'use server';

import { api } from '@/lib/api';
import {
  TBookAnalytics,
  TBookBasic,
  TBookDetail,
  TBookDetailAnalytics,
  TBookQueryFilter,
  TBookListResponse,
  TBulkBook,
  TCreateBook,
  TSearchSuggestion,
  TUpdateBook,
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

// Get many books
export async function getManyBooks(
  query?: Partial<TBookQueryFilter>,
): Promise<TFetcherResponse<TBookListResponse>> {
  return await api.get<TBookListResponse>('/books', {
    params: cleanQuery(query),
  });
}

// Get one book
export async function getBook(
  id: string,
): Promise<TFetcherResponse<TBookDetail>> {
  return await api.get<TBookDetail>(`/books/${id}`);
}

// Create a new book
export async function createBook(
  data: TCreateBook,
): Promise<TFetcherResponse<TBookBasic>> {
  return await api.post<TBookBasic>('/books', data);
}

// Update a book
export async function updateBook(
  id: string,
  data: TUpdateBook,
): Promise<TFetcherResponse<TBookBasic>> {
  return await api.put<TBookBasic>(`/books/${id}`, data);
}

export async function bookBulkOperation(
  data: TBulkBook,
): Promise<TFetcherResponse<{ message: string }>> {
  return await api.put<{ message: string }>('/books', data);
}

// Delete a book
export async function deleteBook(
  id: string,
): Promise<TFetcherResponse<{ message: string }>> {
  return await api.delete<{ message: string }>(`/books/${id}`);
}

// Get book analytics
export async function getBookAnalytics(): Promise<TFetcherResponse<TBookAnalytics>> {
  return await api.get<TBookAnalytics>(`/books/analytics`);
}

// Get book detail analytics
export async function getBookDetailAnalytics(
  id: string,
): Promise<TFetcherResponse<TBookDetailAnalytics>> {
  return await api.get<TBookDetailAnalytics>(`/books/${id}/analytics`);
}

// Get popular search analytics (search suggestions)
export async function getPopularSearchAnalytics(): Promise<
  TFetcherResponse<TSearchSuggestion>
> {
  return await api.get<TSearchSuggestion>(`/books/search-suggestion`);
}

import {
  TBookSpecification,
  TBookSpecificationQueryFilter,
  TCreateBookSpecification,
  TUpdateBookSpecification,
} from '@repo/common';

// Get many book specifications for a book
export async function getBookSpecifications(
  bookId: string,
  query?: Partial<TBookSpecificationQueryFilter>,
): Promise<TFetcherResponse<TBookSpecification[]>> {
  return await api.get<TBookSpecification[]>(
    `/books/${bookId}/specifications`,
    { params: cleanQuery(query) },
  );
}

// Get one book specification for a book
export async function getBookSpecification(
  bookId: string,
  id: string,
): Promise<TFetcherResponse<TBookSpecification>> {
  return await api.get<TBookSpecification>(
    `/books/${bookId}/specifications/${id}`,
  );
}

// Create a new book specification for a book
export async function createBookSpecification(
  bookId: string,
  data: TCreateBookSpecification,
): Promise<TFetcherResponse<TBookSpecification>> {
  return await api.post<TBookSpecification>(
    `/books/${bookId}/specifications`,
    data,
  );
}

// Update a book specification for a book
export async function updateBookSpecification(
  bookId: string,
  id: string,
  data: TUpdateBookSpecification,
): Promise<TFetcherResponse<TBookSpecification>> {
  return await api.put<TBookSpecification>(
    `/books/${bookId}/specifications/${id}`,
    data,
  );
}

// Delete a book specification for a book
export async function deleteBookSpecification(
  bookId: string,
  id: string,
): Promise<TFetcherResponse<{ message: string }>> {
  return await api.delete<{ message: string }>(
    `/books/${bookId}/specifications/${id}`,
  );
}

'use server';

import { api } from '@/lib/api';
import {
  TBookAnalytics,
  TBookBasic,
  TBookDetail,
  TBookDetailAnalytics,
  TBookQueryFilter,
  TBulkBook,
  TCreateBook,
  TPaginationResponse,
  TSearchSuggestion,
  TUpdateBook
} from '@repo/common';
// Get many books
export async function getManyBooks(query?: Partial<TBookQueryFilter>) {
  const data = await api.get<TPaginationResponse<TBookBasic[]>>('/books', {
    params: query,
  });
  if (data.error) {
    return {
      data: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
  return data;
}

// Get one book
export async function getBook(id: string) {
  return await api.get<TBookDetail>(`/books/${id}`);
}

// Create a new book
export async function createBook(data: TCreateBook) {
  return await api.post<TBookBasic>('/books', data);
}

// Update a book
export async function updateBook(id: string, data: TUpdateBook) {
  return await api.put<TBookBasic>(`/books/${id}`, data);
}

export async function bookBulkOperation(data: TBulkBook) {
  return await api.put<{ message: string }>('/books', data);
}

// Delete a book
export async function deleteBook(id: string) {
  return await api.delete<{ message: string }>(`/books/${id}`);
}

// Get book analytics
export async function getBookAnalytics() {
  return await api.get<TBookAnalytics>(`/books/analytics`);
}

// Get book detail analytics
export async function getBookDetailAnalytics(id: string) {
  return await api.get<TBookDetailAnalytics>(`/books/${id}/analytics`);
}

// Get popular search analytics (search suggestions)
export async function getPopularSearchAnalytics() {
  const searchSuggestions = await api.get<TSearchSuggestion>(
    `/books/search-suggestion`,
  );
  if (searchSuggestions.error) {
    return {
      error: undefined,
      popularEvents: [],
      trendingEvents: [],
      recentEvents: [],
    };
  }
  return searchSuggestions;
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
) {
  return await api.get<TBookSpecification[]>(
    `/books/${bookId}/specifications`,
    { params: query },
  );
}

// Get one book specification for a book
export async function getBookSpecification(bookId: string, id: string) {
  return await api.get<TBookSpecification>(
    `/books/${bookId}/specifications/${id}`,
  );
}

// Create a new book specification for a book
export async function createBookSpecification(
  bookId: string,
  data: TCreateBookSpecification,
) {
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
) {
  return await api.put<TBookSpecification>(
    `/books/${bookId}/specifications/${id}`,
    data,
  );
}

// Delete a book specification for a book
export async function deleteBookSpecification(
  bookId: string,
  id: string,
) {
  return await api.delete<{ message: string }>(
    `/books/${bookId}/specifications/${id}`,
  );
}

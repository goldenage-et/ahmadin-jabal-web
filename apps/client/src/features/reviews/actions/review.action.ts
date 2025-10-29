import { api } from '@/lib/api';
import {
  TBookReviewQueryFilter,
  TCreateBookReview,
  TCreateReviewHelpful,
  TCreateReviewReport,
  TBookReviewListResponse,
  TBookReview,
  TReviewAnalytics,
  TBookReviewBasic,
  TUpdateBookReview,
} from '@repo/common';

// Book review functions
export async function getBookReviews(
  params: Partial<TBookReviewQueryFilter>,
): Promise<TBookReviewListResponse> {
  const response = await api.get<TBookReviewListResponse>(
    `/book-reviews`,
    { params },
  );
  if (response.error) {
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
  return response;
}

export async function getBookReviewAnalytics(bookId: string) {
  const response = await api.get<TReviewAnalytics>(
    `/book-reviews/analytics/${bookId}`,
  );
  return response;
}

export async function createBookReview(data: TCreateBookReview) {
  const response = await api.post<TBookReview>('/book-reviews', data);
  return response;
}

export async function markBookReviewHelpful(data: TCreateReviewHelpful) {
  const response = await api.post('/book-reviews/helpful', data);
  return response;
}

export async function reportBookReview(data: TCreateReviewReport) {
  const response = await api.post('/book-reviews/report', data);
  return response;
}

export async function updateBookReview(
  reviewId: string,
  data: TUpdateBookReview,
) {
  const response = await api.put<TBookReview>(
    `/book-reviews/${reviewId}`,
    data,
  );
  return response;
}

export async function deleteBookReview(reviewId: string) {
  const response = await api.delete(`/book-reviews/${reviewId}`);
  return response;
}

// Store review functions
export async function getStoreReviews(filters: any) {
  const searchParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  const response = await api.get(`/store-reviews?${searchParams.toString()}`);
  return response;
}

export async function getStoreReviewAnalytics(storeId: string) {
  const response = await api.get(`/store-reviews/analytics/${storeId}`);
  return response;
}

export async function createStoreReview(data: TCreateBookReview) {
  const response = await api.post<TBookReview>('/store-reviews', data);
  return response;
}

export async function markStoreReviewHelpful(data: TCreateReviewHelpful) {
  const response = await api.post('/store-reviews/helpful', data);
  return response;
}

export async function reportStoreReview(data: TCreateReviewReport) {
  const response = await api.post('/store-reviews/report', data);
  return response;
}

export async function updateStoreReview(
  reviewId: string,
  data: TUpdateBookReview,
) {
  const response = await api.put(`/store-reviews/${reviewId}`, data);
  return response;
}

export async function deleteStoreReview(reviewId: string) {
  const response = await api.delete(`/store-reviews/${reviewId}`);
  return response;
}

// Admin review management functions (split for book/store)
export async function moderateBookReview(reviewId: string, status: string) {
  const response = await api.put(`/book-reviews/${reviewId}/moderate`, {
    status,
  });
  return response;
}

export async function moderateStoreReview(reviewId: string, status: string) {
  const response = await api.put(`/store-reviews/${reviewId}/moderate`, {
    status,
  });
  return response;
}

export async function bulkModerateBookReviews(
  reviewIds: string[],
  status: string,
) {
  const response = await api.put(`/book-reviews/bulk-moderate`, {
    reviewIds,
    status,
  });
  return response;
}

export async function bulkModerateStoreReviews(
  reviewIds: string[],
  status: string,
) {
  const response = await api.put(`/store-reviews/bulk-moderate`, {
    reviewIds,
    status,
  });
  return response;
}

export async function getBookReviewReports(reviewId: string) {
  const response = await api.get(`/book-reviews/${reviewId}/reports`);
  return response;
}

export async function getStoreReviewReports(reviewId: string) {
  const response = await api.get(`/store-reviews/${reviewId}/reports`);
  return response;
}

export async function respondToBookReview(
  reviewId: string,
  responseText: string,
) {
  const apiResponse = await api.post(`/book-reviews/${reviewId}/respond`, {
    response: responseText,
  });
  return apiResponse;
}

export async function respondToStoreReview(
  reviewId: string,
  responseText: string,
) {
  const apiResponse = await api.post(`/store-reviews/${reviewId}/respond`, {
    response: responseText,
  });
  return apiResponse;
}

export async function getBookReviewStatistics(bookId: string) {
  const response = await api.get(`/book-reviews/statistics/${bookId}`);
  return response;
}

export async function getStoreReviewStatistics(storeId: string) {
  const response = await api.get(`/store-reviews/statistics/${storeId}`);
  return response;
}

export async function getPendingBookReviews(
  bookId: string,
  page: number = 1,
  limit: number = 10,
) {
  const response = await api.get(
    `/book-reviews/pending/${bookId}?page=${page}&limit=${limit}`,
  );
  return response;
}

export async function getPendingStoreReviews(
  storeId: string,
  page: number = 1,
  limit: number = 10,
) {
  const response = await api.get(
    `/store-reviews/pending/${storeId}?page=${page}&limit=${limit}`,
  );
  return response;
}

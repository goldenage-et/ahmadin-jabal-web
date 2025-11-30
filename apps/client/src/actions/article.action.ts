'use server';

import { api } from '@/lib/api';
import {
    TArticleBasic,
    TArticleDetail,
    TArticleQueryFilter,
    TCreateArticle,
    TUpdateArticle,
    TFetcherResponse,
    TPaginationResponse,
} from '@repo/common';

// Clean up undefined values from query parameters
function cleanQuery(query?: Partial<TArticleQueryFilter>) {
    return query
        ? Object.fromEntries(
            Object.entries(query).filter(([_, value]) => value !== undefined),
        )
        : undefined;
}

// Get many articles
export async function getManyArticles(
    query?: Partial<TArticleQueryFilter>,
): Promise<TFetcherResponse<TPaginationResponse<TArticleBasic[]>>> {
    return await api.get<TPaginationResponse<TArticleBasic[]>>('/articles', {
        params: cleanQuery(query),
    });
}

// Get my articles
export async function getMyArticles(
    query?: Partial<TArticleQueryFilter>,
): Promise<TFetcherResponse<TPaginationResponse<TArticleBasic[]>>> {
    return await api.get<TPaginationResponse<TArticleBasic[]>>('/articles/my', {
        params: cleanQuery(query),
    });
}

// Get one article by ID
export async function getArticle(
    id: string,
): Promise<TFetcherResponse<TArticleDetail>> {
    return await api.get<TArticleDetail>(`/articles/${id}`);
}

// Get one article by slug
export async function getArticleBySlug(
    slug: string,
): Promise<TFetcherResponse<TArticleDetail>> {
    return await api.get<TArticleDetail>(`/articles/slug/${slug}`);
}

// Create a new article
export async function createArticle(
    data: TCreateArticle,
): Promise<TFetcherResponse<TArticleBasic>> {
    return await api.post<TArticleBasic>('/articles', data);
}

// Update an article by ID
export async function updateArticle(
    id: string,
    data: TUpdateArticle,
): Promise<TFetcherResponse<TArticleBasic>> {
    return await api.put<TArticleBasic>(`/articles/${id}`, data);
}

// Update an article by slug
export async function updateArticleBySlug(
    slug: string,
    data: TUpdateArticle,
): Promise<TFetcherResponse<TArticleBasic>> {
    return await api.put<TArticleBasic>(`/articles/slug/${slug}`, data);
}

// Delete an article by ID
export async function deleteArticle(
    id: string,
): Promise<TFetcherResponse<{ message: string }>> {
    return await api.delete<{ message: string }>(`/articles/${id}`);
}

// Delete an article by slug
export async function deleteArticleBySlug(
    slug: string,
): Promise<TFetcherResponse<{ message: string }>> {
    return await api.delete<{ message: string }>(`/articles/slug/${slug}`);
}

// Like an article
export async function likeArticle(
    id: string,
): Promise<TFetcherResponse<{ likeCount: number }>> {
    return await api.post<{ likeCount: number }>(`/articles/${id}/like`, {});
}


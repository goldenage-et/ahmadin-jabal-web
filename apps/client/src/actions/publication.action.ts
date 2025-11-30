'use server';

import { api } from '@/lib/api';
import {
    TPublicationBasic,
    TPublicationDetail,
    TPublicationQueryFilter,
    TCreatePublication,
    TUpdatePublication,
    TPublicationComment,
    TCreatePublicationComment,
    TUpdatePublicationComment,
    TFetcherResponse,
    TPaginationResponse,
} from '@repo/common';

// Clean up undefined values from query parameters
function cleanQuery(query?: Partial<TPublicationQueryFilter>) {
    return query
        ? Object.fromEntries(
            Object.entries(query).filter(([_, value]) => value !== undefined),
        )
        : undefined;
}

// Get many publications
export async function getManyPublications(
    query?: Partial<TPublicationQueryFilter>,
): Promise<TFetcherResponse<TPaginationResponse<TPublicationBasic[]>>> {
    return await api.get<TPaginationResponse<TPublicationBasic[]>>(
        '/publications',
        {
            params: cleanQuery(query),
        },
    );
}

// Get my publications
export async function getMyPublications(
    query?: Partial<TPublicationQueryFilter>,
): Promise<TFetcherResponse<TPaginationResponse<TPublicationBasic[]>>> {
    return await api.get<TPaginationResponse<TPublicationBasic[]>>(
        '/publications/my',
        {
            params: cleanQuery(query),
        },
    );
}

// Get one publication by ID
export async function getPublication(
    id: string,
): Promise<TFetcherResponse<TPublicationDetail>> {
    return await api.get<TPublicationDetail>(`/publications/${id}`);
}

// Get one publication by slug
export async function getPublicationBySlug(
    slug: string,
): Promise<TFetcherResponse<TPublicationDetail>> {
    return await api.get<TPublicationDetail>(`/publications/slug/${slug}`);
}

// Create a new publication
export async function createPublication(
    data: TCreatePublication,
): Promise<TFetcherResponse<TPublicationBasic>> {
    return await api.post<TPublicationBasic>('/publications', data);
}

// Update a publication by ID
export async function updatePublication(
    id: string,
    data: TUpdatePublication,
): Promise<TFetcherResponse<TPublicationBasic>> {
    return await api.put<TPublicationBasic>(`/publications/${id}`, data);
}

// Update a publication by slug
export async function updatePublicationBySlug(
    slug: string,
    data: TUpdatePublication,
): Promise<TFetcherResponse<TPublicationBasic>> {
    return await api.put<TPublicationBasic>(`/publications/slug/${slug}`, data);
}

// Delete a publication by ID
export async function deletePublication(
    id: string,
): Promise<TFetcherResponse<{ message: string }>> {
    return await api.delete<{ message: string }>(`/publications/${id}`);
}

// Delete a publication by slug
export async function deletePublicationBySlug(
    slug: string,
): Promise<TFetcherResponse<{ message: string }>> {
    return await api.delete<{ message: string }>(`/publications/slug/${slug}`);
}

// Like a publication
export async function likePublication(
    id: string,
): Promise<TFetcherResponse<{ likeCount: number }>> {
    return await api.post<{ likeCount: number }>(`/publications/${id}/like`, {});
}

// Download a publication
export async function downloadPublication(
    id: string,
): Promise<TFetcherResponse<{ downloadCount: number }>> {
    return await api.post<{ downloadCount: number }>(
        `/publications/${id}/download`,
        {},
    );
}

// Comment endpoints
export async function createPublicationComment(
    publicationId: string,
    data: TCreatePublicationComment,
): Promise<TFetcherResponse<TPublicationComment>> {
    return await api.post<TPublicationComment>(
        `/publications/${publicationId}/comments`,
        data,
    );
}

export async function getPublicationComments(
    publicationId: string,
): Promise<TFetcherResponse<TPublicationComment[]>> {
    return await api.get<TPublicationComment[]>(
        `/publications/${publicationId}/comments`,
    );
}

export async function updatePublicationComment(
    commentId: string,
    data: TUpdatePublicationComment,
): Promise<TFetcherResponse<TPublicationComment>> {
    return await api.put<TPublicationComment>(
        `/publications/comments/${commentId}`,
        data,
    );
}

export async function deletePublicationComment(
    commentId: string,
): Promise<TFetcherResponse<{ message: string }>> {
    return await api.delete<{ message: string }>(
        `/publications/comments/${commentId}`,
    );
}


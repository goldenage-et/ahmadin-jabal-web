'use server';

import { api } from '@/lib/api';
import {
    TBlogBasic,
    TBlogDetail,
    TBlogQueryFilter,
    TCreateBlog,
    TUpdateBlog,
    TFetcherResponse,
} from '@repo/common';

// Clean up undefined values from query parameters
function cleanQuery(query?: Partial<TBlogQueryFilter>) {
    return query
        ? Object.fromEntries(
            Object.entries(query).filter(([_, value]) => value !== undefined),
        )
        : undefined;
}

// Get many blogs
export async function getManyBlogs(
    query?: Partial<TBlogQueryFilter>,
): Promise<TFetcherResponse<{ data: TBlogBasic[]; meta: any }>> {
    return await api.get<{ data: TBlogBasic[]; meta: any }>('/blogs', {
        params: cleanQuery(query),
    });
}

// Get my blogs
export async function getMyBlogs(
    query?: Partial<TBlogQueryFilter>,
): Promise<TFetcherResponse<{ data: TBlogBasic[]; meta: any }>> {
    return await api.get<{ data: TBlogBasic[]; meta: any }>('/blogs/my', {
        params: cleanQuery(query),
    });
}

// Get one blog by ID
export async function getBlog(
    id: string,
): Promise<TFetcherResponse<TBlogDetail>> {
    return await api.get<TBlogDetail>(`/blogs/${id}`);
}

// Get one blog by slug
export async function getBlogBySlug(
    slug: string,
): Promise<TFetcherResponse<TBlogDetail>> {
    return await api.get<TBlogDetail>(`/blogs/slug/${slug}`);
}

// Create a new blog
export async function createBlog(
    data: TCreateBlog,
): Promise<TFetcherResponse<TBlogBasic>> {
    return await api.post<TBlogBasic>('/blogs', data);
}

// Update an blog by ID
export async function updateBlog(
    id: string,
    data: TUpdateBlog,
): Promise<TFetcherResponse<TBlogBasic>> {
    return await api.put<TBlogBasic>(`/blogs/${id}`, data);
}

// Update an blog by slug
export async function updateBlogBySlug(
    slug: string,
    data: TUpdateBlog,
): Promise<TFetcherResponse<TBlogBasic>> {
    return await api.put<TBlogBasic>(`/blogs/slug/${slug}`, data);
}

// Delete an blog by ID
export async function deleteBlog(
    id: string,
): Promise<TFetcherResponse<{ message: string }>> {
    return await api.delete<{ message: string }>(`/blogs/${id}`);
}

// Delete an blog by slug
export async function deleteBlogBySlug(
    slug: string,
): Promise<TFetcherResponse<{ message: string }>> {
    return await api.delete<{ message: string }>(`/blogs/slug/${slug}`);
}

// Like an blog
export async function likeBlog(
    id: string,
): Promise<TFetcherResponse<{ likeCount: number }>> {
    return await api.post<{ likeCount: number }>(`/blogs/${id}/like`, {});
}


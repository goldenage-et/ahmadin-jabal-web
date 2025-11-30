'use server';

import { api } from '@/lib/api';
import {
    TMediaBasic,
    TMediaDetail,
    TMediaQueryFilter,
    TMediaListResponse,
    TCreateMedia,
    TUpdateMedia,
    TVideoBasic,
    TVideoDetail,
    TVideoQueryFilter,
    TVideoListResponse,
    TCreateVideo,
    TUpdateVideo,
    TAudioBasic,
    TAudioDetail,
    TAudioQueryFilter,
    TAudioListResponse,
    TCreateAudio,
    TUpdateAudio,
    TPhotoBasic,
    TPhotoDetail,
    TPhotoQueryFilter,
    TPhotoListResponse,
    TCreatePhoto,
    TUpdatePhoto,
    TGalleryBasic,
    TGalleryDetail,
    TGalleryQueryFilter,
    TGalleryListResponse,
    TCreateGallery,
    TUpdateGallery,
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

// ==================== MEDIA ACTIONS ====================

export async function getManyMedia(
    query?: Partial<TMediaQueryFilter>,
): Promise<TFetcherResponse<TMediaListResponse>> {
    return await api.get<TMediaListResponse>('/media', {
        params: cleanQuery(query),
    });
}

export async function getMedia(
    id: string,
): Promise<TFetcherResponse<TMediaDetail>> {
    return await api.get<TMediaDetail>(`/media/${id}`);
}

export async function createMedia(
    data: TCreateMedia,
): Promise<TFetcherResponse<TMediaBasic>> {
    return await api.post<TMediaBasic>('/media', data);
}

export async function updateMedia(
    id: string,
    data: TUpdateMedia,
): Promise<TFetcherResponse<TMediaBasic>> {
    return await api.put<TMediaBasic>(`/media/${id}`, data);
}

export async function deleteMedia(
    id: string,
): Promise<TFetcherResponse<{ message: string }>> {
    return await api.delete<{ message: string }>(`/media/${id}`);
}

// ==================== VIDEO ACTIONS ====================

export async function getManyVideos(
    query?: Partial<TVideoQueryFilter>,
): Promise<TFetcherResponse<TVideoListResponse>> {
    return await api.get<TVideoListResponse>('/media/videos', {
        params: cleanQuery(query),
    });
}

export async function getVideo(
    id: string,
): Promise<TFetcherResponse<TVideoDetail>> {
    return await api.get<TVideoDetail>(`/media/videos/${id}`);
}

export async function createVideo(
    data: TCreateVideo,
): Promise<TFetcherResponse<TVideoBasic>> {
    return await api.post<TVideoBasic>('/media/videos', data);
}

export async function updateVideo(
    id: string,
    data: TUpdateVideo,
): Promise<TFetcherResponse<TVideoBasic>> {
    return await api.put<TVideoBasic>(`/media/videos/${id}`, data);
}

export async function deleteVideo(
    id: string,
): Promise<TFetcherResponse<{ message: string }>> {
    return await api.delete<{ message: string }>(`/media/videos/${id}`);
}

// ==================== AUDIO ACTIONS ====================

export async function getManyAudios(
    query?: Partial<TAudioQueryFilter>,
): Promise<TFetcherResponse<TAudioListResponse>> {
    return await api.get<TAudioListResponse>('/media/audios', {
        params: cleanQuery(query),
    });
}

export async function getAudio(
    id: string,
): Promise<TFetcherResponse<TAudioDetail>> {
    return await api.get<TAudioDetail>(`/media/audios/${id}`);
}

export async function createAudio(
    data: TCreateAudio,
): Promise<TFetcherResponse<TAudioBasic>> {
    return await api.post<TAudioBasic>('/media/audios', data);
}

export async function updateAudio(
    id: string,
    data: TUpdateAudio,
): Promise<TFetcherResponse<TAudioBasic>> {
    return await api.put<TAudioBasic>(`/media/audios/${id}`, data);
}

export async function deleteAudio(
    id: string,
): Promise<TFetcherResponse<{ message: string }>> {
    return await api.delete<{ message: string }>(`/media/audios/${id}`);
}

// ==================== PHOTO ACTIONS ====================

export async function getManyPhotos(
    query?: Partial<TPhotoQueryFilter>,
): Promise<TFetcherResponse<TPhotoListResponse>> {
    return await api.get<TPhotoListResponse>('/media/photos', {
        params: cleanQuery(query),
    });
}

export async function getPhoto(
    id: string,
): Promise<TFetcherResponse<TPhotoDetail>> {
    return await api.get<TPhotoDetail>(`/media/photos/${id}`);
}

export async function createPhoto(
    data: TCreatePhoto,
): Promise<TFetcherResponse<TPhotoBasic>> {
    return await api.post<TPhotoBasic>('/media/photos', data);
}

export async function updatePhoto(
    id: string,
    data: TUpdatePhoto,
): Promise<TFetcherResponse<TPhotoBasic>> {
    return await api.put<TPhotoBasic>(`/media/photos/${id}`, data);
}

export async function deletePhoto(
    id: string,
): Promise<TFetcherResponse<{ message: string }>> {
    return await api.delete<{ message: string }>(`/media/photos/${id}`);
}

// ==================== GALLERY ACTIONS ====================

export async function getManyGalleries(
    query?: Partial<TGalleryQueryFilter>,
): Promise<TFetcherResponse<TGalleryListResponse>> {
    return await api.get<TGalleryListResponse>('/media/galleries', {
        params: cleanQuery(query),
    });
}

export async function getGallery(
    id: string,
): Promise<TFetcherResponse<TGalleryDetail>> {
    return await api.get<TGalleryDetail>(`/media/galleries/${id}`);
}

export async function getGalleryBySlug(
    slug: string,
): Promise<TFetcherResponse<TGalleryDetail>> {
    return await api.get<TGalleryDetail>(`/media/galleries/slug/${slug}`);
}

export async function createGallery(
    data: TCreateGallery,
): Promise<TFetcherResponse<TGalleryBasic>> {
    return await api.post<TGalleryBasic>('/media/galleries', data);
}

export async function updateGallery(
    id: string,
    data: TUpdateGallery,
): Promise<TFetcherResponse<TGalleryBasic>> {
    return await api.put<TGalleryBasic>(`/media/galleries/${id}`, data);
}

export async function deleteGallery(
    id: string,
): Promise<TFetcherResponse<{ message: string }>> {
    return await api.delete<{ message: string }>(`/media/galleries/${id}`);
}


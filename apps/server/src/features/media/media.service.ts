import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    TCreateMedia,
    TUpdateMedia,
    TMediaBasic,
    TMediaQueryFilter,
    TMediaQueryUnique,
    TMediaListResponse,
    TMediaDetail,
    ZMediaBasic,
    ZMediaListResponse,
    ZMediaDetail,
    TAuthUser,
    TCreateVideo,
    TUpdateVideo,
    TVideoBasic,
    TVideoQueryFilter,
    TVideoQueryUnique,
    TVideoListResponse,
    TVideoDetail,
    ZVideoBasic,
    ZVideoListResponse,
    ZVideoDetail,
    TCreateAudio,
    TUpdateAudio,
    TAudioBasic,
    TAudioQueryFilter,
    TAudioQueryUnique,
    TAudioListResponse,
    TAudioDetail,
    ZAudioBasic,
    ZAudioListResponse,
    ZAudioDetail,
    TCreatePhoto,
    TUpdatePhoto,
    TPhotoBasic,
    TPhotoQueryFilter,
    TPhotoQueryUnique,
    TPhotoListResponse,
    TPhotoDetail,
    ZPhotoBasic,
    ZPhotoListResponse,
    ZPhotoDetail,
    TCreateGallery,
    TUpdateGallery,
    TGalleryBasic,
    TGalleryQueryFilter,
    TGalleryQueryUnique,
    TGalleryListResponse,
    TGalleryDetail,
    ZGalleryBasic,
    ZGalleryListResponse,
    ZGalleryDetail,
    EMediaStatus,
} from '@repo/common';
import { PrismaClient } from '@repo/prisma';
import { getContentAccessLevel, isPremiumUser } from '@/helpers/premium-access.helper';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class MediaService {
    constructor(
        @Inject(PRISMA_CLIENT) private readonly db: PrismaClient,
        private readonly subscriptionsService: SubscriptionsService,
    ) { }

    // Helper to get content access level with subscription check
    private async getAccessLevel(
        user: TAuthUser | null,
        contentIsPremium: boolean,
    ) {
        const hasActiveSubscription = user
            ? await this.subscriptionsService.hasActiveSubscription(user.id)
            : false;
        return getContentAccessLevel(user, contentIsPremium, hasActiveSubscription);
    }

    // ==================== MEDIA CRUD ====================

    async createMedia(data: TCreateMedia, uploadedBy: string): Promise<TMediaBasic> {
        const media = await this.db.media.create({
            data: {
                ...data,
                uploadedBy,
            } as any,
        });

        return ZMediaBasic.parse(media);
    }

    async getManyMedia(query: TMediaQueryFilter & { user?: TAuthUser | null }): Promise<TMediaListResponse> {
        const where: any = {};

        if (query.type) {
            where.type = query.type;
        }

        if (query.category) {
            where.category = { contains: query.category, mode: 'insensitive' };
        }

        if (query.source) {
            where.source = query.source;
        }

        if (query.status) {
            where.status = query.status;
        }

        if (typeof query.featured === 'boolean') {
            where.featured = query.featured;
        }

        if (query.uploadedBy) {
            where.uploadedBy = query.uploadedBy;
        }

        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        let orderBy: any = { createdAt: query.sortOrder || 'desc' };
        switch (query.sortBy) {
            case 'title':
                orderBy = { title: query.sortOrder || 'desc' };
                break;
            case 'publishedAt':
                orderBy = { publishedAt: query.sortOrder || 'desc' };
                break;
            case 'viewCount':
                orderBy = { viewCount: query.sortOrder || 'desc' };
                break;
            case 'likeCount':
                orderBy = { likeCount: query.sortOrder || 'desc' };
                break;
            case 'downloadCount':
                orderBy = { downloadCount: query.sortOrder || 'desc' };
                break;
            case 'fileSize':
                orderBy = { fileSize: query.sortOrder || 'desc' };
                break;
            case 'createdAt':
            default:
                orderBy = { createdAt: query.sortOrder || 'desc' };
                break;
        }

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const total = await this.db.media.count({ where });

        const media = await this.db.media.findMany({
            where,
            orderBy,
            skip,
            take: limit,
        });

        // Apply premium access control - hide full content for non-premium users
        const hasActiveSubscription = query.user
            ? await this.subscriptionsService.hasActiveSubscription(query.user.id)
            : false;
        const mediaWithAccessControl = media.map(item => {
            const accessLevel = getContentAccessLevel(query.user || null, item.isPremium, hasActiveSubscription);
            if (accessLevel === 'preview' && item.isPremium) {
                // For preview, hide the actual URL but keep metadata
                return {
                    ...item,
                    url: item.thumbnail || item.url, // Show thumbnail instead of full URL
                };
            }
            return item;
        });

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return ZMediaListResponse.parse({
            data: mediaWithAccessControl,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext,
                hasPrev,
            },
        });
    }

    async getOneMedia(query: TMediaQueryUnique, user?: TAuthUser | null): Promise<TMediaDetail> {
        const media = await this.db.media.findUnique({
            where: { id: query.id },
            include: {
                uploader: {
                    select: {
                        id: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        if (!media) {
            throw new NotFoundException('Media not found');
        }

        // Check premium access (check subscription)
        const hasActiveSubscription = user
            ? await this.subscriptionsService.hasActiveSubscription(user.id)
            : false;
        const accessLevel = getContentAccessLevel(user || null, media.isPremium, hasActiveSubscription);
        if (accessLevel === 'preview' && media.isPremium) {
            // Return preview version (metadata but limited URL access)
            const mediaPreview = {
                ...media,
                url: media.thumbnail || media.url, // Show thumbnail instead of full URL
            };
            return ZMediaDetail.parse(mediaPreview);
        }

        return ZMediaDetail.parse(media);
    }

    async updateMedia(
        query: TMediaQueryUnique,
        data: TUpdateMedia,
    ): Promise<TMediaBasic> {
        const updatedMedia = await this.db.media.update({
            where: { id: query.id },
            data: data as any,
        });

        if (!updatedMedia) {
            throw new NotFoundException('Media not found');
        }

        return ZMediaBasic.parse(updatedMedia);
    }

    async deleteMedia(query: TMediaQueryUnique): Promise<{ message: string }> {
        const deletedMedia = await this.db.media.delete({
            where: { id: query.id },
        });

        if (!deletedMedia) {
            throw new NotFoundException('Media not found');
        }

        return { message: 'Media deleted successfully' };
    }

    // ==================== VIDEO CRUD ====================

    async createVideo(data: TCreateVideo, uploadedBy: string): Promise<TVideoBasic> {
        const video = await this.db.video.create({
            data: {
                ...data,
                uploadedBy,
            } as any,
        });

        return ZVideoBasic.parse(video);
    }

    async getManyVideos(query: TVideoQueryFilter & { user?: TAuthUser | null }): Promise<TVideoListResponse> {
        const where: any = {};

        if (query.category) {
            where.category = { contains: query.category, mode: 'insensitive' };
        }

        if (query.source) {
            where.source = query.source;
        }

        if (query.status) {
            where.status = query.status;
        }

        if (typeof query.featured === 'boolean') {
            where.featured = query.featured;
        }

        if (query.uploadedBy) {
            where.uploadedBy = query.uploadedBy;
        }

        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        let orderBy: any = { createdAt: query.sortOrder || 'desc' };
        switch (query.sortBy) {
            case 'title':
                orderBy = { title: query.sortOrder || 'desc' };
                break;
            case 'publishedAt':
                orderBy = { publishedAt: query.sortOrder || 'desc' };
                break;
            case 'viewCount':
                orderBy = { viewCount: query.sortOrder || 'desc' };
                break;
            case 'likeCount':
                orderBy = { likeCount: query.sortOrder || 'desc' };
                break;
            case 'downloadCount':
                orderBy = { downloadCount: query.sortOrder || 'desc' };
                break;
            case 'duration':
                orderBy = { duration: query.sortOrder || 'desc' };
                break;
            case 'createdAt':
            default:
                orderBy = { createdAt: query.sortOrder || 'desc' };
                break;
        }

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const total = await this.db.video.count({ where });

        const videos = await this.db.video.findMany({
            where,
            orderBy,
            skip,
            take: limit,
        });

        // Apply premium access control - hide full content for non-premium users
        const hasActiveSubscription = query.user
            ? await this.subscriptionsService.hasActiveSubscription(query.user.id)
            : false;
        const videosWithAccessControl = videos.map(item => {
            const accessLevel = getContentAccessLevel(query.user || null, item.isPremium, hasActiveSubscription);
            if (accessLevel === 'preview' && item.isPremium) {
                // For preview, hide the actual URL but keep metadata
                return {
                    ...item,
                    url: item.thumbnail || item.url, // Show thumbnail instead of full URL
                };
            }
            return item;
        });

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return ZVideoListResponse.parse({
            data: videosWithAccessControl,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext,
                hasPrev,
            },
        });
    }

    async getOneVideo(query: TVideoQueryUnique, user?: TAuthUser | null): Promise<TVideoDetail> {
        const video = await this.db.video.findUnique({
            where: { id: query.id },
            include: {
                uploader: {
                    select: {
                        id: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        if (!video) {
            throw new NotFoundException('Video not found');
        }

        // Check premium access (check subscription)
        const hasActiveSubscription = user
            ? await this.subscriptionsService.hasActiveSubscription(user.id)
            : false;
        const accessLevel = getContentAccessLevel(user || null, video.isPremium, hasActiveSubscription);
        if (accessLevel === 'preview' && video.isPremium) {
            // Return preview version (metadata but limited URL access)
            const videoPreview = {
                ...video,
                url: video.thumbnail || video.url, // Show thumbnail instead of full URL
            };
            return ZVideoDetail.parse(videoPreview);
        }

        return ZVideoDetail.parse(video);
    }

    async updateVideo(
        query: TVideoQueryUnique,
        data: TUpdateVideo,
    ): Promise<TVideoBasic> {
        const updatedVideo = await this.db.video.update({
            where: { id: query.id },
            data: data as any,
        });

        if (!updatedVideo) {
            throw new NotFoundException('Video not found');
        }

        return ZVideoBasic.parse(updatedVideo);
    }

    async deleteVideo(query: TVideoQueryUnique): Promise<{ message: string }> {
        const deletedVideo = await this.db.video.delete({
            where: { id: query.id },
        });

        if (!deletedVideo) {
            throw new NotFoundException('Video not found');
        }

        return { message: 'Video deleted successfully' };
    }

    // ==================== AUDIO CRUD ====================

    async createAudio(data: TCreateAudio, uploadedBy: string): Promise<TAudioBasic> {
        const audio = await this.db.audio.create({
            data: {
                ...data,
                uploadedBy,
            } as any,
        });

        return ZAudioBasic.parse(audio);
    }

    async getManyAudios(query: TAudioQueryFilter & { user?: TAuthUser | null }): Promise<TAudioListResponse> {
        const where: any = {};

        if (query.category) {
            where.category = { contains: query.category, mode: 'insensitive' };
        }

        if (query.source) {
            where.source = query.source;
        }

        if (query.status) {
            where.status = query.status;
        }

        if (typeof query.featured === 'boolean') {
            where.featured = query.featured;
        }

        if (typeof query.isAvailable === 'boolean') {
            where.isAvailable = query.isAvailable;
        }

        if (query.uploadedBy) {
            where.uploadedBy = query.uploadedBy;
        }

        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        let orderBy: any = { createdAt: query.sortOrder || 'desc' };
        switch (query.sortBy) {
            case 'title':
                orderBy = { title: query.sortOrder || 'desc' };
                break;
            case 'publishedAt':
                orderBy = { publishedAt: query.sortOrder || 'desc' };
                break;
            case 'viewCount':
                orderBy = { viewCount: query.sortOrder || 'desc' };
                break;
            case 'likeCount':
                orderBy = { likeCount: query.sortOrder || 'desc' };
                break;
            case 'downloadCount':
                orderBy = { downloadCount: query.sortOrder || 'desc' };
                break;
            case 'duration':
                orderBy = { duration: query.sortOrder || 'desc' };
                break;
            case 'createdAt':
            default:
                orderBy = { createdAt: query.sortOrder || 'desc' };
                break;
        }

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const total = await this.db.audio.count({ where });

        const audios = await this.db.audio.findMany({
            where,
            orderBy,
            skip,
            take: limit,
        });

        // Apply premium access control - hide full content for non-premium users
        const hasActiveSubscription = query.user
            ? await this.subscriptionsService.hasActiveSubscription(query.user.id)
            : false;
        const audiosWithAccessControl = audios.map(item => {
            const accessLevel = getContentAccessLevel(query.user || null, item.isPremium, hasActiveSubscription);
            if (accessLevel === 'preview' && item.isPremium) {
                // For preview, hide the actual URL but keep metadata
                return {
                    ...item,
                    url: item.thumbnail || item.url, // Show thumbnail instead of full URL
                };
            }
            return item;
        });

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return ZAudioListResponse.parse({
            data: audiosWithAccessControl,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext,
                hasPrev,
            },
        });
    }

    async getOneAudio(query: TAudioQueryUnique, user?: TAuthUser | null): Promise<TAudioDetail> {
        const audio = await this.db.audio.findUnique({
            where: { id: query.id },
            include: {
                uploader: {
                    select: {
                        id: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        if (!audio) {
            throw new NotFoundException('Audio not found');
        }

        // Check premium access (check subscription)
        const hasActiveSubscription = user
            ? await this.subscriptionsService.hasActiveSubscription(user.id)
            : false;
        const accessLevel = getContentAccessLevel(user || null, audio.isPremium, hasActiveSubscription);
        if (accessLevel === 'preview' && audio.isPremium) {
            // Return preview version (metadata but limited URL access)
            const audioPreview = {
                ...audio,
                url: audio.thumbnail || audio.url, // Show thumbnail instead of full URL
            };
            return ZAudioDetail.parse(audioPreview);
        }

        return ZAudioDetail.parse(audio);
    }

    async updateAudio(
        query: TAudioQueryUnique,
        data: TUpdateAudio,
    ): Promise<TAudioBasic> {
        const updatedAudio = await this.db.audio.update({
            where: { id: query.id },
            data: data as any,
        });

        if (!updatedAudio) {
            throw new NotFoundException('Audio not found');
        }

        return ZAudioBasic.parse(updatedAudio);
    }

    async deleteAudio(query: TAudioQueryUnique): Promise<{ message: string }> {
        const deletedAudio = await this.db.audio.delete({
            where: { id: query.id },
        });

        if (!deletedAudio) {
            throw new NotFoundException('Audio not found');
        }

        return { message: 'Audio deleted successfully' };
    }

    // ==================== PHOTO CRUD ====================

    async createPhoto(data: TCreatePhoto, uploadedBy: string): Promise<TPhotoBasic> {
        const photo = await this.db.photo.create({
            data: {
                ...data,
                uploadedBy,
            } as any,
        });

        return ZPhotoBasic.parse(photo);
    }

    async getManyPhotos(query: TPhotoQueryFilter & { user?: TAuthUser | null }): Promise<TPhotoListResponse> {
        const where: any = {};

        if (query.category) {
            where.category = { contains: query.category, mode: 'insensitive' };
        }

        if (query.source) {
            where.source = query.source;
        }

        if (query.status) {
            where.status = query.status;
        }

        if (typeof query.featured === 'boolean') {
            where.featured = query.featured;
        }

        if (query.uploadedBy) {
            where.uploadedBy = query.uploadedBy;
        }

        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { caption: { contains: query.search, mode: 'insensitive' } },
                { alt: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        let orderBy: any = { createdAt: query.sortOrder || 'desc' };
        switch (query.sortBy) {
            case 'title':
                orderBy = { title: query.sortOrder || 'desc' };
                break;
            case 'publishedAt':
                orderBy = { publishedAt: query.sortOrder || 'desc' };
                break;
            case 'viewCount':
                orderBy = { viewCount: query.sortOrder || 'desc' };
                break;
            case 'likeCount':
                orderBy = { likeCount: query.sortOrder || 'desc' };
                break;
            case 'downloadCount':
                orderBy = { downloadCount: query.sortOrder || 'desc' };
                break;
            case 'createdAt':
            default:
                orderBy = { createdAt: query.sortOrder || 'desc' };
                break;
        }

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const total = await this.db.photo.count({ where });

        const photos = await this.db.photo.findMany({
            where,
            orderBy,
            skip,
            take: limit,
        });

        // Apply premium access control - hide full content for non-premium users
        const hasActiveSubscription = query.user
            ? await this.subscriptionsService.hasActiveSubscription(query.user.id)
            : false;
        const photosWithAccessControl = photos.map(item => {
            const accessLevel = getContentAccessLevel(query.user || null, item.isPremium, hasActiveSubscription);
            if (accessLevel === 'preview' && item.isPremium) {
                // For preview, hide the actual URL but keep metadata
                return {
                    ...item,
                    url: item.thumbnail || item.url, // Show thumbnail instead of full URL
                };
            }
            return item;
        });

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return ZPhotoListResponse.parse({
            data: photosWithAccessControl,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext,
                hasPrev,
            },
        });
    }

    async getOnePhoto(query: TPhotoQueryUnique, user?: TAuthUser | null): Promise<TPhotoDetail> {
        const photo = await this.db.photo.findUnique({
            where: { id: query.id },
            include: {
                uploader: {
                    select: {
                        id: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        if (!photo) {
            throw new NotFoundException('Photo not found');
        }

        // Check premium access (check subscription)
        const hasActiveSubscription = user
            ? await this.subscriptionsService.hasActiveSubscription(user.id)
            : false;
        const accessLevel = getContentAccessLevel(user || null, photo.isPremium, hasActiveSubscription);
        if (accessLevel === 'preview' && photo.isPremium) {
            // Return preview version (metadata but limited URL access)
            const photoPreview = {
                ...photo,
                url: photo.thumbnail || photo.url, // Show thumbnail instead of full URL
            };
            return ZPhotoDetail.parse(photoPreview);
        }

        return ZPhotoDetail.parse(photo);
    }

    async updatePhoto(
        query: TPhotoQueryUnique,
        data: TUpdatePhoto,
    ): Promise<TPhotoBasic> {
        const updatedPhoto = await this.db.photo.update({
            where: { id: query.id },
            data: data as any,
        });

        if (!updatedPhoto) {
            throw new NotFoundException('Photo not found');
        }

        return ZPhotoBasic.parse(updatedPhoto);
    }

    async deletePhoto(query: TPhotoQueryUnique): Promise<{ message: string }> {
        const deletedPhoto = await this.db.photo.delete({
            where: { id: query.id },
        });

        if (!deletedPhoto) {
            throw new NotFoundException('Photo not found');
        }

        return { message: 'Photo deleted successfully' };
    }

    // ==================== GALLERY CRUD ====================

    async createGallery(data: TCreateGallery, createdBy: string): Promise<TGalleryBasic> {
        const gallery = await this.db.gallery.create({
            data: {
                ...data,
                createdBy,
            } as any,
        });

        return ZGalleryBasic.parse(gallery);
    }

    async getManyGalleries(query: TGalleryQueryFilter & { user?: TAuthUser | null }): Promise<TGalleryListResponse> {
        const where: any = {};

        if (query.category) {
            where.category = { contains: query.category, mode: 'insensitive' };
        }

        if (query.status) {
            where.status = query.status;
        }

        if (typeof query.featured === 'boolean') {
            where.featured = query.featured;
        }

        if (query.createdBy) {
            where.createdBy = query.createdBy;
        }

        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
                { slug: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        let orderBy: any = { createdAt: query.sortOrder || 'desc' };
        switch (query.sortBy) {
            case 'title':
                orderBy = { title: query.sortOrder || 'desc' };
                break;
            case 'publishedAt':
                orderBy = { publishedAt: query.sortOrder || 'desc' };
                break;
            case 'updatedAt':
                orderBy = { updatedAt: query.sortOrder || 'desc' };
                break;
            case 'createdAt':
            default:
                orderBy = { createdAt: query.sortOrder || 'desc' };
                break;
        }

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const total = await this.db.gallery.count({ where });

        const galleries = await this.db.gallery.findMany({
            where,
            orderBy,
            skip,
            take: limit,
        });

        // Apply premium access control - galleries with premium photos will show limited preview
        // Note: Gallery access is based on gallery.isPremium, individual photos within may also be premium
        const hasActiveSubscription = query.user
            ? await this.subscriptionsService.hasActiveSubscription(query.user.id)
            : false;
        const galleriesWithAccessControl = galleries.map(item => {
            const accessLevel = getContentAccessLevel(query.user || null, item.isPremium, hasActiveSubscription);
            // For galleries, we keep the full gallery data but may filter photos in the detail view
            return item;
        });

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return ZGalleryListResponse.parse({
            data: galleriesWithAccessControl,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext,
                hasPrev,
            },
        });
    }

    async getOneGallery(query: TGalleryQueryUnique, user?: TAuthUser | null): Promise<TGalleryDetail> {
        const gallery = await this.db.gallery.findUnique({
            where: query.id ? { id: query.id } : { slug: query.slug },
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        email: true,
                        image: true,
                    },
                },
                galleryPhotos: {
                    include: {
                        photo: true,
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });

        if (!gallery) {
            throw new NotFoundException('Gallery not found');
        }

        // Check premium access for gallery (check subscription)
        const hasActiveSubscription = user
            ? await this.subscriptionsService.hasActiveSubscription(user.id)
            : false;
        const galleryAccessLevel = getContentAccessLevel(user || null, gallery.isPremium, hasActiveSubscription);

        // Transform galleryPhotos to match schema and apply premium access control
        const transformedGallery = {
            ...gallery,
            photos: gallery.galleryPhotos
                .map((gp) => {
                    if (!gp.photo) return null;

                    // Check premium access for individual photos
                    const photoAccessLevel = getContentAccessLevel(user || null, gp.photo.isPremium, hasActiveSubscription);

                    // If user doesn't have full access to premium photo, show preview
                    if (photoAccessLevel === 'preview' && gp.photo.isPremium) {
                        return {
                            id: gp.id,
                            photoId: gp.photoId,
                            order: gp.order,
                            photo: {
                                ...ZPhotoBasic.parse(gp.photo),
                                url: gp.photo.thumbnail || gp.photo.url, // Show thumbnail instead
                            },
                        };
                    }

                    return {
                        id: gp.id,
                        photoId: gp.photoId,
                        order: gp.order,
                        photo: gp.photo ? ZPhotoBasic.parse(gp.photo) : undefined,
                    };
                })
                .filter(Boolean),
        };

        // If gallery itself is premium and user doesn't have access, return preview
        if (galleryAccessLevel === 'preview' && gallery.isPremium) {
            // Return gallery with limited data
            return ZGalleryDetail.parse({
                ...transformedGallery,
                description: null, // Hide full description for preview
            });
        }

        return ZGalleryDetail.parse(transformedGallery);
    }

    async updateGallery(
        query: TGalleryQueryUnique,
        data: TUpdateGallery,
    ): Promise<TGalleryBasic> {
        const where = query.id ? { id: query.id } : { slug: query.slug };
        const updatedGallery = await this.db.gallery.update({
            where,
            data: data as any,
        });

        if (!updatedGallery) {
            throw new NotFoundException('Gallery not found');
        }

        return ZGalleryBasic.parse(updatedGallery);
    }

    async deleteGallery(query: TGalleryQueryUnique): Promise<{ message: string }> {
        const where = query.id ? { id: query.id } : { slug: query.slug };
        const deletedGallery = await this.db.gallery.delete({
            where,
        });

        if (!deletedGallery) {
            throw new NotFoundException('Gallery not found');
        }

        return { message: 'Gallery deleted successfully' };
    }
}


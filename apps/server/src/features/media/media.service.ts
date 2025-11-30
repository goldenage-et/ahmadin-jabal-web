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

@Injectable()
export class MediaService {
    constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) { }

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

    async getManyMedia(query: TMediaQueryFilter): Promise<TMediaListResponse> {
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

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return ZMediaListResponse.parse({
            data: media,
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

    async getOneMedia(query: TMediaQueryUnique): Promise<TMediaDetail> {
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

    async getManyVideos(query: TVideoQueryFilter): Promise<TVideoListResponse> {
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

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return ZVideoListResponse.parse({
            data: videos,
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

    async getOneVideo(query: TVideoQueryUnique): Promise<TVideoDetail> {
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

    async getManyAudios(query: TAudioQueryFilter): Promise<TAudioListResponse> {
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

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return ZAudioListResponse.parse({
            data: audios,
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

    async getOneAudio(query: TAudioQueryUnique): Promise<TAudioDetail> {
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

    async getManyPhotos(query: TPhotoQueryFilter): Promise<TPhotoListResponse> {
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

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return ZPhotoListResponse.parse({
            data: photos,
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

    async getOnePhoto(query: TPhotoQueryUnique): Promise<TPhotoDetail> {
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

    async getManyGalleries(query: TGalleryQueryFilter): Promise<TGalleryListResponse> {
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

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return ZGalleryListResponse.parse({
            data: galleries,
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

    async getOneGallery(query: TGalleryQueryUnique): Promise<TGalleryDetail> {
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

        // Transform galleryPhotos to match schema
        const transformedGallery = {
            ...gallery,
            photos: gallery.galleryPhotos.map((gp) => ({
                id: gp.id,
                photoId: gp.photoId,
                order: gp.order,
                photo: gp.photo ? ZPhotoBasic.parse(gp.photo) : undefined,
            })),
        };

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


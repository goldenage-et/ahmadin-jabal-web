import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
    ConflictException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import type {
    TCreatePublication,
    TCreatePublicationComment,
    TPublicationBasic,
    TPublicationComment,
    TPublicationDetail,
    TPublicationListResponse,
    TPublicationQueryFilter,
    TPublicationQueryUnique,
    TUpdatePublication,
    TUpdatePublicationComment,
} from '@repo/common';
import {
    EPublicationStatus,
    EPublicationCommentStatus,
    ZPublicationBasic,
    ZPublicationComment,
    ZPublicationDetail,
    ZPublicationListResponse,
} from '@repo/common';
import { PrismaClient } from '@repo/prisma';

@Injectable()
export class PublicationsService {
    constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) { }

    async create(
        authorId: string,
        data: TCreatePublication,
    ): Promise<TPublicationBasic> {
        // Check if slug already exists
        const existingPublication = await this.db.publication.findUnique({
            where: { slug: data.slug },
        });

        if (existingPublication) {
            throw new ConflictException('Publication with this slug already exists');
        }

        // Extract media from data as it's handled separately or stored as JSON
        const { media, ...prismaData } = data;

        const publication = await this.db.publication.create({
            data: {
                ...prismaData,
                authorId,
                media: media as any, // Convert media array to JSON for Prisma
            } as any,
        });

        return ZPublicationBasic.parse(publication);
    }

    async getMany(
        query: TPublicationQueryFilter & { userId?: string },
    ): Promise<TPublicationListResponse> {
        const where: any = {};

        if (query.status) {
            where.status = query.status;
        } else if (!query.userId || query.userId !== query.authorId) {
            // Only show published publications to non-authors
            where.status = EPublicationStatus.published;
        }

        if (query.authorId) {
            where.authorId = query.authorId;
        }

        if (query.categoryId) {
            where.categoryId = query.categoryId;
        }

        if (typeof query.featured === 'boolean') {
            where.featured = query.featured;
        }

        if (typeof query.isPremium === 'boolean') {
            where.isPremium = query.isPremium;
        }

        if (typeof query.allowComments === 'boolean') {
            where.allowComments = query.allowComments;
        }

        if (query.tags && Array.isArray(query.tags) && query.tags.length > 0) {
            where.tags = {
                hasSome: query.tags,
            };
        }

        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
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
            case 'viewCount':
                orderBy = { viewCount: query.sortOrder || 'desc' };
                break;
            case 'likeCount':
                orderBy = { likeCount: query.sortOrder || 'desc' };
                break;
            case 'commentCount':
                orderBy = { commentCount: query.sortOrder || 'desc' };
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

        const total = await this.db.publication.count({ where });

        const publications = await this.db.publication.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        email: true,
                        image: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return ZPublicationListResponse.parse({
            data: ZPublicationBasic.array().parse(publications),
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

    async getOne(
        query: TPublicationQueryUnique,
        userId?: string,
    ): Promise<TPublicationDetail> {
        const where: any = {};

        if (query.id) {
            where.id = query.id;
        } else if (query.slug) {
            where.slug = query.slug;
        }

        const publication = await this.db.publication.findUnique({
            where,
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        email: true,
                        image: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });

        if (!publication) {
            throw new NotFoundException('Publication not found');
        }

        // Check if user has access (published or is author)
        if (
            publication.status !== EPublicationStatus.published &&
            publication.authorId !== userId
        ) {
            throw new ForbiddenException(
                'You do not have access to this publication',
            );
        }

        // Increment view count
        await this.db.publication.update({
            where: { id: publication.id },
            data: { viewCount: publication.viewCount + 1 },
        });

        return ZPublicationDetail.parse({
            ...publication,
            viewCount: publication.viewCount + 1,
        });
    }

    async update(
        query: TPublicationQueryUnique,
        userId: string,
        data: TUpdatePublication,
    ): Promise<TPublicationBasic> {
        const where: any = {};

        if (query.id) {
            where.id = query.id;
        } else if (query.slug) {
            where.slug = query.slug;
        }

        const existingPublication = await this.db.publication.findUnique({
            where,
        });

        if (!existingPublication) {
            throw new NotFoundException('Publication not found');
        }

        // Check if user is the author
        if (existingPublication.authorId !== userId) {
            throw new ForbiddenException('You can only update your own publications');
        }

        // Check if slug is being updated and if it conflicts
        if (data.slug && data.slug !== existingPublication.slug) {
            const slugExists = await this.db.publication.findUnique({
                where: { slug: data.slug },
            });

            if (slugExists) {
                throw new ConflictException(
                    'Publication with this slug already exists',
                );
            }
        }

        // Extract media from data if present
        const { media, ...prismaData } = data;

        const updateData: any = { ...prismaData };
        if (media !== undefined) {
            updateData.media = media as any;
        }

        const updatedPublication = await this.db.publication.update({
            where,
            data: updateData,
        });

        return ZPublicationBasic.parse(updatedPublication);
    }

    async delete(
        query: TPublicationQueryUnique,
        userId: string,
    ): Promise<{ message: string }> {
        const where: any = {};

        if (query.id) {
            where.id = query.id;
        } else if (query.slug) {
            where.slug = query.slug;
        }

        const existingPublication = await this.db.publication.findUnique({
            where,
        });

        if (!existingPublication) {
            throw new NotFoundException('Publication not found');
        }

        // Check if user is the author
        if (existingPublication.authorId !== userId) {
            throw new ForbiddenException('You can only delete your own publications');
        }

        await this.db.publication.delete({
            where,
        });

        return { message: 'Publication deleted successfully' };
    }

    async incrementLikeCount(
        publicationId: string,
    ): Promise<{ likeCount: number }> {
        const publication = await this.db.publication.findUnique({
            where: { id: publicationId },
        });

        if (!publication) {
            throw new NotFoundException('Publication not found');
        }

        const updated = await this.db.publication.update({
            where: { id: publicationId },
            data: { likeCount: publication.likeCount + 1 },
        });

        return { likeCount: updated.likeCount };
    }

    async incrementDownloadCount(
        publicationId: string,
    ): Promise<{ downloadCount: number }> {
        const publication = await this.db.publication.findUnique({
            where: { id: publicationId },
        });

        if (!publication) {
            throw new NotFoundException('Publication not found');
        }

        const updated = await this.db.publication.update({
            where: { id: publicationId },
            data: { downloadCount: publication.downloadCount + 1 },
        });

        return { downloadCount: updated.downloadCount };
    }

    // Comment methods
    async createComment(
        publicationId: string,
        userId: string,
        data: TCreatePublicationComment,
    ): Promise<TPublicationComment> {
        const publication = await this.db.publication.findUnique({
            where: { id: publicationId },
        });

        if (!publication) {
            throw new NotFoundException('Publication not found');
        }

        if (!publication.allowComments) {
            throw new ForbiddenException(
                'Comments are not allowed on this publication',
            );
        }

        const comment = await this.db.publicationComment.create({
            data: {
                publicationId,
                userId,
                parentId: data.parentId,
                content: data.content,
            },
            include: {
                user: {
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

        // Increment comment count
        await this.db.publication.update({
            where: { id: publicationId },
            data: { commentCount: publication.commentCount + 1 },
        });

        return ZPublicationComment.parse(comment);
    }

    async getComments(
        publicationId: string,
    ): Promise<TPublicationComment[]> {
        const comments = await this.db.publicationComment.findMany({
            where: {
                publicationId,
                status: EPublicationCommentStatus.approved,
                parentId: null, // Only get top-level comments
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        email: true,
                        image: true,
                    },
                },
                replies: {
                    include: {
                        user: {
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
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return ZPublicationComment.array().parse(comments);
    }

    async updateComment(
        commentId: string,
        userId: string,
        data: TUpdatePublicationComment,
    ): Promise<TPublicationComment> {
        const existingComment = await this.db.publicationComment.findUnique({
            where: { id: commentId },
        });

        if (!existingComment) {
            throw new NotFoundException('Comment not found');
        }

        if (existingComment.userId !== userId) {
            throw new ForbiddenException('You can only update your own comments');
        }

        const updated = await this.db.publicationComment.update({
            where: { id: commentId },
            data,
        });

        return ZPublicationComment.parse(updated);
    }

    async deleteComment(
        commentId: string,
        userId: string,
    ): Promise<{ message: string }> {
        const existingComment = await this.db.publicationComment.findUnique({
            where: { id: commentId },
        });

        if (!existingComment) {
            throw new NotFoundException('Comment not found');
        }

        if (existingComment.userId !== userId) {
            throw new ForbiddenException('You can only delete your own comments');
        }

        await this.db.publicationComment.delete({
            where: { id: commentId },
        });

        // Decrement comment count
        const publication = await this.db.publication.findUnique({
            where: { id: existingComment.publicationId },
        });

        if (publication) {
            await this.db.publication.update({
                where: { id: existingComment.publicationId },
                data: { commentCount: Math.max(0, publication.commentCount - 1) },
            });
        }

        return { message: 'Comment deleted successfully' };
    }
}


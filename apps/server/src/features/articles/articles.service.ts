import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
    ConflictException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import type {
    TArticleBasic,
    TArticleDetail,
    TArticleQueryFilter,
    TArticleQueryUnique,
    TCreateArticle,
    TUpdateArticle,
} from '@repo/common';
import {
    EArticleStatus,
    ZArticleBasic,
    ZArticleDetail,
} from '@repo/common';
import { PrismaClient } from '@repo/prisma';

@Injectable()
export class ArticlesService {
    constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) { }

    async create(authorId: string, data: TCreateArticle): Promise<TArticleBasic> {
        // Check if slug already exists
        const existingArticle = await this.db.article.findUnique({
            where: { slug: data.slug },
        });

        if (existingArticle) {
            throw new ConflictException('Article with this slug already exists');
        }

        const article = await this.db.article.create({
            data: {
                ...data,
                authorId,
                title: data.title || {},
                content: data.content || {},
                medias: data.images || [],
            },
        });

        return ZArticleBasic.parse(article);
    }

    async getMany(
        query: TArticleQueryFilter & { userId?: string },
    ): Promise<{ data: TArticleBasic[]; meta: any }> {
        const where: any = {};

        if (query.status) {
            where.status = query.status;
        } else if (!query.userId || query.userId !== query.authorId) {
            // Only show published articles to non-authors
            where.status = EArticleStatus.published;
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

        if (typeof query.isFree === 'boolean') {
            where.isFree = query.isFree;
        }

        if (query.tags && Array.isArray(query.tags) && query.tags.length > 0) {
            where.tags = {
                hasSome: query.tags,
            };
        }

        if (query.search) {
            where.OR = [
                { slug: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        let orderBy: any = { createdAt: query.sortOrder || 'desc' };
        switch (query.sortBy) {
            case 'title':
                orderBy = { slug: query.sortOrder || 'desc' };
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
            case 'createdAt':
            default:
                orderBy = { createdAt: query.sortOrder || 'desc' };
                break;
        }

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const total = await this.db.article.count({ where });

        const articles = await this.db.article.findMany({
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

        return {
            data: ZArticleBasic.array().parse(articles),
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext,
                hasPrev,
            },
        };
    }

    async getOne(
        query: TArticleQueryUnique,
        userId?: string,
    ): Promise<TArticleDetail> {
        const where: any = {};

        if (query.id) {
            where.id = query.id;
        } else if (query.slug) {
            where.slug = query.slug;
        }

        const article = await this.db.article.findUnique({
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

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        // Check if user has access (published or is author)
        if (
            article.status !== EArticleStatus.published &&
            article.authorId !== userId
        ) {
            throw new ForbiddenException('You do not have access to this article');
        }

        // Increment view count
        await this.db.article.update({
            where: { id: article.id },
            data: { viewCount: article.viewCount + 1 },
        });

        return ZArticleDetail.parse({
            ...article,
            viewCount: article.viewCount + 1,
        });
    }

    async update(
        query: TArticleQueryUnique,
        userId: string,
        data: TUpdateArticle,
    ): Promise<TArticleBasic> {
        const where: any = {};

        if (query.id) {
            where.id = query.id;
        } else if (query.slug) {
            where.slug = query.slug;
        }

        const existingArticle = await this.db.article.findUnique({
            where,
        });

        if (!existingArticle) {
            throw new NotFoundException('Article not found');
        }

        // Check if user is the author
        if (existingArticle.authorId !== userId) {
            throw new ForbiddenException('You can only update your own articles');
        }

        // Check if slug is being updated and if it conflicts
        if (data.slug && data.slug !== existingArticle.slug) {
            const slugExists = await this.db.article.findUnique({
                where: { slug: data.slug },
            });

            if (slugExists) {
                throw new ConflictException('Article with this slug already exists');
            }
        }

        const updateData: any = { ...data };
        if (data.images) {
            updateData.medias = data.images;
        }

        const updatedArticle = await this.db.article.update({
            where,
            data: updateData,
        });

        return ZArticleBasic.parse(updatedArticle);
    }

    async delete(
        query: TArticleQueryUnique,
        userId: string,
    ): Promise<{ message: string }> {
        const where: any = {};

        if (query.id) {
            where.id = query.id;
        } else if (query.slug) {
            where.slug = query.slug;
        }

        const existingArticle = await this.db.article.findUnique({
            where,
        });

        if (!existingArticle) {
            throw new NotFoundException('Article not found');
        }

        // Check if user is the author
        if (existingArticle.authorId !== userId) {
            throw new ForbiddenException('You can only delete your own articles');
        }

        await this.db.article.delete({
            where,
        });

        return { message: 'Article deleted successfully' };
    }

    async incrementLikeCount(articleId: string): Promise<{ likeCount: number }> {
        const article = await this.db.article.findUnique({
            where: { id: articleId },
        });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        const updated = await this.db.article.update({
            where: { id: articleId },
            data: { likeCount: article.likeCount + 1 },
        });

        return { likeCount: updated.likeCount };
    }
}


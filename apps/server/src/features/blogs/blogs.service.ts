import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
    ConflictException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import type {
    TBlogBasic,
    TBlogDetail,
    TBlogImage,
    TBlogQueryFilter,
    TBlogQueryUnique,
    TCreateBlog,
    TUpdateBlog,
} from '@repo/common';
import {
    EBlogStatus,
    ZBlogBasic,
    ZBlogDetail,
} from '@repo/common';
import { PrismaClient } from '@repo/prisma';

@Injectable()
export class BlogsService {
    constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) { }

    async create(authorId: string, data: TCreateBlog): Promise<TBlogBasic> {
        // Check if slug already exists
        const existingBlog = await this.db.blog.findUnique({
            where: { slug: data.slug },
        });

        if (existingBlog) {
            throw new ConflictException('Blog with this slug already exists');
        }

        // Convert medias array of objects to array of URLs for Prisma
        const mediasUrls: string[] = data.medias?.map((media: TBlogImage) => media.url) || [];

        const blog = await this.db.blog.create({
            data: {
                authorId,
                categoryId: data.categoryId,
                title: data.title,
                titleAm: data.titleAm,
                titleOr: data.titleOr,
                slug: data.slug,
                excerpt: data.excerpt,
                excerptAm: data.excerptAm,
                excerptOr: data.excerptOr,
                content: data.content || {},
                contentAm: data.contentAm,
                contentOr: data.contentOr,
                medias: mediasUrls,
                featuredImage: data.featuredImage,
                tags: data.tags || [],
                status: data.status || EBlogStatus.draft,
                featured: data.featured || false,
                isFree: data.isFree || true,
                price: data.price,
                publishedAt: data.publishedAt,
                expiresAt: data.expiresAt,
            },
        });

        // Convert medias array of URLs back to array of objects for schema validation
        const blogWithMedias = {
            ...blog,
            medias: blog.medias.map((url, index) => ({
                id: data.medias?.[index]?.id || '',
                url,
                alt: data.medias?.[index]?.alt,
            })),
        };

        return ZBlogBasic.parse(blogWithMedias);
    }

    async getMany(
        query: TBlogQueryFilter & { userId?: string },
    ): Promise<{ data: TBlogBasic[]; meta: any }> {
        const where: any = {};

        if (query.status) {
            where.status = query.status;
        } else if (!query.userId || query.userId !== query.authorId) {
            // Only show published blogs to non-authors
            where.status = EBlogStatus.published;
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

        const total = await this.db.blog.count({ where });

        const blogs = await this.db.blog.findMany({
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

        // Convert medias array of URLs to array of objects for schema validation
        const blogsWithMedias = blogs.map(blog => ({
            ...blog,
            medias: blog.medias.map(url => ({
                id: '',
                url,
                alt: undefined,
            })),
        }));

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return {
            data: ZBlogBasic.array().parse(blogsWithMedias),
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
        query: TBlogQueryUnique,
        userId?: string,
    ): Promise<TBlogDetail> {
        const where: any = {};

        if (query.id) {
            where.id = query.id;
        } else if (query.slug) {
            where.slug = query.slug;
        }

        const blog = await this.db.blog.findUnique({
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

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        // Check if user has access (published or is author)
        if (
            blog.status !== EBlogStatus.published &&
            blog.authorId !== userId
        ) {
            throw new ForbiddenException('You do not have access to this blog');
        }

        // Increment view count
        await this.db.blog.update({
            where: { id: blog.id },
            data: { viewCount: blog.viewCount + 1 },
        });

        // Convert medias array of URLs to array of objects for schema validation
        const blogWithMedias = {
            ...blog,
            viewCount: blog.viewCount + 1,
            medias: blog.medias.map(url => ({
                id: '',
                url,
                alt: undefined,
            })),
        };

        return ZBlogDetail.parse(blogWithMedias);
    }

    async update(
        query: TBlogQueryUnique,
        userId: string,
        data: TUpdateBlog,
    ): Promise<TBlogBasic> {
        const where: any = {};

        if (query.id) {
            where.id = query.id;
        } else if (query.slug) {
            where.slug = query.slug;
        }

        const existingBlog = await this.db.blog.findUnique({
            where,
        });

        if (!existingBlog) {
            throw new NotFoundException('Blog not found');
        }

        // Check if user is the author
        if (existingBlog.authorId !== userId) {
            throw new ForbiddenException('You can only update your own blogs');
        }

        // Check if slug is being updated and if it conflicts
        if (data.slug && data.slug !== existingBlog.slug) {
            const slugExists = await this.db.blog.findUnique({
                where: { slug: data.slug },
            });

            if (slugExists) {
                throw new ConflictException('Blog with this slug already exists');
            }
        }

        // Prepare update data
        const updateData: any = {};

        if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
        if (data.title !== undefined) updateData.title = data.title;
        if (data.titleAm !== undefined) updateData.titleAm = data.titleAm;
        if (data.titleOr !== undefined) updateData.titleOr = data.titleOr;
        if (data.slug !== undefined) updateData.slug = data.slug;
        if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
        if (data.excerptAm !== undefined) updateData.excerptAm = data.excerptAm;
        if (data.excerptOr !== undefined) updateData.excerptOr = data.excerptOr;
        if (data.content !== undefined) updateData.content = data.content;
        if (data.contentAm !== undefined) updateData.contentAm = data.contentAm;
        if (data.contentOr !== undefined) updateData.contentOr = data.contentOr;
        if (data.featuredImage !== undefined) updateData.featuredImage = data.featuredImage;
        if (data.tags !== undefined) updateData.tags = data.tags;
        if (data.status !== undefined) updateData.status = data.status;
        if (data.featured !== undefined) updateData.featured = data.featured;
        if (data.isFree !== undefined) updateData.isFree = data.isFree;
        if (data.price !== undefined) updateData.price = data.price;
        if (data.publishedAt !== undefined) updateData.publishedAt = data.publishedAt;
        if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt;

        // Handle medias conversion (from array of objects to array of URLs)
        if (data.images !== undefined) {
            updateData.medias = data.images.map((media: TBlogImage) => media.url);
        }

        const updatedBlog = await this.db.blog.update({
            where,
            data: updateData,
        });

        // Convert medias array of URLs back to array of objects for schema validation
        const blogWithMedias = {
            ...updatedBlog,
            medias: updatedBlog.medias.map((url, index) => ({
                id: data.images?.[index]?.id || '',
                url,
                alt: data.images?.[index]?.alt,
            })),
        };

        return ZBlogBasic.parse(blogWithMedias);
    }

    async delete(
        query: TBlogQueryUnique,
        userId: string,
    ): Promise<{ message: string }> {
        const where: any = {};

        if (query.id) {
            where.id = query.id;
        } else if (query.slug) {
            where.slug = query.slug;
        }

        const existingBlog = await this.db.blog.findUnique({
            where,
        });

        if (!existingBlog) {
            throw new NotFoundException('Blog not found');
        }

        // Check if user is the author
        if (existingBlog.authorId !== userId) {
            throw new ForbiddenException('You can only delete your own blogs');
        }

        await this.db.blog.delete({
            where,
        });

        return { message: 'Blog deleted successfully' };
    }

    async incrementLikeCount(blogId: string): Promise<{ likeCount: number }> {
        const blog = await this.db.blog.findUnique({
            where: { id: blogId },
        });

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        const updated = await this.db.blog.update({
            where: { id: blogId },
            data: { likeCount: blog.likeCount + 1 },
        });

        return { likeCount: updated.likeCount };
    }
}


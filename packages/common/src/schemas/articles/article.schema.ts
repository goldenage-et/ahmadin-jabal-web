import { z } from 'zod';
import { EArticleStatus } from '../enums';

// Article Image Schema
const ZArticleImage = z.object({
    id: z.string(),
    url: z.string(),
    alt: z.string().optional(),
});

export type TArticleImage = z.infer<typeof ZArticleImage>;

// Base Article Schema
export const ZArticle = z.object({
    id: z.uuid(),
    authorId: z.string(),
    categoryId: z.string().nullable().optional(),
    title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
    titleAm: z.string().max(255, 'Amharic title must be 255 characters or less').nullable().optional(),
    titleOr: z.string().max(255, 'Oromo title must be 255 characters or less').nullable().optional(),
    slug: z.string().min(1, 'Slug is required').max(255, 'Slug must be 255 characters or less'),
    excerpt: z.string().max(500, 'Excerpt must be 500 characters or less').nullable().optional(),
    excerptAm: z.string().max(500, 'Amharic excerpt must be 500 characters or less').nullable().optional(),
    excerptOr: z.string().max(500, 'Oromo excerpt must be 500 characters or less').nullable().optional(),
    content: z.json().default({}).nullable().optional(),
    contentAm: z.json().default({}).nullable().optional(),
    contentOr: z.json().default({}).nullable().optional(),
    medias: z.array(ZArticleImage).default([]).nullable().optional(),
    featuredImage: z.string().nullable().optional(),
    tags: z.array(z.string()),
    status: z.enum(EArticleStatus).default(EArticleStatus.draft),
    featured: z.boolean().default(false),
    isFree: z.boolean().default(true),
    price: z.number().positive().nullable().optional(),
    viewCount: z.number().int().default(0),
    likeCount: z.number().int().default(0),
    publishedAt: z.coerce.date().nullable().optional(),
    expiresAt: z.coerce.date().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type TArticle = z.infer<typeof ZArticle>;

// Basic Article Schema (for lists)
export const ZArticleBasic = ZArticle.pick({
    id: true,
    title: true,
    titleAm: true,
    titleOr: true,
    slug: true,
    excerpt: true,
    excerptAm: true,
    excerptOr: true,
    medias: true,
    featuredImage: true,
    tags: true,
    status: true,
    featured: true,
    isFree: true,
    price: true,
    viewCount: true,
    likeCount: true,
    publishedAt: true,
    createdAt: true,
    updatedAt: true,
    authorId: true,
    categoryId: true,
});

export type TArticleBasic = z.infer<typeof ZArticleBasic>;

// Create Article Schema
export const ZCreateArticle = z.object({
    categoryId: z.string().uuid().optional(),
    title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
    titleAm: z.string().max(255, 'Amharic title must be 255 characters or less').optional(),
    titleOr: z.string().max(255, 'Oromo title must be 255 characters or less').optional(),
    slug: z.string().min(1, 'Slug is required').max(255, 'Slug must be 255 characters or less'),
    excerpt: z.string().max(500, 'Excerpt must be 500 characters or less').optional(),
    excerptAm: z.string().max(500, 'Amharic excerpt must be 500 characters or less').optional(),
    excerptOr: z.string().max(500, 'Oromo excerpt must be 500 characters or less').optional(),
    content: z.json().default({}).optional(),
    contentAm: z.json().default({}).optional(),
    contentOr: z.json().default({}).optional(),
    medias: z.array(ZArticleImage).default([]).optional(),
    featuredImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    status: z.enum(EArticleStatus).default(EArticleStatus.draft),
    featured: z.boolean().default(false),
    isFree: z.boolean().default(true),
    price: z.number().positive().optional(),
    publishedAt: z.coerce.date().optional(),
    expiresAt: z.coerce.date().optional(),
});

export type TCreateArticle = z.infer<typeof ZCreateArticle>;

// Update Article Schema
export const ZUpdateArticle = z.object({
    categoryId: z.string().uuid().optional(),
    title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less').optional(),
    titleAm: z.string().max(255, 'Amharic title must be 255 characters or less').optional(),
    titleOr: z.string().max(255, 'Oromo title must be 255 characters or less').optional(),
    slug: z.string().min(1, 'Slug is required').max(255, 'Slug must be 255 characters or less').optional(),
    excerpt: z.string().max(500, 'Excerpt must be 500 characters or less').optional(),
    excerptAm: z.string().max(500, 'Amharic excerpt must be 500 characters or less').optional(),
    excerptOr: z.string().max(500, 'Oromo excerpt must be 500 characters or less').optional(),
    content: z.json().default({}).optional(),
    contentAm: z.json().default({}).optional(),
    contentOr: z.json().default({}).optional(),
    images: z.array(ZArticleImage).optional(),
    featuredImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(EArticleStatus).optional(),
    featured: z.boolean().optional(),
    isFree: z.boolean().optional(),
    price: z.number().positive().optional(),
    publishedAt: z.coerce.date().optional(),
    expiresAt: z.coerce.date().optional(),
});

export type TUpdateArticle = z.infer<typeof ZUpdateArticle>;

// Article Query Filter Schema
export const ZArticleQueryFilter = z.object({
    search: z.string().optional(),
    categoryId: z.string().optional(),
    authorId: z.string().optional(),
    status: z.enum(EArticleStatus).optional(),
    featured: z.boolean().optional(),
    isFree: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z.enum(['createdAt', 'publishedAt', 'viewCount', 'likeCount', 'title']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type TArticleQueryFilter = z.infer<typeof ZArticleQueryFilter>;

// Article Query Unique Schema
export const ZArticleQueryUnique = z.object({
    id: z.uuid().optional(),
    slug: z.string().optional(),
}).refine((data) => data.id || data.slug, {
    message: 'Either id or slug must be provided',
});

export type TArticleQueryUnique = z.infer<typeof ZArticleQueryUnique>;

// Article Detail Schema (with relations)
export const ZArticleDetail = ZArticle.extend({
    author: z.object({
        id: z.string(),
        firstName: z.string(),
        middleName: z.string(),
        lastName: z.string().nullable().optional(),
        email: z.string(),
        image: z.string().nullable().optional(),
    }).optional(),
    category: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string().nullable().optional(),
    }).nullable().optional(),
});

export type TArticleDetail = z.infer<typeof ZArticleDetail>;

// Article Related Schema
export const ZArticleRelated = z.object({
    id: z.string(),
    fromId: z.string(),
    toId: z.string(),
    createdAt: z.coerce.date(),
});

export type TArticleRelated = z.infer<typeof ZArticleRelated>;

export const ZArticleAmharic = z.object({
    id: z.string(),
    titleAm: z.string(),
    excerptAm: z.string(),
    contentAm: z.json().default({}).nullable().optional(),
});

export type TArticleAmharic = z.infer<typeof ZArticleAmharic>;

export const ZArticleOromo = z.object({
    id: z.string(),
    titleOr: z.string(),
    excerptOr: z.string(),
    contentOr: z.json().default({}).nullable().optional(),
});

export type TArticleOromo = z.infer<typeof ZArticleOromo>;
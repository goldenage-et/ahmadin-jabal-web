import { z } from 'zod';
import { EPublicationStatus, EPublicationCommentStatus } from '../enums';

// Constants for validation
const PUBLICATION_TITLE_MAX_LENGTH = 255;
const PUBLICATION_TAG_MAX_LENGTH = 50;
const PUBLICATION_COMMENT_MAX_LENGTH = 2000;

// Publication Media Schema
const ZPublicationMedia = z.object({
    id: z.string(),
    url: z.string(),
    alt: z.string().optional(),
    type: z.enum(['image', 'video', 'document']).optional(),
});

export type TPublicationMedia = z.infer<typeof ZPublicationMedia>;

// Base Publication Schema
export const ZPublication = z.object({
    id: z.uuid(),
    authorId: z.uuid('Invalid author ID format'),
    categoryId: z.uuid('Invalid category ID format').nullable().optional(),
    title: z
        .string()
        .min(1, 'Title is required')
        .max(PUBLICATION_TITLE_MAX_LENGTH, `Title must be ${PUBLICATION_TITLE_MAX_LENGTH} characters or less`),
    titleAm: z
        .string()
        .max(PUBLICATION_TITLE_MAX_LENGTH, `English title must be ${PUBLICATION_TITLE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    titleOr: z
        .string()
        .max(PUBLICATION_TITLE_MAX_LENGTH, `Oromo title must be ${PUBLICATION_TITLE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    slug: z
        .string()
        .min(1, 'Slug is required')
        .max(PUBLICATION_TITLE_MAX_LENGTH, `Slug must be ${PUBLICATION_TITLE_MAX_LENGTH} characters or less`),
    excerpt: z
        .string()
        .max(500, 'Excerpt must be 500 characters or less')
        .nullable()
        .optional(),
    excerptAm: z
        .string()
        .max(500, 'Amharic excerpt must be 500 characters or less')
        .nullable()
        .optional(),
    excerptOr: z
        .string()
        .max(500, 'Oromo excerpt must be 500 characters or less')
        .nullable()
        .optional(),
    content: z
        .json()
        .default({})
        .nullable()
        .optional(),
    contentAm: z
        .json()
        .default({})
        .nullable()
        .optional(),
    contentOr: z
        .json()
        .default({})
        .nullable()
        .optional(),
    media: z
        .array(ZPublicationMedia)
        .default([]),
    featuredImage: z
        .url('Invalid featured image URL format')
        .nullable()
        .optional(),
    tags: z
        .array(z.string().max(PUBLICATION_TAG_MAX_LENGTH, `Tag must be ${PUBLICATION_TAG_MAX_LENGTH} characters or less`))
        .default([]),
    isPremium: z.boolean().default(false),
    status: z.enum(Object.values(EPublicationStatus) as [string, ...string[]]).default(EPublicationStatus.draft),
    featured: z.boolean().default(false),
    allowComments: z.boolean().default(true),
    viewCount: z.number().int().min(0, 'View count cannot be negative').default(0),
    likeCount: z.number().int().min(0, 'Like count cannot be negative').default(0),
    commentCount: z.number().int().min(0, 'Comment count cannot be negative').default(0),
    downloadCount: z.number().int().min(0, 'Download count cannot be negative').default(0),
    publishedAt: z.coerce.date().nullable().optional(),
    expiresAt: z.coerce.date().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type TPublication = z.infer<typeof ZPublication>;

// Basic Publication Schema (for lists)
export const ZPublicationBasic = ZPublication.pick({
    id: true,
    authorId: true,
    categoryId: true,
    title: true,
    titleAm: true,
    titleOr: true,
    slug: true,
    excerpt: true,
    excerptAm: true,
    excerptOr: true,
    content: true,
    contentAm: true,
    contentOr: true,
    featuredImage: true,
    tags: true,
    status: true,
    featured: true,
    isPremium: true,
    allowComments: true,
    viewCount: true,
    likeCount: true,
    commentCount: true,
    downloadCount: true,
    publishedAt: true,
    createdAt: true,
    updatedAt: true,
});

export type TPublicationBasic = z.infer<typeof ZPublicationBasic>;

// Create Publication Schema
export const ZCreatePublication = z.object({
    categoryId: z.string().uuid('Invalid category ID format').optional().nullable(),
    title: z
        .string()
        .min(1, 'Title is required')
        .max(PUBLICATION_TITLE_MAX_LENGTH, `Title must be ${PUBLICATION_TITLE_MAX_LENGTH} characters or less`),
    titleAm: z
        .string()
        .max(PUBLICATION_TITLE_MAX_LENGTH, `English title must be ${PUBLICATION_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    titleOr: z
        .string()
        .max(PUBLICATION_TITLE_MAX_LENGTH, `Oromo title must be ${PUBLICATION_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    slug: z
        .string()
        .min(1, 'Slug is required')
        .max(PUBLICATION_TITLE_MAX_LENGTH, `Slug must be ${PUBLICATION_TITLE_MAX_LENGTH} characters or less`),
    excerpt: z.string().max(500, 'Excerpt must be 500 characters or less').optional().nullable(),
    excerptAm: z.string().max(500, 'Amharic excerpt must be 500 characters or less').optional().nullable(),
    excerptOr: z.string().max(500, 'Oromo excerpt must be 500 characters or less').optional().nullable(),
    content: z.json().default({}).optional().nullable(),
    contentAm: z.json().default({}).optional().nullable(),
    contentOr: z.json().default({}).optional().nullable(),
    media: z.array(ZPublicationMedia).default([]),
    featuredImage: z.string().url('Invalid featured image URL format').optional().nullable(),
    tags: z
        .array(z.string().max(PUBLICATION_TAG_MAX_LENGTH, `Tag must be ${PUBLICATION_TAG_MAX_LENGTH} characters or less`))
        .default([]),
    isPremium: z.boolean().default(false),
    status: z.enum(EPublicationStatus).default(EPublicationStatus.draft),
    featured: z.boolean().default(false),
    allowComments: z.boolean().default(true),
    publishedAt: z.coerce.date().optional().nullable(),
    expiresAt: z.coerce.date().optional().nullable(),
});

export type TCreatePublication = z.infer<typeof ZCreatePublication>;

// Update Publication Schema
export const ZUpdatePublication = z.object({
    categoryId: z.uuid('Invalid category ID format').optional().nullable(),
    title: z
        .string()
        .min(1, 'Title is required')
        .max(PUBLICATION_TITLE_MAX_LENGTH, `Title must be ${PUBLICATION_TITLE_MAX_LENGTH} characters or less`)
        .optional(),
    titleAm: z
        .string()
        .max(PUBLICATION_TITLE_MAX_LENGTH, `English title must be ${PUBLICATION_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    titleOr: z
        .string()
        .max(PUBLICATION_TITLE_MAX_LENGTH, `Oromo title must be ${PUBLICATION_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    slug: z
        .string()
        .min(1, 'Slug is required')
        .max(PUBLICATION_TITLE_MAX_LENGTH, `Slug must be ${PUBLICATION_TITLE_MAX_LENGTH} characters or less`)
        .optional(),
    excerpt: z.string().max(500, 'Excerpt must be 500 characters or less').optional().nullable(),
    excerptAm: z.string().max(500, 'Amharic excerpt must be 500 characters or less').optional().nullable(),
    excerptOr: z.string().max(500, 'Oromo excerpt must be 500 characters or less').optional().nullable(),
    content: z.json().default({}).optional().nullable(),
    contentAm: z.json().default({}).optional().nullable(),
    contentOr: z.json().default({}).optional().nullable(),
    media: z.array(ZPublicationMedia).optional(),
    featuredImage: z.url('Invalid featured image URL format').optional().nullable(),
    tags: z
        .array(z.string().max(PUBLICATION_TAG_MAX_LENGTH, `Tag must be ${PUBLICATION_TAG_MAX_LENGTH} characters or less`))
        .optional(),
    isPremium: z.boolean().optional(),
    status: z.enum(EPublicationStatus).optional(),
    featured: z.boolean().optional(),
    allowComments: z.boolean().optional(),
    publishedAt: z.coerce.date().optional().nullable(),
    expiresAt: z.coerce.date().optional().nullable(),
});

export type TUpdatePublication = z.infer<typeof ZUpdatePublication>;

// Publication Query Filter Schema
export const ZPublicationQueryFilter = z.object({
    search: z.string().optional(),
    categoryId: z.uuid('Invalid category ID format').optional(),
    authorId: z.uuid('Invalid author ID format').optional(),
    status: z.enum(EPublicationStatus).optional(),
    featured: z.boolean().optional(),
    isPremium: z.boolean().optional(),
    allowComments: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z
        .enum(['createdAt', 'publishedAt', 'viewCount', 'likeCount', 'commentCount', 'downloadCount', 'title'])
        .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type TPublicationQueryFilter = z.infer<typeof ZPublicationQueryFilter>;

// Publication Query Unique Schema
export const ZPublicationQueryUnique = z
    .object({
        id: z.uuid('Invalid publication ID format').optional(),
        slug: z.string().optional(),
    })
    .refine((data) => data.id || data.slug, {
        message: 'Either id or slug must be provided',
    });

export type TPublicationQueryUnique = z.infer<typeof ZPublicationQueryUnique>;

// Publication Detail Schema (with relations)
export const ZPublicationDetail = ZPublication.extend({
    author: z
        .object({
            id: z.string(),
            firstName: z.string(),
            middleName: z.string(),
            lastName: z.string().nullable().optional(),
            email: z.string(),
            image: z.string().nullable().optional(),
        })
        .optional(),
    category: z
        .object({
            id: z.string(),
            name: z.string(),
            slug: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
});

export type TPublicationDetail = z.infer<typeof ZPublicationDetail>;

// Publication List Response Schema (with pagination)
export const ZPublicationListResponse = z.object({
    data: z.array(ZPublicationBasic),
    meta: z.object({
        page: z.number().int().positive(),
        limit: z.number().int().positive(),
        total: z.number().int().min(0),
        totalPages: z.number().int().min(0),
        hasNext: z.boolean(),
        hasPrev: z.boolean(),
    }),
});

export type TPublicationListResponse = z.infer<typeof ZPublicationListResponse>;

// Publication Comment Schema
export const ZPublicationComment = z.object({
    id: z.uuid('Invalid comment ID format'),
    publicationId: z.uuid('Invalid publication ID format'),
    userId: z.uuid('Invalid user ID format'),
    parentId: z.uuid('Invalid parent comment ID format').nullable().optional(),
    content: z.json().default({}),
    status: z
        .enum(Object.values(EPublicationCommentStatus) as [string, ...string[]])
        .default(EPublicationCommentStatus.pending),
    likes: z.number().int().min(0, 'Likes count cannot be negative').default(0),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type TPublicationComment = z.infer<typeof ZPublicationComment>;

// Create Publication Comment Schema
export const ZCreatePublicationComment = z.object({
    parentId: z.uuid('Invalid parent comment ID format').optional().nullable(),
    content: z
        .string()
        .min(1, 'Comment content is required')
        .max(PUBLICATION_COMMENT_MAX_LENGTH, `Comment must be ${PUBLICATION_COMMENT_MAX_LENGTH} characters or less`),
});

export type TCreatePublicationComment = z.infer<typeof ZCreatePublicationComment>;

// Update Publication Comment Schema
export const ZUpdatePublicationComment = z.object({
    content: z
        .string()
        .min(1, 'Comment content is required')
        .max(PUBLICATION_COMMENT_MAX_LENGTH, `Comment must be ${PUBLICATION_COMMENT_MAX_LENGTH} characters or less`)
        .optional(),
    status: z.enum(EPublicationCommentStatus).optional(),
});

export type TUpdatePublicationComment = z.infer<typeof ZUpdatePublicationComment>;

// Publication Related Schema
export const ZPublicationRelated = z.object({
    id: z.uuid('Invalid related publication ID format'),
    fromId: z.uuid('Invalid source publication ID format'),
    toId: z.uuid('Invalid target publication ID format'),
    createdAt: z.coerce.date(),
});

export type TPublicationRelated = z.infer<typeof ZPublicationRelated>;

export const ZPublicationAmharic = z.object({
    id: z.string(),
    titleAm: z.string(),
    excerptAm: z.string(),
    contentAm: z.json().default({}).nullable().optional(),
});

export type TPublicationAmharic = z.infer<typeof ZPublicationAmharic>;

export const ZPublicationOromo = z.object({
    id: z.string(),
    titleOr: z.string(),
    excerptOr: z.string(),
    contentOr: z.json().default({}).nullable().optional(),
});

export type TPublicationOromo = z.infer<typeof ZPublicationOromo>;
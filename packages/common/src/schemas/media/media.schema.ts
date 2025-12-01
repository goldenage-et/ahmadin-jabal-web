import { z } from 'zod';
import { EMediaType, EMediaSource, EMediaStatus } from '../enums';

// Constants for validation
const MEDIA_TITLE_MAX_LENGTH = 255;
const MEDIA_CATEGORY_MAX_LENGTH = 100;
const MEDIA_URL_MAX_LENGTH = 500;
const MEDIA_EXTERNAL_ID_MAX_LENGTH = 255;
const MEDIA_MIME_TYPE_MAX_LENGTH = 100;

// Base Media Schema
export const ZMedia = z.object({
    id: z.uuid(),
    title: z
        .string()
        .min(1, 'Title is required')
        .max(MEDIA_TITLE_MAX_LENGTH, `Title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`),
    titleEn: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `English title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    description: z.string().nullable().optional(),
    type: z.enum(Object.values(EMediaType) as [string, ...string[]]),
    category: z
        .string()
        .max(MEDIA_CATEGORY_MAX_LENGTH, `Category must be ${MEDIA_CATEGORY_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    url: z
        .string()
        .min(1, 'URL is required')
        .max(MEDIA_URL_MAX_LENGTH, `URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`),
    thumbnail: z
        .url('Invalid thumbnail URL format')
        .max(MEDIA_URL_MAX_LENGTH, `Thumbnail URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    duration: z.number().int().min(0, 'Duration cannot be negative').nullable().optional(),
    fileSize: z.number().int().min(0, 'File size cannot be negative').nullable().optional(),
    mimeType: z
        .string()
        .max(MEDIA_MIME_TYPE_MAX_LENGTH, `MIME type must be ${MEDIA_MIME_TYPE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    width: z.number().int().min(0, 'Width cannot be negative').nullable().optional(),
    height: z.number().int().min(0, 'Height cannot be negative').nullable().optional(),
    source: z.enum(Object.values(EMediaSource) as [string, ...string[]]).default(EMediaSource.upload),
    externalId: z
        .string()
        .max(MEDIA_EXTERNAL_ID_MAX_LENGTH, `External ID must be ${MEDIA_EXTERNAL_ID_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    viewCount: z.number().int().min(0, 'View count cannot be negative').default(0),
    likeCount: z.number().int().min(0, 'Like count cannot be negative').default(0),
    downloadCount: z.number().int().min(0, 'Download count cannot be negative').default(0),
    featured: z.boolean().default(false),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).default(EMediaStatus.draft),
    metadata: z.any().nullable().optional(),
    uploadedBy: z.uuid('Invalid uploader ID format'),
    publishedAt: z.coerce.date().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type TMedia = z.infer<typeof ZMedia>;

// Basic Media Schema (for lists)
export const ZMediaBasic = ZMedia.pick({
    id: true,
    title: true,
    titleEn: true,
    description: true,
    type: true,
    category: true,
    url: true,
    thumbnail: true,
    duration: true,
    fileSize: true,
    mimeType: true,
    width: true,
    height: true,
    source: true,
    externalId: true,
    viewCount: true,
    likeCount: true,
    downloadCount: true,
    featured: true,
    status: true,
    uploadedBy: true,
    publishedAt: true,
    createdAt: true,
    updatedAt: true,
});

export type TMediaBasic = z.infer<typeof ZMediaBasic>;

// Create Media Schema
export const ZCreateMedia = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(MEDIA_TITLE_MAX_LENGTH, `Title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`),
    titleEn: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `English title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    description: z.string().optional().nullable(),
    type: z.enum(Object.values(EMediaType) as [string, ...string[]]),
    category: z
        .string()
        .max(MEDIA_CATEGORY_MAX_LENGTH, `Category must be ${MEDIA_CATEGORY_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    url: z
        .string()
        .min(1, 'URL is required')
        .max(MEDIA_URL_MAX_LENGTH, `URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`),
    thumbnail: z
        .string()
        .url('Invalid thumbnail URL format')
        .max(MEDIA_URL_MAX_LENGTH, `Thumbnail URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    duration: z.number().int().min(0, 'Duration cannot be negative').optional().nullable(),
    fileSize: z.number().int().min(0, 'File size cannot be negative').optional().nullable(),
    mimeType: z
        .string()
        .max(MEDIA_MIME_TYPE_MAX_LENGTH, `MIME type must be ${MEDIA_MIME_TYPE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    width: z.number().int().min(0, 'Width cannot be negative').optional().nullable(),
    height: z.number().int().min(0, 'Height cannot be negative').optional().nullable(),
    source: z.enum(Object.values(EMediaSource) as [string, ...string[]]).default(EMediaSource.upload),
    externalId: z
        .string()
        .max(MEDIA_EXTERNAL_ID_MAX_LENGTH, `External ID must be ${MEDIA_EXTERNAL_ID_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    featured: z.boolean().default(false),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).default(EMediaStatus.draft),
    metadata: z.any().optional().nullable(),
    publishedAt: z.coerce.date().optional().nullable(),
});

export type TCreateMedia = z.infer<typeof ZCreateMedia>;

// Update Media Schema
export const ZUpdateMedia = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(MEDIA_TITLE_MAX_LENGTH, `Title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional(),
    titleEn: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `English title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    description: z.string().optional().nullable(),
    type: z.enum(Object.values(EMediaType) as [string, ...string[]]).optional(),
    category: z
        .string()
        .max(MEDIA_CATEGORY_MAX_LENGTH, `Category must be ${MEDIA_CATEGORY_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    url: z
        .string()
        .min(1, 'URL is required')
        .max(MEDIA_URL_MAX_LENGTH, `URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .optional(),
    thumbnail: z
        .url('Invalid thumbnail URL format')
        .max(MEDIA_URL_MAX_LENGTH, `Thumbnail URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    duration: z.number().int().min(0, 'Duration cannot be negative').optional().nullable(),
    fileSize: z.number().int().min(0, 'File size cannot be negative').optional().nullable(),
    mimeType: z
        .string()
        .max(MEDIA_MIME_TYPE_MAX_LENGTH, `MIME type must be ${MEDIA_MIME_TYPE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    width: z.number().int().min(0, 'Width cannot be negative').optional().nullable(),
    height: z.number().int().min(0, 'Height cannot be negative').optional().nullable(),
    source: z.enum(Object.values(EMediaSource) as [string, ...string[]]).optional(),
    externalId: z
        .string()
        .max(MEDIA_EXTERNAL_ID_MAX_LENGTH, `External ID must be ${MEDIA_EXTERNAL_ID_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    featured: z.boolean().optional(),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).optional(),
    metadata: z.any().optional().nullable(),
    publishedAt: z.coerce.date().optional().nullable(),
});

export type TUpdateMedia = z.infer<typeof ZUpdateMedia>;

// Media Query Filter Schema
export const ZMediaQueryFilter = z.object({
    search: z.string().optional(),
    type: z.enum(Object.values(EMediaType) as [string, ...string[]]).optional(),
    category: z.string().optional(),
    source: z.enum(Object.values(EMediaSource) as [string, ...string[]]).optional(),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).optional(),
    featured: z.boolean().optional(),
    uploadedBy: z.uuid('Invalid uploader ID format').optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z
        .enum([
            'createdAt',
            'publishedAt',
            'viewCount',
            'likeCount',
            'downloadCount',
            'title',
            'fileSize',
        ])
        .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type TMediaQueryFilter = z.infer<typeof ZMediaQueryFilter>;

// Media List Response Schema (with pagination)
export const ZMediaListResponse = z.object({
    data: z.array(ZMediaBasic),
    meta: z.object({
        page: z.number().int().positive(),
        limit: z.number().int().positive(),
        total: z.number().int().min(0),
        totalPages: z.number().int().min(0),
        hasNext: z.boolean(),
        hasPrev: z.boolean(),
    }),
});

export type TMediaListResponse = z.infer<typeof ZMediaListResponse>;

// Media Query Unique Schema
export const ZMediaQueryUnique = z
    .object({
        id: z.uuid('Invalid media ID format').optional(),
    })
    .refine((data) => data.id, {
        message: 'Media ID must be provided',
    });

export type TMediaQueryUnique = z.infer<typeof ZMediaQueryUnique>;

// Media Detail Schema (with relations)
export const ZMediaDetail = ZMedia.extend({
    uploader: z
        .object({
            id: z.string(),
            firstName: z.string(),
            middleName: z.string(),
            lastName: z.string().nullable().optional(),
            email: z.string(),
            image: z.string().nullable().optional(),
        })
        .optional(),
});

export type TMediaDetail = z.infer<typeof ZMediaDetail>;

// Article Media Junction Schema
export const ZArticleMediaJunction = z.object({
    id: z.uuid(),
    articleId: z.uuid('Invalid article ID format'),
    mediaId: z.uuid('Invalid media ID format'),
    order: z.number().int().min(0, 'Order cannot be negative').default(0),
    createdAt: z.coerce.date(),
});

export type TArticleMediaJunction = z.infer<typeof ZArticleMediaJunction>;

// Publication Media Junction Schema
export const ZPublicationMediaJunction = z.object({
    id: z.uuid(),
    publicationId: z.uuid('Invalid publication ID format'),
    mediaId: z.uuid('Invalid media ID format'),
    order: z.number().int().min(0, 'Order cannot be negative').default(0),
    createdAt: z.coerce.date(),
});

export type TPublicationMediaJunction = z.infer<typeof ZPublicationMediaJunction>;

// ========================================
// Video Schemas
// ========================================

// Base Video Schema
export const ZVideo = z.object({
    id: z.uuid(),
    title: z
        .string()
        .min(1, 'Title is required')
        .max(MEDIA_TITLE_MAX_LENGTH, `Title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`),
    titleEn: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `English title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    description: z.string().nullable().optional(),
    category: z
        .string()
        .max(MEDIA_CATEGORY_MAX_LENGTH, `Category must be ${MEDIA_CATEGORY_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    url: z
        .string()
        .min(1, 'URL is required')
        .max(MEDIA_URL_MAX_LENGTH, `URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`),
    thumbnail: z
        .url('Invalid thumbnail URL format')
        .max(MEDIA_URL_MAX_LENGTH, `Thumbnail URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    duration: z.number().int().min(0, 'Duration cannot be negative').nullable().optional(),
    fileSize: z.number().int().min(0, 'File size cannot be negative').nullable().optional(),
    mimeType: z
        .string()
        .max(MEDIA_MIME_TYPE_MAX_LENGTH, `MIME type must be ${MEDIA_MIME_TYPE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    width: z.number().int().min(0, 'Width cannot be negative').nullable().optional(),
    height: z.number().int().min(0, 'Height cannot be negative').nullable().optional(),
    source: z.enum(Object.values(EMediaSource) as [string, ...string[]]).default(EMediaSource.upload),
    externalId: z
        .string()
        .max(MEDIA_EXTERNAL_ID_MAX_LENGTH, `External ID must be ${MEDIA_EXTERNAL_ID_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    viewCount: z.number().int().min(0, 'View count cannot be negative').default(0),
    likeCount: z.number().int().min(0, 'Like count cannot be negative').default(0),
    downloadCount: z.number().int().min(0, 'Download count cannot be negative').default(0),
    featured: z.boolean().default(false),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).default(EMediaStatus.draft),
    metadata: z.any().nullable().optional(),
    uploadedBy: z.uuid('Invalid uploader ID format'),
    mediaId: z.uuid('Invalid media ID format').nullable().optional(),
    publishedAt: z.coerce.date().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type TVideo = z.infer<typeof ZVideo>;

// Basic Video Schema (for lists)
export const ZVideoBasic = ZVideo.pick({
    id: true,
    title: true,
    titleEn: true,
    description: true,
    category: true,
    url: true,
    thumbnail: true,
    duration: true,
    fileSize: true,
    mimeType: true,
    width: true,
    height: true,
    source: true,
    externalId: true,
    viewCount: true,
    likeCount: true,
    downloadCount: true,
    featured: true,
    status: true,
    uploadedBy: true,
    publishedAt: true,
    createdAt: true,
    updatedAt: true,
});

export type TVideoBasic = z.infer<typeof ZVideoBasic>;

// Create Video Schema
export const ZCreateVideo = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(MEDIA_TITLE_MAX_LENGTH, `Title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`),
    titleEn: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `English title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    description: z.string().optional().nullable(),
    category: z
        .string()
        .max(MEDIA_CATEGORY_MAX_LENGTH, `Category must be ${MEDIA_CATEGORY_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    url: z
        .string()
        .min(1, 'URL is required')
        .max(MEDIA_URL_MAX_LENGTH, `URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`),
    thumbnail: z
        .url('Invalid thumbnail URL format')
        .max(MEDIA_URL_MAX_LENGTH, `Thumbnail URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    duration: z.number().int().min(0, 'Duration cannot be negative').optional().nullable(),
    fileSize: z.number().int().min(0, 'File size cannot be negative').optional().nullable(),
    mimeType: z
        .string()
        .max(MEDIA_MIME_TYPE_MAX_LENGTH, `MIME type must be ${MEDIA_MIME_TYPE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    width: z.number().int().min(0, 'Width cannot be negative').optional().nullable(),
    height: z.number().int().min(0, 'Height cannot be negative').optional().nullable(),
    source: z.enum(Object.values(EMediaSource) as [string, ...string[]]).default(EMediaSource.upload),
    externalId: z
        .string()
        .max(MEDIA_EXTERNAL_ID_MAX_LENGTH, `External ID must be ${MEDIA_EXTERNAL_ID_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    featured: z.boolean().default(false),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).default(EMediaStatus.draft),
    metadata: z.any().optional().nullable(),
    mediaId: z.uuid('Invalid media ID format').optional().nullable(),
    publishedAt: z.coerce.date().optional().nullable(),
});

export type TCreateVideo = z.infer<typeof ZCreateVideo>;

// Update Video Schema
export const ZUpdateVideo = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(MEDIA_TITLE_MAX_LENGTH, `Title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional(),
    titleEn: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `English title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    description: z.string().optional().nullable(),
    category: z
        .string()
        .max(MEDIA_CATEGORY_MAX_LENGTH, `Category must be ${MEDIA_CATEGORY_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    url: z
        .string()
        .min(1, 'URL is required')
        .max(MEDIA_URL_MAX_LENGTH, `URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .optional(),
    thumbnail: z
        .url('Invalid thumbnail URL format')
        .max(MEDIA_URL_MAX_LENGTH, `Thumbnail URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    duration: z.number().int().min(0, 'Duration cannot be negative').optional().nullable(),
    fileSize: z.number().int().min(0, 'File size cannot be negative').optional().nullable(),
    mimeType: z
        .string()
        .max(MEDIA_MIME_TYPE_MAX_LENGTH, `MIME type must be ${MEDIA_MIME_TYPE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    width: z.number().int().min(0, 'Width cannot be negative').optional().nullable(),
    height: z.number().int().min(0, 'Height cannot be negative').optional().nullable(),
    source: z.enum(Object.values(EMediaSource) as [string, ...string[]]).optional(),
    externalId: z
        .string()
        .max(MEDIA_EXTERNAL_ID_MAX_LENGTH, `External ID must be ${MEDIA_EXTERNAL_ID_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    featured: z.boolean().optional(),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).optional(),
    metadata: z.any().optional().nullable(),
    mediaId: z.uuid('Invalid media ID format').optional().nullable(),
    publishedAt: z.coerce.date().optional().nullable(),
});

export type TUpdateVideo = z.infer<typeof ZUpdateVideo>;

// Video Query Filter Schema
export const ZVideoQueryFilter = z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    source: z.enum(Object.values(EMediaSource) as [string, ...string[]]).optional(),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).optional(),
    featured: z.boolean().optional(),
    uploadedBy: z.uuid('Invalid uploader ID format').optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z
        .enum([
            'createdAt',
            'publishedAt',
            'viewCount',
            'likeCount',
            'downloadCount',
            'title',
            'duration',
        ])
        .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type TVideoQueryFilter = z.infer<typeof ZVideoQueryFilter>;

// Video List Response Schema (with pagination)
export const ZVideoListResponse = z.object({
    data: z.array(ZVideoBasic),
    meta: z.object({
        page: z.number().int().positive(),
        limit: z.number().int().positive(),
        total: z.number().int().min(0),
        totalPages: z.number().int().min(0),
        hasNext: z.boolean(),
        hasPrev: z.boolean(),
    }),
});

export type TVideoListResponse = z.infer<typeof ZVideoListResponse>;

// Video Query Unique Schema
export const ZVideoQueryUnique = z
    .object({
        id: z.uuid('Invalid video ID format').optional(),
    })
    .refine((data) => data.id, {
        message: 'Video ID must be provided',
    });

export type TVideoQueryUnique = z.infer<typeof ZVideoQueryUnique>;

// Video Detail Schema (with relations)
export const ZVideoDetail = ZVideo.extend({
    uploader: z
        .object({
            id: z.string(),
            firstName: z.string(),
            middleName: z.string(),
            lastName: z.string().nullable().optional(),
            email: z.string(),
            image: z.string().nullable().optional(),
        })
        .optional(),
});

export type TVideoDetail = z.infer<typeof ZVideoDetail>;

// ========================================
// Audio Schemas
// ========================================

// Base Audio Schema
export const ZAudio = z.object({
    id: z.uuid(),
    title: z
        .string()
        .min(1, 'Title is required')
        .max(MEDIA_TITLE_MAX_LENGTH, `Title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`),
    titleEn: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `English title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    description: z.string().nullable().optional(),
    category: z
        .string()
        .max(MEDIA_CATEGORY_MAX_LENGTH, `Category must be ${MEDIA_CATEGORY_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    url: z
        .string()
        .min(1, 'URL is required')
        .max(MEDIA_URL_MAX_LENGTH, `URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`),
    thumbnail: z
        .string()
        .url('Invalid thumbnail URL format')
        .max(MEDIA_URL_MAX_LENGTH, `Thumbnail URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    duration: z.number().int().min(0, 'Duration cannot be negative').nullable().optional(),
    fileSize: z.number().int().min(0, 'File size cannot be negative').nullable().optional(),
    mimeType: z
        .string()
        .max(MEDIA_MIME_TYPE_MAX_LENGTH, `MIME type must be ${MEDIA_MIME_TYPE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    source: z.enum(Object.values(EMediaSource) as [string, ...string[]]).default(EMediaSource.upload),
    externalId: z
        .string()
        .max(MEDIA_EXTERNAL_ID_MAX_LENGTH, `External ID must be ${MEDIA_EXTERNAL_ID_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    viewCount: z.number().int().min(0, 'View count cannot be negative').default(0),
    likeCount: z.number().int().min(0, 'Like count cannot be negative').default(0),
    downloadCount: z.number().int().min(0, 'Download count cannot be negative').default(0),
    featured: z.boolean().default(false),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).default(EMediaStatus.draft),
    isAvailable: z.boolean().default(true),
    metadata: z.any().nullable().optional(),
    uploadedBy: z.uuid('Invalid uploader ID format'),
    mediaId: z.uuid('Invalid media ID format').nullable().optional(),
    publishedAt: z.coerce.date().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type TAudio = z.infer<typeof ZAudio>;

// Basic Audio Schema (for lists)
export const ZAudioBasic = ZAudio.pick({
    id: true,
    title: true,
    titleEn: true,
    description: true,
    category: true,
    url: true,
    thumbnail: true,
    duration: true,
    fileSize: true,
    mimeType: true,
    source: true,
    externalId: true,
    viewCount: true,
    likeCount: true,
    downloadCount: true,
    featured: true,
    status: true,
    isAvailable: true,
    uploadedBy: true,
    publishedAt: true,
    createdAt: true,
    updatedAt: true,
});

export type TAudioBasic = z.infer<typeof ZAudioBasic>;

// Create Audio Schema
export const ZCreateAudio = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(MEDIA_TITLE_MAX_LENGTH, `Title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`),
    titleEn: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `English title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    description: z.string().optional().nullable(),
    category: z
        .string()
        .max(MEDIA_CATEGORY_MAX_LENGTH, `Category must be ${MEDIA_CATEGORY_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    url: z
        .string()
        .min(1, 'URL is required')
        .max(MEDIA_URL_MAX_LENGTH, `URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`),
    thumbnail: z
        .url('Invalid thumbnail URL format')
        .max(MEDIA_URL_MAX_LENGTH, `Thumbnail URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    duration: z.number().int().min(0, 'Duration cannot be negative').optional().nullable(),
    fileSize: z.number().int().min(0, 'File size cannot be negative').optional().nullable(),
    mimeType: z
        .string()
        .max(MEDIA_MIME_TYPE_MAX_LENGTH, `MIME type must be ${MEDIA_MIME_TYPE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    source: z.enum(Object.values(EMediaSource) as [string, ...string[]]).default(EMediaSource.upload),
    externalId: z
        .string()
        .max(MEDIA_EXTERNAL_ID_MAX_LENGTH, `External ID must be ${MEDIA_EXTERNAL_ID_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    featured: z.boolean().default(false),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).default(EMediaStatus.draft),
    isAvailable: z.boolean().default(true),
    metadata: z.any().optional().nullable(),
    mediaId: z.uuid('Invalid media ID format').optional().nullable(),
    publishedAt: z.coerce.date().optional().nullable(),
});

export type TCreateAudio = z.infer<typeof ZCreateAudio>;

// Update Audio Schema
export const ZUpdateAudio = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(MEDIA_TITLE_MAX_LENGTH, `Title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional(),
    titleEn: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `English title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    description: z.string().optional().nullable(),
    category: z
        .string()
        .max(MEDIA_CATEGORY_MAX_LENGTH, `Category must be ${MEDIA_CATEGORY_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    url: z
        .string()
        .min(1, 'URL is required')
        .max(MEDIA_URL_MAX_LENGTH, `URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .optional(),
    thumbnail: z
        .string()
        .url('Invalid thumbnail URL format')
        .max(MEDIA_URL_MAX_LENGTH, `Thumbnail URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    duration: z.number().int().min(0, 'Duration cannot be negative').optional().nullable(),
    fileSize: z.number().int().min(0, 'File size cannot be negative').optional().nullable(),
    mimeType: z
        .string()
        .max(MEDIA_MIME_TYPE_MAX_LENGTH, `MIME type must be ${MEDIA_MIME_TYPE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    source: z.enum(Object.values(EMediaSource) as [string, ...string[]]).optional(),
    externalId: z
        .string()
        .max(MEDIA_EXTERNAL_ID_MAX_LENGTH, `External ID must be ${MEDIA_EXTERNAL_ID_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    featured: z.boolean().optional(),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).optional(),
    isAvailable: z.boolean().optional(),
    metadata: z.any().optional().nullable(),
    mediaId: z.uuid('Invalid media ID format').optional().nullable(),
    publishedAt: z.coerce.date().optional().nullable(),
});

export type TUpdateAudio = z.infer<typeof ZUpdateAudio>;

// Audio Query Filter Schema
export const ZAudioQueryFilter = z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    source: z.enum(Object.values(EMediaSource) as [string, ...string[]]).optional(),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).optional(),
    featured: z.boolean().optional(),
    isAvailable: z.boolean().optional(),
    uploadedBy: z.uuid('Invalid uploader ID format').optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z
        .enum([
            'createdAt',
            'publishedAt',
            'viewCount',
            'likeCount',
            'downloadCount',
            'title',
            'duration',
        ])
        .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type TAudioQueryFilter = z.infer<typeof ZAudioQueryFilter>;

// Audio List Response Schema (with pagination)
export const ZAudioListResponse = z.object({
    data: z.array(ZAudioBasic),
    meta: z.object({
        page: z.number().int().positive(),
        limit: z.number().int().positive(),
        total: z.number().int().min(0),
        totalPages: z.number().int().min(0),
        hasNext: z.boolean(),
        hasPrev: z.boolean(),
    }),
});

export type TAudioListResponse = z.infer<typeof ZAudioListResponse>;

// Audio Query Unique Schema
export const ZAudioQueryUnique = z
    .object({
        id: z.uuid('Invalid audio ID format').optional(),
    })
    .refine((data) => data.id, {
        message: 'Audio ID must be provided',
    });

export type TAudioQueryUnique = z.infer<typeof ZAudioQueryUnique>;

// Audio Detail Schema (with relations)
export const ZAudioDetail = ZAudio.extend({
    uploader: z
        .object({
            id: z.string(),
            firstName: z.string(),
            middleName: z.string(),
            lastName: z.string().nullable().optional(),
            email: z.string(),
            image: z.string().nullable().optional(),
        })
        .optional(),
});

export type TAudioDetail = z.infer<typeof ZAudioDetail>;

// ========================================
// Photo Schemas
// ========================================

// Base Photo Schema
export const ZPhoto = z.object({
    id: z.uuid(),
    title: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `Title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    titleEn: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `English title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    caption: z.string().nullable().optional(),
    alt: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `Alt text must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    category: z
        .string()
        .max(MEDIA_CATEGORY_MAX_LENGTH, `Category must be ${MEDIA_CATEGORY_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    url: z
        .string()
        .min(1, 'URL is required')
        .max(MEDIA_URL_MAX_LENGTH, `URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`),
    thumbnail: z
        .url('Invalid thumbnail URL format')
        .max(MEDIA_URL_MAX_LENGTH, `Thumbnail URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    fileSize: z.number().int().min(0, 'File size cannot be negative').nullable().optional(),
    mimeType: z
        .string()
        .max(MEDIA_MIME_TYPE_MAX_LENGTH, `MIME type must be ${MEDIA_MIME_TYPE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    width: z.number().int().min(0, 'Width cannot be negative').nullable().optional(),
    height: z.number().int().min(0, 'Height cannot be negative').nullable().optional(),
    source: z.enum(Object.values(EMediaSource) as [string, ...string[]]).default(EMediaSource.upload),
    externalId: z
        .string()
        .max(MEDIA_EXTERNAL_ID_MAX_LENGTH, `External ID must be ${MEDIA_EXTERNAL_ID_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    viewCount: z.number().int().min(0, 'View count cannot be negative').default(0),
    likeCount: z.number().int().min(0, 'Like count cannot be negative').default(0),
    downloadCount: z.number().int().min(0, 'Download count cannot be negative').default(0),
    featured: z.boolean().default(false),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).default(EMediaStatus.draft),
    metadata: z.any().nullable().optional(),
    uploadedBy: z.uuid('Invalid uploader ID format'),
    mediaId: z.uuid('Invalid media ID format').nullable().optional(),
    publishedAt: z.coerce.date().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type TPhoto = z.infer<typeof ZPhoto>;

// Basic Photo Schema (for lists)
export const ZPhotoBasic = ZPhoto.pick({
    id: true,
    title: true,
    titleEn: true,
    caption: true,
    alt: true,
    category: true,
    url: true,
    thumbnail: true,
    fileSize: true,
    mimeType: true,
    width: true,
    height: true,
    source: true,
    externalId: true,
    viewCount: true,
    likeCount: true,
    downloadCount: true,
    featured: true,
    status: true,
    uploadedBy: true,
    publishedAt: true,
    createdAt: true,
    updatedAt: true,
});

export type TPhotoBasic = z.infer<typeof ZPhotoBasic>;

// Create Photo Schema
export const ZCreatePhoto = z.object({
    title: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `Title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    titleEn: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `English title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    caption: z.string().optional().nullable(),
    alt: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `Alt text must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    category: z
        .string()
        .max(MEDIA_CATEGORY_MAX_LENGTH, `Category must be ${MEDIA_CATEGORY_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    url: z
        .string()
        .min(1, 'URL is required')
        .max(MEDIA_URL_MAX_LENGTH, `URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`),
    thumbnail: z
        .url('Invalid thumbnail URL format')
        .max(MEDIA_URL_MAX_LENGTH, `Thumbnail URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    fileSize: z.number().int().min(0, 'File size cannot be negative').optional().nullable(),
    mimeType: z
        .string()
        .max(MEDIA_MIME_TYPE_MAX_LENGTH, `MIME type must be ${MEDIA_MIME_TYPE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    width: z.number().int().min(0, 'Width cannot be negative').optional().nullable(),
    height: z.number().int().min(0, 'Height cannot be negative').optional().nullable(),
    source: z.enum(Object.values(EMediaSource) as [string, ...string[]]).default(EMediaSource.upload),
    externalId: z
        .string()
        .max(MEDIA_EXTERNAL_ID_MAX_LENGTH, `External ID must be ${MEDIA_EXTERNAL_ID_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    featured: z.boolean().default(false),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).default(EMediaStatus.draft),
    metadata: z.any().optional().nullable(),
    mediaId: z.uuid('Invalid media ID format').optional().nullable(),
    publishedAt: z.coerce.date().optional().nullable(),
});

export type TCreatePhoto = z.infer<typeof ZCreatePhoto>;

// Update Photo Schema
export const ZUpdatePhoto = z.object({
    title: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `Title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    titleEn: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `English title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    caption: z.string().optional().nullable(),
    alt: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `Alt text must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    category: z
        .string()
        .max(MEDIA_CATEGORY_MAX_LENGTH, `Category must be ${MEDIA_CATEGORY_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    url: z
        .string()
        .min(1, 'URL is required')
        .max(MEDIA_URL_MAX_LENGTH, `URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .optional(),
    thumbnail: z
        .url('Invalid thumbnail URL format')
        .max(MEDIA_URL_MAX_LENGTH, `Thumbnail URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    fileSize: z.number().int().min(0, 'File size cannot be negative').optional().nullable(),
    mimeType: z
        .string()
        .max(MEDIA_MIME_TYPE_MAX_LENGTH, `MIME type must be ${MEDIA_MIME_TYPE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    width: z.number().int().min(0, 'Width cannot be negative').optional().nullable(),
    height: z.number().int().min(0, 'Height cannot be negative').optional().nullable(),
    source: z.enum(Object.values(EMediaSource) as [string, ...string[]]).optional(),
    externalId: z
        .string()
        .max(MEDIA_EXTERNAL_ID_MAX_LENGTH, `External ID must be ${MEDIA_EXTERNAL_ID_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    featured: z.boolean().optional(),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).optional(),
    metadata: z.any().optional().nullable(),
    mediaId: z.uuid('Invalid media ID format').optional().nullable(),
    publishedAt: z.coerce.date().optional().nullable(),
});

export type TUpdatePhoto = z.infer<typeof ZUpdatePhoto>;

// Photo Query Filter Schema
export const ZPhotoQueryFilter = z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    source: z.enum(Object.values(EMediaSource) as [string, ...string[]]).optional(),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).optional(),
    featured: z.boolean().optional(),
    uploadedBy: z.uuid('Invalid uploader ID format').optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z
        .enum([
            'createdAt',
            'publishedAt',
            'viewCount',
            'likeCount',
            'downloadCount',
            'title',
        ])
        .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type TPhotoQueryFilter = z.infer<typeof ZPhotoQueryFilter>;

// Photo List Response Schema (with pagination)
export const ZPhotoListResponse = z.object({
    data: z.array(ZPhotoBasic),
    meta: z.object({
        page: z.number().int().positive(),
        limit: z.number().int().positive(),
        total: z.number().int().min(0),
        totalPages: z.number().int().min(0),
        hasNext: z.boolean(),
        hasPrev: z.boolean(),
    }),
});

export type TPhotoListResponse = z.infer<typeof ZPhotoListResponse>;

// Photo Query Unique Schema
export const ZPhotoQueryUnique = z
    .object({
        id: z.uuid('Invalid photo ID format').optional(),
    })
    .refine((data) => data.id, {
        message: 'Photo ID must be provided',
    });

export type TPhotoQueryUnique = z.infer<typeof ZPhotoQueryUnique>;

// Photo Detail Schema (with relations)
export const ZPhotoDetail = ZPhoto.extend({
    uploader: z
        .object({
            id: z.string(),
            firstName: z.string(),
            middleName: z.string(),
            lastName: z.string().nullable().optional(),
            email: z.string(),
            image: z.string().nullable().optional(),
        })
        .optional(),
});

export type TPhotoDetail = z.infer<typeof ZPhotoDetail>;

// ========================================
// Gallery Schemas
// ========================================

// Base Gallery Schema
export const ZGallery = z.object({
    id: z.uuid(),
    title: z
        .string()
        .min(1, 'Title is required')
        .max(MEDIA_TITLE_MAX_LENGTH, `Title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`),
    titleEn: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `English title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    description: z.string().nullable().optional(),
    slug: z
        .string()
        .min(1, 'Slug is required')
        .max(MEDIA_TITLE_MAX_LENGTH, `Slug must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`),
    category: z
        .string()
        .max(MEDIA_CATEGORY_MAX_LENGTH, `Category must be ${MEDIA_CATEGORY_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    featured: z.boolean().default(false),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).default(EMediaStatus.draft),
    coverImage: z
        .url('Invalid cover image URL format')
        .max(MEDIA_URL_MAX_LENGTH, `Cover image URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    metadata: z.any().nullable().optional(),
    createdBy: z.uuid('Invalid creator ID format'),
    publishedAt: z.coerce.date().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type TGallery = z.infer<typeof ZGallery>;

// Basic Gallery Schema (for lists)
export const ZGalleryBasic = ZGallery.pick({
    id: true,
    title: true,
    titleEn: true,
    description: true,
    slug: true,
    category: true,
    featured: true,
    status: true,
    coverImage: true,
    createdBy: true,
    publishedAt: true,
    createdAt: true,
    updatedAt: true,
});

export type TGalleryBasic = z.infer<typeof ZGalleryBasic>;

// Create Gallery Schema
export const ZCreateGallery = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(MEDIA_TITLE_MAX_LENGTH, `Title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`),
    titleEn: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `English title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    description: z.string().optional().nullable(),
    slug: z
        .string()
        .min(1, 'Slug is required')
        .max(MEDIA_TITLE_MAX_LENGTH, `Slug must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`),
    category: z
        .string()
        .max(MEDIA_CATEGORY_MAX_LENGTH, `Category must be ${MEDIA_CATEGORY_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    featured: z.boolean().default(false),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).default(EMediaStatus.draft),
    coverImage: z
        .url('Invalid cover image URL format')
        .max(MEDIA_URL_MAX_LENGTH, `Cover image URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    metadata: z.any().optional().nullable(),
    publishedAt: z.coerce.date().optional().nullable(),
});

export type TCreateGallery = z.infer<typeof ZCreateGallery>;

// Update Gallery Schema
export const ZUpdateGallery = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(MEDIA_TITLE_MAX_LENGTH, `Title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional(),
    titleEn: z
        .string()
        .max(MEDIA_TITLE_MAX_LENGTH, `English title must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    description: z.string().optional().nullable(),
    slug: z
        .string()
        .min(1, 'Slug is required')
        .max(MEDIA_TITLE_MAX_LENGTH, `Slug must be ${MEDIA_TITLE_MAX_LENGTH} characters or less`)
        .optional(),
    category: z
        .string()
        .max(MEDIA_CATEGORY_MAX_LENGTH, `Category must be ${MEDIA_CATEGORY_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    featured: z.boolean().optional(),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).optional(),
    coverImage: z
        .url('Invalid cover image URL format')
        .max(MEDIA_URL_MAX_LENGTH, `Cover image URL must be ${MEDIA_URL_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    metadata: z.any().optional().nullable(),
    publishedAt: z.coerce.date().optional().nullable(),
});

export type TUpdateGallery = z.infer<typeof ZUpdateGallery>;

// Gallery Query Filter Schema
export const ZGalleryQueryFilter = z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(Object.values(EMediaStatus) as [string, ...string[]]).optional(),
    featured: z.boolean().optional(),
    createdBy: z.uuid('Invalid creator ID format').optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z
        .enum(['createdAt', 'publishedAt', 'title', 'updatedAt'])
        .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type TGalleryQueryFilter = z.infer<typeof ZGalleryQueryFilter>;

// Gallery Query Unique Schema
export const ZGalleryQueryUnique = z
    .object({
        id: z.uuid('Invalid gallery ID format').optional(),
        slug: z.string().optional(),
    })
    .refine((data) => data.id || data.slug, {
        message: 'Either gallery ID or slug must be provided',
    });

export type TGalleryQueryUnique = z.infer<typeof ZGalleryQueryUnique>;

// Gallery Detail Schema (with relations)
export const ZGalleryDetail = ZGallery.extend({
    creator: z
        .object({
            id: z.string(),
            firstName: z.string(),
            middleName: z.string(),
            lastName: z.string().nullable().optional(),
            email: z.string(),
            image: z.string().nullable().optional(),
        })
        .optional(),
    photos: z
        .array(
            z.object({
                id: z.uuid(),
                photoId: z.uuid(),
                order: z.number().int(),
                photo: ZPhotoBasic.optional(),
            }),
        )
        .optional(),
});

export type TGalleryDetail = z.infer<typeof ZGalleryDetail>;

// Gallery Photo Junction Schema
export const ZGalleryPhoto = z.object({
    id: z.uuid(),
    galleryId: z.uuid('Invalid gallery ID format'),
    photoId: z.uuid('Invalid photo ID format'),
    order: z.number().int().min(0, 'Order cannot be negative').default(0),
    createdAt: z.coerce.date(),
});

export type TGalleryPhoto = z.infer<typeof ZGalleryPhoto>;

// Gallery List Response Schema (with pagination)
export const ZGalleryListResponse = z.object({
    data: z.array(ZGalleryBasic),
    meta: z.object({
        page: z.number().int().positive(),
        limit: z.number().int().positive(),
        total: z.number().int().min(0),
        totalPages: z.number().int().min(0),
        hasNext: z.boolean(),
        hasPrev: z.boolean(),
    }),
});

export type TGalleryListResponse = z.infer<typeof ZGalleryListResponse>;


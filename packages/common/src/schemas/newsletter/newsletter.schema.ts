import { z } from 'zod';
import { ENewsletterLanguage, ENewsletterStatus, ENewsletterSubscriptionStatus } from '../enums';

// Constants for validation
const NEWSLETTER_TITLE_MAX_LENGTH = 255;
const NEWSLETTER_SUBJECT_MAX_LENGTH = 255;
const NEWSLETTER_SOURCE_MAX_LENGTH = 100;

// ========================================
// Newsletter Schemas
// ========================================

// Base Newsletter Schema
export const ZNewsletter = z.object({
    id: z.uuid(),
    subject: z
        .string()
        .min(1, 'Subject is required')
        .max(NEWSLETTER_SUBJECT_MAX_LENGTH, `Subject must be ${NEWSLETTER_SUBJECT_MAX_LENGTH} characters or less`),
    subjectAm: z
        .string()
        .max(NEWSLETTER_SUBJECT_MAX_LENGTH, `Amharic subject must be ${NEWSLETTER_SUBJECT_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    subjectOr: z
        .string()
        .max(NEWSLETTER_SUBJECT_MAX_LENGTH, `Oromo subject must be ${NEWSLETTER_SUBJECT_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    title: z
        .string()
        .min(1, 'Title is required')
        .max(NEWSLETTER_TITLE_MAX_LENGTH, `Title must be ${NEWSLETTER_TITLE_MAX_LENGTH} characters or less`),
    titleAm: z
        .string()
        .max(NEWSLETTER_TITLE_MAX_LENGTH, `English title must be ${NEWSLETTER_TITLE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    titleOr: z
        .string()
        .max(NEWSLETTER_TITLE_MAX_LENGTH, `Oromo title must be ${NEWSLETTER_TITLE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    content: z.json().default({}).nullable().optional(),
    contentAm: z.json().default({}).nullable().optional(),
    contentOr: z.json().default({}).nullable().optional(),
    isPremium: z.boolean().default(false),
    status: z.enum(Object.values(ENewsletterStatus) as [string, ...string[]]).default(ENewsletterStatus.draft),
    scheduledAt: z.coerce.date().nullable().optional(),
    sentAt: z.coerce.date().nullable().optional(),
    recipientCount: z.number().int().min(0, 'Recipient count cannot be negative').default(0),
    openedCount: z.number().int().min(0, 'Opened count cannot be negative').default(0),
    clickedCount: z.number().int().min(0, 'Clicked count cannot be negative').default(0),
    createdBy: z.uuid('Invalid creator ID format'),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type TNewsletter = z.infer<typeof ZNewsletter>;

// Basic Newsletter Schema (for lists)
export const ZNewsletterBasic = ZNewsletter.pick({
    id: true,
    subject: true,
    subjectAm: true,
    subjectOr: true,
    title: true,
    titleAm: true,
    titleOr: true,
    isPremium: true,
    status: true,
    scheduledAt: true,
    sentAt: true,
    recipientCount: true,
    openedCount: true,
    clickedCount: true,
    createdBy: true,
    createdAt: true,
    updatedAt: true,
});

export type TNewsletterBasic = z.infer<typeof ZNewsletterBasic>;

// Create Newsletter Schema
export const ZCreateNewsletter = z.object({
    subject: z
        .string()
        .min(1, 'Subject is required')
        .max(NEWSLETTER_SUBJECT_MAX_LENGTH, `Subject must be ${NEWSLETTER_SUBJECT_MAX_LENGTH} characters or less`),
    subjectAm: z
        .string()
        .max(NEWSLETTER_SUBJECT_MAX_LENGTH, `Amharic subject must be ${NEWSLETTER_SUBJECT_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    subjectOr: z
        .string()
        .max(NEWSLETTER_SUBJECT_MAX_LENGTH, `Oromo subject must be ${NEWSLETTER_SUBJECT_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    title: z
        .string()
        .min(1, 'Title is required')
        .max(NEWSLETTER_TITLE_MAX_LENGTH, `Title must be ${NEWSLETTER_TITLE_MAX_LENGTH} characters or less`),
    titleAm: z
        .string()
        .max(NEWSLETTER_TITLE_MAX_LENGTH, `English title must be ${NEWSLETTER_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    titleOr: z
        .string()
        .max(NEWSLETTER_TITLE_MAX_LENGTH, `Oromo title must be ${NEWSLETTER_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    content: z.json().default({}).optional().nullable(),
    contentAm: z.json().default({}).optional().nullable(),
    contentOr: z.json().default({}).optional().nullable(),
    isPremium: z.boolean().default(false),
    status: z.enum(Object.values(ENewsletterStatus) as [string, ...string[]]).default(ENewsletterStatus.draft),
    scheduledAt: z.coerce.date().optional().nullable(),
});

export type TCreateNewsletter = z.infer<typeof ZCreateNewsletter>;

// Update Newsletter Schema
export const ZUpdateNewsletter = z.object({
    subject: z
        .string()
        .min(1, 'Subject is required')
        .max(NEWSLETTER_SUBJECT_MAX_LENGTH, `Subject must be ${NEWSLETTER_SUBJECT_MAX_LENGTH} characters or less`)
        .optional(),
    subjectAm: z
        .string()
        .max(NEWSLETTER_SUBJECT_MAX_LENGTH, `Amharic subject must be ${NEWSLETTER_SUBJECT_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    subjectOr: z
        .string()
        .max(NEWSLETTER_SUBJECT_MAX_LENGTH, `Oromo subject must be ${NEWSLETTER_SUBJECT_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    title: z
        .string()
        .min(1, 'Title is required')
        .max(NEWSLETTER_TITLE_MAX_LENGTH, `Title must be ${NEWSLETTER_TITLE_MAX_LENGTH} characters or less`)
        .optional(),
    titleAm: z
        .string()
        .max(NEWSLETTER_TITLE_MAX_LENGTH, `English title must be ${NEWSLETTER_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    titleOr: z
        .string()
        .max(NEWSLETTER_TITLE_MAX_LENGTH, `Oromo title must be ${NEWSLETTER_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    content: z.json().default({}).optional().nullable(),
    contentAm: z.json().default({}).optional().nullable(),
    contentOr: z.json().default({}).optional().nullable(),
    isPremium: z.boolean().optional(),
    status: z.enum(Object.values(ENewsletterStatus) as [string, ...string[]]).optional(),
    scheduledAt: z.coerce.date().optional().nullable(),
});

export type TUpdateNewsletter = z.infer<typeof ZUpdateNewsletter>;

// Newsletter Query Filter Schema
export const ZNewsletterQueryFilter = z.object({
    search: z.string().optional(),
    status: z.enum(Object.values(ENewsletterStatus) as [string, ...string[]]).optional(),
    createdBy: z.uuid('Invalid creator ID format').optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z
        .enum(['createdAt', 'scheduledAt', 'sentAt', 'title', 'recipientCount', 'openedCount'])
        .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type TNewsletterQueryFilter = z.infer<typeof ZNewsletterQueryFilter>;

// Newsletter Query Unique Schema
export const ZNewsletterQueryUnique = z
    .object({
        id: z.uuid('Invalid newsletter ID format').optional(),
    })
    .refine((data) => data.id, {
        message: 'Newsletter ID must be provided',
    });

export type TNewsletterQueryUnique = z.infer<typeof ZNewsletterQueryUnique>;

// Newsletter Detail Schema (with relations)
export const ZNewsletterDetail = ZNewsletter.extend({
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
});

export type TNewsletterDetail = z.infer<typeof ZNewsletterDetail>;

// Newsletter List Response Schema (with pagination)
export const ZNewsletterListResponse = z.object({
    data: z.array(ZNewsletterBasic),
    meta: z.object({
        page: z.number().int().positive(),
        limit: z.number().int().positive(),
        total: z.number().int().min(0),
        totalPages: z.number().int().min(0),
        hasNext: z.boolean(),
        hasPrev: z.boolean(),
    }),
});

export type TNewsletterListResponse = z.infer<typeof ZNewsletterListResponse>;

// Newsletter Amharic Schema
export const ZNewsletterAmharic = z.object({
    id: z.string(),
    subjectAm: z.string(),
    titleAm: z.string(),
    contentAm: z.json().default({}).nullable().optional(),
});

export type TNewsletterAmharic = z.infer<typeof ZNewsletterAmharic>;

// Newsletter Oromo Schema
export const ZNewsletterOromo = z.object({
    id: z.string(),
    subjectOr: z.string(),
    titleOr: z.string(),
    contentOr: z.json().default({}).nullable().optional(),
});

export type TNewsletterOromo = z.infer<typeof ZNewsletterOromo>;

// ========================================
// Newsletter Subscription Schemas
// ========================================

// Base Newsletter Subscription Schema
export const ZNewsletterSubscription = z.object({
    id: z.uuid(),
    email: z.email('Invalid email format'),
    name: z
        .string()
        .max(NEWSLETTER_TITLE_MAX_LENGTH, `Name must be ${NEWSLETTER_TITLE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    userId: z.uuid('Invalid user ID format').nullable().optional(),
    language: z.enum(Object.values(ENewsletterLanguage) as [string, ...string[]]).default(ENewsletterLanguage.en),
    status: z
        .enum(Object.values(ENewsletterSubscriptionStatus) as [string, ...string[]])
        .default(ENewsletterSubscriptionStatus.subscribed),
    source: z
        .string()
        .max(NEWSLETTER_SOURCE_MAX_LENGTH, `Source must be ${NEWSLETTER_SOURCE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    subscribedAt: z.coerce.date(),
    unsubscribedAt: z.coerce.date().nullable().optional(),
    lastEmailSent: z.coerce.date().nullable().optional(),
    metadata: z.json().default({}).nullable().optional(),
});

export type TNewsletterSubscription = z.infer<typeof ZNewsletterSubscription>;

// Create Newsletter Subscription Schema
export const ZCreateNewsletterSubscription = z.object({
    email: z.email('Invalid email format'),
    name: z
        .string()
        .max(NEWSLETTER_TITLE_MAX_LENGTH, `Name must be ${NEWSLETTER_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    language: z.enum(Object.values(ENewsletterLanguage) as [string, ...string[]]).default(ENewsletterLanguage.en),
    source: z
        .string()
        .max(NEWSLETTER_SOURCE_MAX_LENGTH, `Source must be ${NEWSLETTER_SOURCE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    metadata: z.json().default({}).optional().nullable(),
});

export type TCreateNewsletterSubscription = z.infer<typeof ZCreateNewsletterSubscription>;

// Update Newsletter Subscription Schema
export const ZUpdateNewsletterSubscription = z.object({
    name: z
        .string()
        .max(NEWSLETTER_TITLE_MAX_LENGTH, `Name must be ${NEWSLETTER_TITLE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    language: z.enum(Object.values(ENewsletterLanguage) as [string, ...string[]]).optional(),
    status: z.enum(Object.values(ENewsletterSubscriptionStatus) as [string, ...string[]]).optional(),
    metadata: z.json().default({}).optional().nullable(),
});

export type TUpdateNewsletterSubscription = z.infer<typeof ZUpdateNewsletterSubscription>;

// Newsletter Subscription Query Filter Schema
export const ZNewsletterSubscriptionQueryFilter = z.object({
    search: z.string().optional(),
    status: z.enum(Object.values(ENewsletterSubscriptionStatus) as [string, ...string[]]).optional(),
    language: z.enum(Object.values(ENewsletterLanguage) as [string, ...string[]]).optional(),
    source: z.string().optional(),
    userId: z.uuid('Invalid user ID format').optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z.enum(['createdAt', 'subscribedAt', 'email', 'name', 'language', 'status']).default('subscribedAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type TNewsletterSubscriptionQueryFilter = z.infer<typeof ZNewsletterSubscriptionQueryFilter>;

// Newsletter Subscription Query Unique Schema
export const ZNewsletterSubscriptionQueryUnique = z
    .object({
        id: z.uuid('Invalid subscription ID format').optional(),
        email: z.email('Invalid email format').optional(),
    })
    .refine((data) => data.id || data.email, {
        message: 'Either subscription ID or email must be provided',
    });

export type TNewsletterSubscriptionQueryUnique = z.infer<typeof ZNewsletterSubscriptionQueryUnique>;

// Newsletter Subscription Detail Schema (with relations)
export const ZNewsletterSubscriptionDetail = ZNewsletterSubscription.extend({
    user: z
        .object({
            id: z.string(),
            firstName: z.string(),
            middleName: z.string(),
            lastName: z.string().nullable().optional(),
            email: z.string(),
            image: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
});

export type TNewsletterSubscriptionDetail = z.infer<typeof ZNewsletterSubscriptionDetail>;

// Newsletter Subscription List Response Schema (with pagination)
export const ZNewsletterSubscriptionListResponse = z.object({
    data: z.array(ZNewsletterSubscription),
    meta: z.object({
        page: z.number().int().positive(),
        limit: z.number().int().positive(),
        total: z.number().int().min(0),
        totalPages: z.number().int().min(0),
        hasNext: z.boolean(),
        hasPrev: z.boolean(),
    }),
});

export type TNewsletterSubscriptionListResponse = z.infer<typeof ZNewsletterSubscriptionListResponse>;


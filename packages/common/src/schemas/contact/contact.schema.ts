import { z } from 'zod';
import { EContactSubmissionStatus } from '../enums';

// Constants for validation
const CONTACT_NAME_MAX_LENGTH = 255;
const CONTACT_EMAIL_MAX_LENGTH = 255;
const CONTACT_PHONE_MAX_LENGTH = 50;
const CONTACT_SUBJECT_MAX_LENGTH = 255;
const CONTACT_MESSAGE_MAX_LENGTH = 5000;
const CONTACT_INQUIRY_TYPE_MAX_LENGTH = 100;
const CONTACT_REPLY_MESSAGE_MAX_LENGTH = 5000;

// ========================================
// Contact Submission Schemas
// ========================================

// Base Contact Submission Schema
export const ZContactSubmission = z.object({
    id: z.uuid(),
    name: z
        .string()
        .min(1, 'Name is required')
        .max(CONTACT_NAME_MAX_LENGTH, `Name must be ${CONTACT_NAME_MAX_LENGTH} characters or less`),
    email: z
        .email('Invalid email format')
        .max(CONTACT_EMAIL_MAX_LENGTH, `Email must be ${CONTACT_EMAIL_MAX_LENGTH} characters or less`),
    phone: z
        .string()
        .max(CONTACT_PHONE_MAX_LENGTH, `Phone must be ${CONTACT_PHONE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    subject: z
        .string()
        .min(1, 'Subject is required')
        .max(CONTACT_SUBJECT_MAX_LENGTH, `Subject must be ${CONTACT_SUBJECT_MAX_LENGTH} characters or less`),
    message: z
        .string()
        .min(1, 'Message is required')
        .max(CONTACT_MESSAGE_MAX_LENGTH, `Message must be ${CONTACT_MESSAGE_MAX_LENGTH} characters or less`),
    inquiryType: z
        .string()
        .max(CONTACT_INQUIRY_TYPE_MAX_LENGTH, `Inquiry type must be ${CONTACT_INQUIRY_TYPE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    status: z
        .enum(Object.values(EContactSubmissionStatus) as [string, ...string[]])
        .default(EContactSubmissionStatus.new),
    userId: z.uuid('Invalid user ID format').nullable().optional(),
    repliedAt: z.coerce.date().nullable().optional(),
    repliedBy: z.uuid('Invalid replier ID format').nullable().optional(),
    replyMessage: z
        .string()
        .max(CONTACT_REPLY_MESSAGE_MAX_LENGTH, `Reply message must be ${CONTACT_REPLY_MESSAGE_MAX_LENGTH} characters or less`)
        .nullable()
        .optional(),
    metadata: z.any().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type TContactSubmission = z.infer<typeof ZContactSubmission>;

// Basic Contact Submission Schema (for lists)
export const ZContactSubmissionBasic = ZContactSubmission.pick({
    id: true,
    name: true,
    email: true,
    phone: true,
    subject: true,
    inquiryType: true,
    status: true,
    userId: true,
    repliedAt: true,
    repliedBy: true,
    createdAt: true,
    updatedAt: true,
});

export type TContactSubmissionBasic = z.infer<typeof ZContactSubmissionBasic>;

// Create Contact Submission Schema
export const ZCreateContactSubmission = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(CONTACT_NAME_MAX_LENGTH, `Name must be ${CONTACT_NAME_MAX_LENGTH} characters or less`),
    email: z
        .string()
        .email('Invalid email format')
        .max(CONTACT_EMAIL_MAX_LENGTH, `Email must be ${CONTACT_EMAIL_MAX_LENGTH} characters or less`),
    phone: z
        .string()
        .max(CONTACT_PHONE_MAX_LENGTH, `Phone must be ${CONTACT_PHONE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    subject: z
        .string()
        .min(1, 'Subject is required')
        .max(CONTACT_SUBJECT_MAX_LENGTH, `Subject must be ${CONTACT_SUBJECT_MAX_LENGTH} characters or less`),
    message: z
        .string()
        .min(1, 'Message is required')
        .max(CONTACT_MESSAGE_MAX_LENGTH, `Message must be ${CONTACT_MESSAGE_MAX_LENGTH} characters or less`),
    inquiryType: z
        .string()
        .max(CONTACT_INQUIRY_TYPE_MAX_LENGTH, `Inquiry type must be ${CONTACT_INQUIRY_TYPE_MAX_LENGTH} characters or less`)
        .optional()
        .nullable(),
    metadata: z.any().optional().nullable(),
});

export type TCreateContactSubmission = z.infer<typeof ZCreateContactSubmission>;

// Contact Submission Query Filter Schema
export const ZContactSubmissionQueryFilter = z.object({
    search: z.string().optional(),
    status: z.enum(Object.values(EContactSubmissionStatus) as [string, ...string[]]).optional(),
    inquiryType: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    userId: z.uuid('Invalid user ID format').optional(),
    repliedBy: z.uuid('Invalid replier ID format').optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z.enum(['createdAt', 'updatedAt', 'repliedAt', 'subject', 'name', 'email']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type TContactSubmissionQueryFilter = z.infer<typeof ZContactSubmissionQueryFilter>;

// Contact Submission Query Unique Schema
export const ZContactSubmissionQueryUnique = z
    .object({
        id: z.uuid('Invalid contact submission ID format').optional(),
    })
    .refine((data) => data.id, {
        message: 'Contact submission ID must be provided',
    });

export type TContactSubmissionQueryUnique = z.infer<typeof ZContactSubmissionQueryUnique>;

// Contact Submission Detail Schema (with relations)
export const ZContactSubmissionDetail = ZContactSubmission.extend({
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
    replier: z
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

export type TContactSubmissionDetail = z.infer<typeof ZContactSubmissionDetail>;

// Contact Submission List Response Schema (with pagination)
export const ZContactSubmissionListResponse = z.object({
    data: z.array(ZContactSubmissionBasic),
    meta: z.object({
        page: z.number().int().positive(),
        limit: z.number().int().positive(),
        total: z.number().int().min(0),
        totalPages: z.number().int().min(0),
        hasNext: z.boolean(),
        hasPrev: z.boolean(),
    }),
});

export type TContactSubmissionListResponse = z.infer<typeof ZContactSubmissionListResponse>;


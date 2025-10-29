import { z } from 'zod';
import { ZBookBasic } from '../books/books.schema';
import {
  EReviewReportReason,
  EReviewReportStatus,
  EReviewStatus
} from '../enums';
import { ZPaginationResponse } from '../global.schema';
import { ZUserBasic } from '../users/user.schema';

// Constants for validation
const REVIEW_TITLE_MAX_LENGTH = 255;
const REVIEW_COMMENT_MAX_LENGTH = 2000;
const REVIEW_REPORT_DESCRIPTION_MAX_LENGTH = 500;
const RATING_MIN = 1;
const RATING_MAX = 5;
const MAX_IMAGES = 5;

// Base schemas
export const ZBookReview = z.object({
  id: z.uuid('Invalid review ID format'),
  bookId: z.uuid('Invalid book ID format'),
  userId: z.uuid('Invalid user ID format'),
  orderId: z.uuid('Invalid order ID format').optional().nullable(),
  rating: z
    .number()
    .int('Rating must be a whole number')
    .min(RATING_MIN, `Rating must be at least ${RATING_MIN}`)
    .max(RATING_MAX, `Rating cannot exceed ${RATING_MAX}`),
  title: z
    .string()
    .max(
      REVIEW_TITLE_MAX_LENGTH,
      `Title must be less than ${REVIEW_TITLE_MAX_LENGTH} characters`,
    )
    .optional()
    .nullable(),
  comment: z
    .string()
    .max(
      REVIEW_COMMENT_MAX_LENGTH,
      `Comment must be less than ${REVIEW_COMMENT_MAX_LENGTH} characters`,
    )
    .optional()
    .nullable(),
  images: z
    .array(z.url('Invalid image URL format'))
    .max(MAX_IMAGES, `Maximum ${MAX_IMAGES} images allowed`)
    .optional()
    .nullable(),
  verified: z.boolean().default(false),
  helpful: z
    .number()
    .int('Helpful count must be a whole number')
    .min(0, 'Helpful count cannot be negative')
    .default(0),
  status: z
    .enum(EReviewStatus, {
      message: 'Invalid review status',
    })
    .default(EReviewStatus.pending),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type TBookReview = z.infer<typeof ZBookReview>;
// Create schemas
export const ZCreateBookReview = z.object({
  bookId: z.uuid('Invalid book ID format'),
  orderId: z.uuid('Invalid order ID format').optional(),
  rating: z
    .number()
    .int('Rating must be a whole number')
    .min(RATING_MIN, `Rating must be at least ${RATING_MIN}`)
    .max(RATING_MAX, `Rating cannot exceed ${RATING_MAX}`),
  title: z
    .string()
    .max(
      REVIEW_TITLE_MAX_LENGTH,
      `Title must be less than ${REVIEW_TITLE_MAX_LENGTH} characters`,
    )
    .optional(),
  comment: z
    .string()
    .max(
      REVIEW_COMMENT_MAX_LENGTH,
      `Comment must be less than ${REVIEW_COMMENT_MAX_LENGTH} characters`,
    )
    .optional(),
  images: z
    .array(z.string().url('Invalid image URL format'))
    .max(MAX_IMAGES, `Maximum ${MAX_IMAGES} images allowed`)
    .optional(),
});
export type TCreateBookReview = z.infer<typeof ZCreateBookReview>;
// Update schemas
export const ZUpdateBookReview = z.object({
  rating: z
    .number()
    .int('Rating must be a whole number')
    .min(RATING_MIN, `Rating must be at least ${RATING_MIN}`)
    .max(RATING_MAX, `Rating cannot exceed ${RATING_MAX}`)
    .optional(),
  title: z
    .string()
    .max(
      REVIEW_TITLE_MAX_LENGTH,
      `Title must be less than ${REVIEW_TITLE_MAX_LENGTH} characters`,
    )
    .optional(),
  comment: z
    .string()
    .max(
      REVIEW_COMMENT_MAX_LENGTH,
      `Comment must be less than ${REVIEW_COMMENT_MAX_LENGTH} characters`,
    )
    .optional(),
  images: z
    .array(z.string().url('Invalid image URL format'))
    .max(MAX_IMAGES, `Maximum ${MAX_IMAGES} images allowed`)
    .optional(),
});
export type TUpdateBookReview = z.infer<typeof ZUpdateBookReview>;

// Query schemas
export const ZBookReviewQueryUnique = z.object({ id: z.uuid() });
export type TBookReviewQueryUnique = z.infer<
  typeof ZBookReviewQueryUnique
>;

export const ZBookReviewQueryFilter = z.object({
  bookId: z.uuid('Invalid book ID format').optional(),
  userId: z.uuid('Invalid user ID format').optional(),
  rating: z
    .number()
    .int('Rating must be a whole number')
    .min(RATING_MIN, `Rating must be at least ${RATING_MIN}`)
    .max(RATING_MAX, `Rating cannot exceed ${RATING_MAX}`)
    .optional(),
  minRating: z
    .number()
    .int('Min rating must be a whole number')
    .min(RATING_MIN, `Min rating must be at least ${RATING_MIN}`)
    .max(RATING_MAX, `Min rating cannot exceed ${RATING_MAX}`)
    .optional(),
  maxRating: z
    .number()
    .int('Max rating must be a whole number')
    .min(RATING_MIN, `Max rating must be at least ${RATING_MIN}`)
    .max(RATING_MAX, `Max rating cannot exceed ${RATING_MAX}`)
    .optional(),
  status: z
    .enum(EReviewStatus, {
      message: 'Invalid review status',
    })
    .optional(),
  verified: z.boolean().optional(),
  search: z.string().min(1).max(255).optional(),

  // Pagination parameters
  page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce
    .number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10),

  // Sorting parameters
  sortBy: z
    .enum(['rating', 'createdAt', 'helpful', 'updatedAt'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
export type TBookReviewQueryFilter = z.infer<
  typeof ZBookReviewQueryFilter
>;

// Review helpful schemas
export const ZReviewHelpful = z.object({
  id: z.uuid('Invalid helpful ID format'),
  reviewId: z.uuid('Invalid review ID format'),
  userId: z.uuid('Invalid user ID format'),
  helpful: z.boolean(),
  createdAt: z.coerce.date(),
});
export type TReviewHelpful = z.infer<typeof ZReviewHelpful>;

export const ZCreateReviewHelpful = z.object({
  reviewId: z.uuid('Invalid review ID format'),
  helpful: z.boolean(),
});
export type TCreateReviewHelpful = z.infer<typeof ZCreateReviewHelpful>;

// Review report schemas
export const ZReviewReport = z.object({
  id: z.uuid('Invalid report ID format'),
  reviewId: z.uuid('Invalid review ID format'),
  userId: z.uuid('Invalid user ID format'),
  reason: z.enum(EReviewReportReason, {
    message: 'Invalid report reason',
  }),
  description: z
    .string()
    .max(
      REVIEW_REPORT_DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${REVIEW_REPORT_DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional()
    .nullable(),
  status: z
    .enum(EReviewReportStatus, {
      message: 'Invalid report status',
    })
    .default(EReviewReportStatus.pending),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type TReviewReport = z.infer<typeof ZReviewReport>;

export const ZCreateReviewReport = z.object({
  reviewId: z.uuid('Invalid review ID format'),
  reason: z.enum(EReviewReportReason, {
    message: 'Invalid report reason',
  }),
  description: z
    .string()
    .max(
      REVIEW_REPORT_DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${REVIEW_REPORT_DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional(),
});
export type TCreateReviewReport = z.infer<typeof ZCreateReviewReport>;

export const ZUpdateReviewReport = z.object({
  status: z.enum(EReviewReportStatus, {
    message: 'Invalid report status',
  }),
});

export type TUpdateReviewReport = z.infer<typeof ZUpdateReviewReport>;

export const ZBookReviewBasic = ZBookReview.extend({
  user: ZUserBasic,
});

export type TBookReviewBasic = z.infer<typeof ZBookReviewBasic>;

// Response schemas
export const ZBookReviewListResponse = ZPaginationResponse(
  ZBookReviewBasic.array(),
);

export type TBookReviewListResponse = z.infer<
  typeof ZBookReviewListResponse
>;

// Detail schemas with related data
export const ZBookReviewDetail = ZBookReview.extend({
  user: ZUserBasic.optional(),
  book: ZBookBasic.optional(),
});

export type TBookReviewDetail = z.infer<typeof ZBookReviewDetail>;

// Analytics schemas
export const ZReviewAnalytics = z.object({
  totalReviews: z.number().int().min(0),
  averageRating: z.number().min(0).max(5),
  ratingDistribution: z.object({
    oneStar: z.number().int().min(0),
    twoStar: z.number().int().min(0),
    threeStar: z.number().int().min(0),
    fourStar: z.number().int().min(0),
    fiveStar: z.number().int().min(0),
  }),
  verifiedReviews: z.number().int().min(0),
  pendingReviews: z.number().int().min(0),
  recentReviews: z.number().int().min(0),
});
export type TReviewAnalytics = z.infer<typeof ZReviewAnalytics>;

// Validation helpers
export const ZReviewValidation = {
  // Rating validation
  validateRating: (rating: number) => {
    return (
      Number.isInteger(rating) && rating >= RATING_MIN && rating <= RATING_MAX
    );
  },

  // Image validation
  validateImages: (images: string[]) => {
    return (
      images.length <= MAX_IMAGES &&
      images.every((img) => {
        try {
          new URL(img);
          return true;
        } catch {
          return false;
        }
      })
    );
  },

  // Comment validation
  validateComment: (comment: string) => {
    return comment.length <= REVIEW_COMMENT_MAX_LENGTH;
  },

  // Title validation
  validateTitle: (title: string) => {
    return title.length <= REVIEW_TITLE_MAX_LENGTH;
  },
};

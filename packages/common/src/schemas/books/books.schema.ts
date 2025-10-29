import { z } from 'zod';
import { ZPaginationResponse } from '../global.schema';
import {
  EBookStatus,
  ESearchAnalyticsSource,
} from '../enums';

// Constants for validation
const BOOK_NAME_MIN_LENGTH = 1;
const BOOK_NAME_MAX_LENGTH = 255;
const BOOK_DESCRIPTION_MAX_LENGTH = 2000;
const SKU_MAX_LENGTH = 100;
const BARCODE_MAX_LENGTH = 100;
const TAG_MAX_LENGTH = 50;
const SPECIFICATION_NAME_MAX_LENGTH = 255;
const SPECIFICATION_VALUE_MAX_LENGTH = 1000;
const RATING_MIN = 0;
const RATING_MAX = 5;

// Base schemas
const ZBookImage = z.object({
  id: z.uuid('Invalid image ID format'),
  url: z.url('Invalid image URL format'),
  alt: z.string().max(255, 'Alt text too long').optional(),
  isMain: z.boolean().optional(),
});

export type TBookImage = z.infer<typeof ZBookImage>;

export const ZBookSpecification = z.object({
  id: z.uuid('Invalid specification ID format'),
  name: z
    .string()
    .min(1, 'Specification name is required')
    .max(
      SPECIFICATION_NAME_MAX_LENGTH,
      `Specification name must be less than ${SPECIFICATION_NAME_MAX_LENGTH} characters`,
    ),
  value: z
    .string()
    .min(1, 'Specification value is required')
    .max(
      SPECIFICATION_VALUE_MAX_LENGTH,
      `Specification value must be less than ${SPECIFICATION_VALUE_MAX_LENGTH} characters`,
    ),
});
export type TBookSpecification = z.infer<typeof ZBookSpecification>;

export const ZBook = z.object({
  id: z.uuid(),
  categoryId: z.uuid().optional().nullable(),
  subcategoryId: z.uuid().optional().nullable(),
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  description: z.string().optional().nullable(),
  price: z.coerce.number(),
  purchasePrice: z.coerce.number().optional().nullable(),
  images: z.array(ZBookImage).optional(),
  publisher: z.string().max(255, 'Publisher name too long').optional().nullable(),
  isbn: z.string().max(100, 'ISBN too long').optional().nullable(),
  author: z.string().max(255, 'Author name too long').optional().nullable(),
  inventoryQuantity: z.number().int().optional().nullable(),
  inventoryLowStockThreshold: z.number().int().optional().nullable(),
  status: z.enum(EBookStatus).default(EBookStatus.active),
  featured: z.boolean().default(false),
  rating: z.number().default(0),
  reviewCount: z.number().int().default(0),
  viewCount: z.number().int().default(0),
  saleCount: z.number().int().default(0),
  saleAmount: z.number().default(0),
  tags: z.array(z.string().max(50, 'Tag too long')),
  specifications: z.array(ZBookSpecification).optional(),
  expiresAt: z.coerce.date().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type TBook = z.infer<typeof ZBook>;

export const ZBookBasic = ZBook.pick({
  id: true,
  categoryId: true,
  subcategoryId: true,
  title: true,
  description: true,
  price: true,
  purchasePrice: true,
  images: true,
  publisher: true,
  isbn: true,
  author: true,
  inventoryQuantity: true,
  inventoryLowStockThreshold: true,
  specifications: true,
  tags: true,
  status: true,
  featured: true,
  rating: true,
  reviewCount: true,
  viewCount: true,
  saleCount: true,
  saleAmount: true,
  createdAt: true,
  updatedAt: true,
});
export type TBookBasic = z.infer<typeof ZBookBasic>;

export const ZCreateBook = z.object({
  categoryId: z.uuid('Invalid category ID').optional().nullable(),
  subcategoryId: z.uuid('Invalid subcategory ID').optional().nullable(),
  title: z
    .string()
    .min(BOOK_NAME_MIN_LENGTH, 'Book name is required')
    .max(
      BOOK_NAME_MAX_LENGTH,
      `Book name must be less than ${BOOK_NAME_MAX_LENGTH} characters`,
    ),
  description: z
    .string()
    .max(
      BOOK_DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${BOOK_DESCRIPTION_MAX_LENGTH} characters`,
    ).optional(),
  price: z.coerce
    .number()
    .min(0, 'Book price must be non-negative')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),
  purchasePrice: z.coerce
    .number()
    .min(0, 'Purchase price must be non-negative')
    .multipleOf(0.01, 'Purchase price must have at most 2 decimal places')
    .optional()
    .nullable(),
  images: z
    .array(ZBookImage)
    .min(1, 'At least one book image is required')
    .max(10, 'Maximum 10 images allowed')
    .optional(),
  publisher: z.string().max(255, 'Publisher name too long').optional().nullable(),
  isbn: z.string().max(100, 'ISBN too long').optional().nullable(),
  author: z.string().max(255, 'Author name too long').optional().nullable(),
  sku: z
    .string()
    .min(1, 'SKU is required')
    .max(SKU_MAX_LENGTH, `SKU must be less than ${SKU_MAX_LENGTH} characters`)
    .regex(
      /^[A-Z0-9-_]+$/,
      'SKU must contain only uppercase letters, numbers, hyphens, and underscores',
    )
    .optional(),
  barcode: z
    .string()
    .max(
      BARCODE_MAX_LENGTH,
      `Barcode must be less than ${BARCODE_MAX_LENGTH} characters`,
    )
    .optional(),
  inventoryQuantity: z
    .number()
    .int('Inventory quantity must be a whole number')
    .min(0, 'Inventory quantity must be non-negative')
    .optional()
    .nullable(),
  inventoryLowStockThreshold: z
    .number()
    .int('Low stock threshold must be a whole number')
    .min(0, 'Low stock threshold must be non-negative')
    .optional()
    .nullable(),
  specifications: z.array(ZBookSpecification).optional(),
  tags: z
    .array(z.string().min(1, 'Tag cannot be empty').max(TAG_MAX_LENGTH, `Tag must be less than ${TAG_MAX_LENGTH} characters`))
    .max(20, 'Maximum 20 tags allowed')
    .optional(),
});
export type TCreateBook = z.infer<typeof ZCreateBook>;

export const ZUpdateBook = z.object({
  categoryId: z.uuid('Invalid category ID').optional().nullable(),
  subcategoryId: z.uuid('Invalid subcategory ID').optional().nullable(),
  title: z
    .string()
    .min(BOOK_NAME_MIN_LENGTH, 'Book name is required')
    .max(
      BOOK_NAME_MAX_LENGTH,
      `Book name must be less than ${BOOK_NAME_MAX_LENGTH} characters`,
    )
    .optional(),
  description: z
    .string()
    .max(
      BOOK_DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${BOOK_DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional(),
  price: z.coerce
    .number()
    .min(0, 'Book price must be non-negative')
    .multipleOf(0.01, 'Price must have at most 2 decimal places')
    .optional(),
  purchasePrice: z.coerce
    .number()
    .min(0, 'Purchase price must be non-negative')
    .multipleOf(0.01, 'Purchase price must have at most 2 decimal places')
    .optional()
    .nullable(),
  images: z
    .array(ZBookImage)
    .min(1, 'At least one book image is required')
    .max(10, 'Maximum 10 images allowed')
    .optional(),
  publisher: z.string().max(255, 'Publisher name too long').optional().nullable(),
  isbn: z.string().max(100, 'ISBN too long').optional().nullable(),
  author: z.string().max(255, 'Author name too long').optional().nullable(),
  status: z
    .enum(EBookStatus, {
      message: 'Invalid book status',
    })
    .optional(),
  featured: z.boolean().optional(),
  sku: z
    .string()
    .min(1, 'SKU is required')
    .max(SKU_MAX_LENGTH, `SKU must be less than ${SKU_MAX_LENGTH} characters`)
    .regex(
      /^[A-Z0-9-_]+$/,
      'SKU must contain only uppercase letters, numbers, hyphens, and underscores',
    )
    .optional(),
  barcode: z
    .string()
    .max(
      BARCODE_MAX_LENGTH,
      `Barcode must be less than ${BARCODE_MAX_LENGTH} characters`,
    )
    .optional(),
  inventoryQuantity: z
    .number()
    .int('Inventory quantity must be a whole number')
    .min(0, 'Inventory quantity must be non-negative')
    .optional()
    .nullable(),
  inventoryLowStockThreshold: z
    .number()
    .int('Low stock threshold must be a whole number')
    .min(0, 'Low stock threshold must be non-negative')
    .optional()
    .nullable(),
  specifications: z.array(ZBookSpecification).optional(),
  tags: z.array(z.string().min(1, 'Tag cannot be empty').max(TAG_MAX_LENGTH, `Tag must be less than ${TAG_MAX_LENGTH} characters`))
    .max(20, 'Maximum 20 tags allowed')
    .optional(),
});
export type TUpdateBook = z.infer<typeof ZUpdateBook>;

export const ZBookQueryUnique = z.object({ id: z.uuid('Invalid book ID format') });
export type TBookQueryUnique = z.infer<typeof ZBookQueryUnique>;

export const ZBookQueryFilter = z.object({
  // Search parameters
  search: z
    .string()
    .min(1, 'Search term cannot be empty')
    .max(255, 'Search term too long')
    .optional(),

  // Pagination parameters
  page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce
    .number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10),

  // Filter parameters
  categoryName: z.string().optional(),
  subcategoryName: z.string().optional(),
  status: z
    .enum(EBookStatus, {
      message: 'Invalid book status',
    })
    .optional()
    .nullable(),
  featured: z.coerce.boolean().optional(),
  // Price range filters
  minPrice: z.coerce
    .number()
    .min(0, 'Minimum price must be non-negative')
    .optional(),
  maxPrice: z.coerce
    .number()
    .min(0, 'Maximum price must be non-negative')
    .optional(),

  // Rating filters
  minRating: z.coerce
    .number()
    .min(RATING_MIN, 'Minimum rating cannot be less than 0')
    .max(RATING_MAX, 'Minimum rating cannot exceed 5')
    .optional(),
  maxRating: z.coerce
    .number()
    .min(RATING_MIN, 'Maximum rating cannot be less than 0')
    .max(RATING_MAX, 'Maximum rating cannot exceed 5')
    .optional(),

  // Inventory filters
  inStock: z.coerce.boolean().optional(),
  lowStock: z.coerce.boolean().optional(),

  // Date filters
  createdAfter: z.coerce.date().optional(),
  createdBefore: z.coerce.date().optional(),
  updatedAfter: z.coerce.date().optional(),
  updatedBefore: z.coerce.date().optional(),

  // Tag filters
  tags: z
    .array(
      z
        .string()
        .min(1, 'Tag cannot be empty')
        .max(
          TAG_MAX_LENGTH,
          `Tag must be less than ${TAG_MAX_LENGTH} characters`,
        ),
    )
    .max(10, 'Maximum 10 tags allowed')
    .optional(),

  // Sorting parameters
  sortBy: z
    .enum([
      'title',
      'price',
      'rating',
      'reviewCount',
      'createdAt',
      'updatedAt',
      'featured',
    ])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
export type TBookQueryFilter = z.infer<typeof ZBookQueryFilter>;

export const ZBulkBook = z.object({
  update: z
    .array(
      z.object({
        id: z.uuid('Invalid book ID format'),
        status: z
          .enum(EBookStatus, {
            message: 'Invalid book status',
          })
          .optional(),
        featured: z.boolean().optional(),
        price: z.coerce
          .number()
          .min(0, 'Price must be non-negative')
          .multipleOf(0.01, 'Price must have at most 2 decimal places')
          .optional(),
        purchasePrice: z.coerce
          .number()
          .min(0, 'Purchase price must be non-negative')
          .multipleOf(0.01, 'Purchase price must have at most 2 decimal places')
          .optional()
          .nullable(),
        inventoryQuantity: z
          .number()
          .int('Inventory quantity must be a whole number')
          .min(0, 'Inventory quantity must be non-negative')
          .optional()
          .nullable(),
      }),
    )
    .max(100, 'Maximum 100 books can be updated at once'),
  delete: z
    .array(
      z.object({
        id: z.uuid('Invalid book ID format'),
      }),
    )
    .max(100, 'Maximum 100 books can be deleted at once'),
});
export type TBulkBook = z.infer<typeof ZBulkBook>;

// Additional utility schemas
export const ZBookSearch = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(255, 'Search query too long'),
  filters: ZBookQueryFilter.optional(),
});
export type TBookSearch = z.infer<typeof ZBookSearch>;

// Validation helpers
export const ZBookValidation = {
  // Price validation
  validatePrice: (price: number) => {
    return price >= 0 && Number.isFinite(price);
  },

  // SKU validation
  validateSKU: (sku: string) => {
    return /^[A-Z0-9-_]+$/.test(sku) && sku.length <= SKU_MAX_LENGTH;
  },

  // Rating validation
  validateRating: (rating: number) => {
    return (
      rating >= RATING_MIN && rating <= RATING_MAX && Number.isFinite(rating)
    );
  },
  // Tag validation
  validateTag: (tag: string) => {
    return tag.length > 0 && tag.length <= TAG_MAX_LENGTH;
  },
};

export const ZBookDetail = ZBook.extend({
});
export type TBookDetail = z.infer<typeof ZBookDetail>;

export const ZCreateBookSpecification = z.object({
  name: z
    .string()
    .min(1, 'Specification name is required')
    .max(
      SPECIFICATION_NAME_MAX_LENGTH,
      `Specification name must be less than ${SPECIFICATION_NAME_MAX_LENGTH} characters`,
    ),
  value: z
    .string()
    .min(1, 'Specification value is required')
    .max(
      SPECIFICATION_VALUE_MAX_LENGTH,
      `Specification value must be less than ${SPECIFICATION_VALUE_MAX_LENGTH} characters`,
    ),
});
export type TCreateBookSpecification = z.infer<
  typeof ZCreateBookSpecification
>;

export const ZUpdateBookSpecification = z.object({
  name: z
    .string()
    .min(1, 'Specification name is required')
    .max(
      SPECIFICATION_NAME_MAX_LENGTH,
      `Specification name must be less than ${SPECIFICATION_NAME_MAX_LENGTH} characters`,
    )
    .optional(),
  value: z
    .string()
    .min(1, 'Specification value is required')
    .max(
      SPECIFICATION_VALUE_MAX_LENGTH,
      `Specification value must be less than ${SPECIFICATION_VALUE_MAX_LENGTH} characters`,
    )
    .optional(),
});
export type TUpdateBookSpecification = z.infer<
  typeof ZUpdateBookSpecification
>;

export const ZBookSpecificationQueryUnique = z.object({
  id: z.uuid('Invalid specification ID format'),
});
export type TBookSpecificationQueryUnique = z.infer<
  typeof ZBookSpecificationQueryUnique
>;

export const ZBookSpecificationQueryFilter = z.object({
  bookId: z.uuid('Invalid book ID format').optional(),
  name: z
    .string()
    .min(1, 'Specification name cannot be empty')
    .max(
      SPECIFICATION_NAME_MAX_LENGTH,
      `Specification name must be less than ${SPECIFICATION_NAME_MAX_LENGTH} characters`,
    )
    .optional(),

  // Search parameters
  search: z
    .string()
    .min(1, 'Search term cannot be empty')
    .max(255, 'Search term too long')
    .optional(),

  // Pagination parameters
  page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce
    .number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10),

  // Sorting parameters
  sortBy: z.enum(['name', 'value', 'createdAt', 'updatedAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});
export type TBookSpecificationQueryFilter = z.infer<
  typeof ZBookSpecificationQueryFilter
>;

// Response schemas for API endpoints
export const ZBookListResponse = ZPaginationResponse(ZBookBasic.array());

export type TBookListResponse = z.infer<typeof ZBookListResponse>;

export const ZBookAnalytics = z.object({
  totalBooks: z.number().int().min(0),
  activeBooks: z.number().int().min(0),
  draftBooks: z.number().int().min(0),
  archivedBooks: z.number().int().min(0),
  featuredBooks: z.number().int().min(0),
  outOfStockBooks: z.number().int().min(0),
  lowStockBooks: z.number().int().min(0),
});
export type TBookAnalytics = z.infer<typeof ZBookAnalytics>;

export const ZBookDetailAnalytics = z.object({
  overview: z.object({
    averageRating: z.number().min(0).max(5),
    totalReviews: z.number().int().min(0),
    totalSales: z.number().int().min(0),
    totalRevenue: z.number().min(0),
    inventoryValue: z.number().min(0),
    lowStockItems: z.number().int().min(0),
  }),
  salesData: z.array(
    z.object({
      date: z.string(),
      sales: z.number().int().min(0),
      revenue: z.number().min(0),
    }),
  ),
  categoryBreakdown: z.array(
    z.object({
      category: z.string(),
      sales: z.number().int().min(0),
      percentage: z.number().min(0).max(100),
    }),
  ),
  monthlyTrends: z.array(
    z.object({
      month: z.string(),
      sales: z.number().int().min(0),
      revenue: z.number().min(0),
    }),
  ),
});
export type TBookDetailAnalytics = z.infer<typeof ZBookDetailAnalytics>;

export const ZSearchAnalyticsEvent = z.object({
  id: z.uuid('Invalid analytics event ID format'),
  query: z.string({
    message: 'Query must be a string',
  }),
  resultCount: z.number().optional(),
  filters: z
    .record(z.string(), z.any(), {
      message: 'Filters must be an object',
    })
    .optional(),
  source: z.enum(ESearchAnalyticsSource, {
    message: 'Invalid source',
  }),
  userId: z.string({
    message: 'User ID must be a string',
  }).optional().nullable(),
  searchCount: z.number().int().min(0).default(0),
  location: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
});
export type TSearchAnalyticsEvent = z.infer<typeof ZSearchAnalyticsEvent>;

export const ZSearchSuggestion = z.object({
  popularEvents: z.array(ZSearchAnalyticsEvent),
  trendingEvents: z.array(ZSearchAnalyticsEvent),
  recentEvents: z.array(ZSearchAnalyticsEvent),
});
export type TSearchSuggestion = z.infer<typeof ZSearchSuggestion>;


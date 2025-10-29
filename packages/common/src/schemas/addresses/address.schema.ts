import { z } from 'zod';

export const ZAddress = z.object({
  id: z.string(),
  userId: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});
export type TAddress = z.infer<typeof ZAddress>;

export const ZCreateAddress = z.object({
  street: z
    .string()
    .min(1, 'Street is required')
    .max(255, 'Street must be less than 255 characters'),
  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City must be less than 100 characters'),
  state: z
    .string()
    .min(1, 'State is required')
    .max(100, 'State must be less than 100 characters'),
  zipCode: z
    .string()
    .min(1, 'Zip code is required')
    .max(20, 'Zip code must be less than 20 characters'),
  country: z
    .string()
    .min(1, 'Country is required')
    .max(100, 'Country must be less than 100 characters'),
});
export type TCreateAddress = z.infer<typeof ZCreateAddress>;

export const ZUpdateAddress = z.object({
  street: z
    .string()
    .min(1, 'Street is required')
    .max(255, 'Street must be less than 255 characters')
    .optional(),
  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City must be less than 100 characters')
    .optional(),
  state: z
    .string()
    .min(1, 'State is required')
    .max(100, 'State must be less than 100 characters')
    .optional(),
  zipCode: z
    .string()
    .min(1, 'Zip code is required')
    .max(20, 'Zip code must be less than 20 characters')
    .optional(),
  country: z
    .string()
    .min(1, 'Country is required')
    .max(100, 'Country must be less than 100 characters')
    .optional(),
});
export type TUpdateAddress = z.infer<typeof ZUpdateAddress>;

export const ZAddressQueryFilter = z.object({
  // Search parameters
  search: z.string().optional(),

  // Pagination parameters
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),

  // User filter
  userId: z.string().optional(),

  // Sorting parameters
  sortBy: z
    .enum(['street', 'city', 'state', 'country', 'createdAt'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
export type TAddressQueryFilter = z.infer<typeof ZAddressQueryFilter>;

export const ZAddressQueryUnique = z.object({
  id: z.string().optional(),
});
export type TAddressQueryUnique = z.infer<typeof ZAddressQueryUnique>;

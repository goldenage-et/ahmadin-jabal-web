import { z } from 'zod';

// Category Image Schema
const ZCategoryImage = z.object({
  id: z.string(),
  url: z.string(),
  alt: z.string().optional(),
});

export type TCategoryImage = z.infer<typeof ZCategoryImage>;

export const ZCategory = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  image: ZCategoryImage.nullable().optional(),
  iconName: z.string().nullable().optional(),
  backgroundColor: z.string().nullable().optional(),
  parentId: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type TCategory = z.infer<typeof ZCategory>;

// Basic category type for lists
export const ZCategoryBasic = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  image: ZCategoryImage.nullable().optional(),
  iconName: z.string().nullable().optional(),
  backgroundColor: z.string().nullable().optional(),
  parentId: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type TCategoryBasic = z.infer<typeof ZCategoryBasic>;

// Create category schema
export const ZCreateCategory = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  image: ZCategoryImage.optional(),
  iconName: z.string().optional(),
  backgroundColor: z.string().optional(),
  parentId: z.string().optional(),
});
export type TCreateCategory = z.infer<typeof ZCreateCategory>;

// Update category schema
export const ZUpdateCategory = z.object({
  name: z.string().min(1, 'Category name is required').optional(),
  description: z.string().optional(),
  image: ZCategoryImage.optional(),
  iconName: z.string().optional(),
  backgroundColor: z.string().optional(),
  parentId: z.string().optional(),
});
export type TUpdateCategory = z.infer<typeof ZUpdateCategory>;

// Query schemas
export const ZCategoryQueryUnique = z.object({
  id: z.uuid(),
});
export type TCategoryQueryUnique = z.infer<typeof ZCategoryQueryUnique>;

export const ZCategoryQueryFilter = z.object({
  search: z.string().optional(),
  parentId: z.string().optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
});
export type TCategoryQueryFilter = z.infer<typeof ZCategoryQueryFilter>;

export const ZCategoryDetail = ZCategory.extend({});
export type TCategoryDetail = z.infer<typeof ZCategoryDetail>;

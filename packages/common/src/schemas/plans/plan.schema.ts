import { z } from 'zod';

export const ZPlan = z.object({
    id: z.uuid(),
    name: z.string(),
    description: z.string().nullable().optional(),
    price: z.number().min(0),
    currency: z.string().default('ETB'),
    durationDays: z.number().int().positive().nullable().optional(),
    isLifetime: z.boolean().default(false),
    features: z.record(z.string(), z.any()).nullable().optional(),
    active: z.boolean().default(true),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type TPlan = z.infer<typeof ZPlan>;

export const ZPlanBasic = ZPlan;
export type TPlanBasic = z.infer<typeof ZPlanBasic>;

export const ZCreatePlan = z.object({
    name: z.string().min(1, 'Plan name is required'),
    description: z.string().nullable().optional(),
    price: z.number().min(0, 'Price must be 0 or greater'),
    currency: z.string().default('ETB'),
    durationDays: z.number().int().positive().nullable().optional(),
    isLifetime: z.boolean().default(false),
    features: z.record(z.string(), z.any()).nullable().optional(),
    active: z.boolean().default(true),
}).refine(
    (data) => {
        // If not lifetime, durationDays must be provided
        if (!data.isLifetime && !data.durationDays) {
            return false;
        }
        // If lifetime, durationDays should be null
        if (data.isLifetime && data.durationDays !== null && data.durationDays !== undefined) {
            return false;
        }
        return true;
    },
    {
        message: 'For lifetime plans, durationDays must be null. For time-based plans, durationDays is required.',
    }
);

export type TCreatePlan = z.infer<typeof ZCreatePlan>;

export const ZUpdatePlan = z.object({
    name: z.string().min(1, 'Plan name is required').optional(),
    description: z.string().nullable().optional(),
    price: z.number().min(0, 'Price must be 0 or greater').optional(),
    currency: z.string().optional(),
    durationDays: z.number().int().positive().nullable().optional(),
    isLifetime: z.boolean().optional(),
    features: z.record(z.string(), z.any()).nullable().optional(),
    active: z.boolean().optional(),
}).refine(
    (data) => {
        // If isLifetime is being set, validate accordingly
        if (data.isLifetime !== undefined) {
            if (data.isLifetime && data.durationDays !== null && data.durationDays !== undefined) {
                return false;
            }
            if (!data.isLifetime && data.durationDays === null) {
                return false;
            }
        }
        return true;
    },
    {
        message: 'For lifetime plans, durationDays must be null. For time-based plans, durationDays is required.',
    }
);

export type TUpdatePlan = z.infer<typeof ZUpdatePlan>;

export const ZPlanQueryFilter = z.object({
    search: z.string().optional(),
    active: z.coerce.boolean().optional(),
    isLifetime: z.coerce.boolean().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sortBy: z.enum(['name', 'price', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type TPlanQueryFilter = z.infer<typeof ZPlanQueryFilter>;

export const ZPlanQueryUnique = z.object({
    id: z.uuid(),
});

export type TPlanQueryUnique = z.infer<typeof ZPlanQueryUnique>;


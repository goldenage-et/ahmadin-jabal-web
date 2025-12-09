import { z } from 'zod';
import { ESubscriptionStatus } from '../enums';

export const ZSubscription = z.object({
    id: z.uuid(),
    userId: z.uuid(),
    planId: z.uuid(),
    status: z.enum(ESubscriptionStatus),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable().optional(),
    paymentId: z.uuid().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type TSubscription = z.infer<typeof ZSubscription>;

export const ZSubscriptionWithPlan = ZSubscription.extend({
    plan: z.object({
        id: z.uuid(),
        name: z.string(),
        description: z.string().nullable().optional(),
        price: z.number(),
        currency: z.string(),
        durationDays: z.number().int().positive().nullable().optional(),
        isLifetime: z.boolean(),
        features: z.record(z.string(), z.any()).nullable().optional(),
    }),
});

export type TSubscriptionWithPlan = z.infer<typeof ZSubscriptionWithPlan>;

export const ZCreateSubscription = z.object({
    planId: z.uuid(),
    paymentId: z.uuid().optional(),
});

export type TCreateSubscription = z.infer<typeof ZCreateSubscription>;

export const ZUpdateSubscription = z.object({
    status: z.enum(ESubscriptionStatus).optional(),
    endDate: z.coerce.date().nullable().optional(),
});

export type TUpdateSubscription = z.infer<typeof ZUpdateSubscription>;

export const ZSubscriptionQueryFilter = z.object({
    userId: z.uuid().optional(),
    planId: z.uuid().optional(),
    status: z.enum(ESubscriptionStatus).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sortBy: z.enum(['startDate', 'endDate', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type TSubscriptionQueryFilter = z.infer<typeof ZSubscriptionQueryFilter>;

export const ZSubscriptionQueryUnique = z.object({
    id: z.uuid(),
});

export type TSubscriptionQueryUnique = z.infer<typeof ZSubscriptionQueryUnique>;


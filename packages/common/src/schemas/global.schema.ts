import { z } from 'zod';

export const ZPaginationQuery = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export const ZPagination = z.object({
  page: z.coerce.number().int().min(1),
  limit: z.coerce.number().int().min(1),
  total: z.coerce.number().int().min(0),
  totalPages: z.coerce.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export type TPagination = z.infer<typeof ZPagination>;

export type TPaginationQuery = z.infer<typeof ZPaginationQuery>;

export const ZPaginationResponse = <T>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    meta: ZPagination,
  });

export type TPaginationResponse<T> = {
  data: T;
  meta: TPagination;
}
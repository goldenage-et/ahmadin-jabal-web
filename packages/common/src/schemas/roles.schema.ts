import z from "zod";

export enum EResources {
  USER = "user",
  BOOK = "book",
  ORDER = "order",
  PAYMENT = "payment",
  ROLE = "role",
  SETTING = "setting",
}

export const ZRole = z.object({
  id: z.uuid(),
  name: z.string(),
  active: z.coerce.boolean(),
  permission: z.object({
    [EResources.USER]: z.object({
      create: z.boolean(),
      update: z.boolean(),
      viewOne: z.boolean(),
      viewMany: z.boolean(),
      delete: z.boolean(),
      active: z.boolean(),
    }),
    [EResources.SETTING]: z.object({
      update: z.boolean(),
      viewOne: z.boolean(),
      viewMany: z.boolean(),
    }),
    [EResources.ROLE]: z.object({
      create: z.boolean(),
      assign: z.boolean(),
      update: z.boolean(),
      viewOne: z.boolean(),
      viewMany: z.boolean(),
      delete: z.boolean(),
    }),
    [EResources.BOOK]: z.object({
      create: z.boolean(),
      update: z.boolean(),
      viewOne: z.boolean(),
      viewMany: z.boolean(),
      delete: z.boolean(),
      active: z.boolean(),
      featured: z.boolean(),
    }),
    [EResources.ORDER]: z.object({
      update: z.boolean(),
      viewOne: z.boolean(),
      viewMany: z.boolean(),
      delete: z.boolean(),
    }),
    [EResources.PAYMENT]: z.object({
      update: z.boolean(),
      viewOne: z.boolean(),
      viewMany: z.boolean(),
    }),
  })
})

export type TRole = z.infer<typeof ZRole>;

export const ZCreateRole = ZRole.omit({ id: true });
export type TCreateRole = z.infer<typeof ZCreateRole>;

export const ZUpdateRole = ZRole.partial().omit({ id: true });
export type TUpdateRole = z.infer<typeof ZUpdateRole>;
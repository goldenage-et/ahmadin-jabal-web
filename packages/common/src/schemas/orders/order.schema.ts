import { z } from 'zod';
import {
  EOrderStatus,
  EPaymentMethod,
  EPaymentStatus,
  EShippingMethod,
} from '../enums';
import { ZUserBasic } from '../users/user.schema';

export const ZOrderStatusHistory = z.object({
  id: z.uuid(),
  status: z.enum(EOrderStatus),
  notes: z.string().nullable().optional(),
  updatedBy: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
  }),
  createdAt: z.coerce.date(),
});
export type TOrderStatusHistory = z.infer<typeof ZOrderStatusHistory>;

export const ZOrder = z.object({
  id: z.string(),
  userId: z.uuid(),
  storeId: z.uuid().optional(),
  orderNumber: z.string(),
  status: z.enum(EOrderStatus),
  quantity: z.coerce.number(),
  paymentStatus: z.enum(EPaymentStatus),
  paymentMethod: z.enum(EPaymentMethod),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
  subtotal: z.coerce.number(),
  tax: z.coerce.number(),
  shipping: z.coerce.number(),
  discount: z.coerce.number(),
  total: z.coerce.number(),
  currency: z.string(),
  shippingMethod: z.enum(['standard', 'express', 'pickup']),
  trackingNumber: z.string().nullable().optional(),
  estimatedDelivery: z.coerce.date().optional(),
  notes: z.string().nullable().optional(),
  customerNotes: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  statusHistory: z.array(ZOrderStatusHistory).optional(),
});
export type TOrder = z.infer<typeof ZOrder>;

export const ZOrderMini = ZOrder.omit({
  items: true,
  subtotal: true,
  tax: true,
  shipping: true,
  discount: true,
  quantity: true,
  notes: true,
  customerNotes: true,
  statusHistory: true,
  shippingAddress: true,
});
export type TOrderMini = z.infer<typeof ZOrderMini>;

export const ZOrderBasic = ZOrder.omit({
  items: true,
  subtotal: true,
  tax: true,
  shipping: true,
  discount: true,
  notes: true,
  customerNotes: true,
  trackingNumber: true,
  estimatedDelivery: true,
  statusHistory: true,
  shippingAddress: true,
}).extend({
  user: ZUserBasic,
  totalItems: z.coerce.number(),
});
export type TOrderBasic = z.infer<typeof ZOrderBasic>;

export const ZOrderDetail = ZOrder.extend({
  user: ZUserBasic,
});
export type TOrderDetail = z.infer<typeof ZOrderDetail>;

// Create Order Schema
export const ZCreateOrder = z.object({
  bookId: z.string(),
  status: z.enum(EOrderStatus).optional(),
  quantity: z.coerce.number().min(1),
  paymentStatus: z.enum(EPaymentStatus).optional(),
  paymentMethod: z.enum(EPaymentMethod),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
  price: z.coerce.number().min(0),
  total: z.coerce.number().optional(),
  subtotal: z.coerce.number().optional(),
  tax: z.coerce.number().optional(),
  shipping: z.coerce.number().optional(),
  discount: z.coerce.number().optional(),
  currency: z.string().optional(),
  shippingMethod: z.enum(['standard', 'express', 'pickup']).optional(),
  notes: z.string().nullable().optional(),
  customerNotes: z.string().nullable().optional(),
});
export type TCreateOrder = z.infer<typeof ZCreateOrder>;

// Update Order Schema
export const ZUpdateOrder = z.object({
  status: z.enum(EOrderStatus).optional(),
  paymentStatus: z.enum(EPaymentStatus).optional(),
  paymentMethod: z.enum(EPaymentMethod).optional(),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }).optional(),
  total: z.coerce.number().optional(),
  subtotal: z.coerce.number().optional(),
  tax: z.coerce.number().optional(),
  shipping: z.coerce.number().optional(),
  discount: z.coerce.number().optional(),
  currency: z.string().optional(),
  shippingMethod: z.enum(EShippingMethod).optional(),
  trackingNumber: z.string().nullable().optional(),
  estimatedDelivery: z.coerce.date().optional(),
  notes: z.string().nullable().optional(),
  customerNotes: z.string().nullable().optional(),
});
export type TUpdateOrder = z.infer<typeof ZUpdateOrder>;

// Order Query Filter Schema
export const ZOrderQueryFilter = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  status: z.enum(EOrderStatus).optional(),
  paymentStatus: z.enum(EPaymentStatus).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'total', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
export type TOrderQueryFilter = z.infer<typeof ZOrderQueryFilter>;

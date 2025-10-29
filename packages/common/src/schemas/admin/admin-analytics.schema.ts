import { z } from 'zod';

// Admin Dashboard Statistics Schema
export const ZAdminDashboardStats = z.object({
  totalRevenue: z.number(),
  totalOrders: z.number(),
  totalCustomers: z.number(),
  avgOrderValue: z.number(),
  monthlyGrowth: z.number(),
});

export type TAdminDashboardStats = z.infer<typeof ZAdminDashboardStats>;

// Revenue Trend Data Schema
export const ZRevenueTrendData = z.object({
  month: z.string(),
  revenue: z.number(),
  orders: z.number(),
});

export type TRevenueTrendData = z.infer<typeof ZRevenueTrendData>;

// Recent Order Schema
export const ZRecentOrder = z.object({
  id: z.string(),
  orderNumber: z.string(),
  quantity: z.number(),
  customer: z.string(),
  amount: z.number(),
  status: z.string(),
  date: z.string(),
});

export type TRecentOrder = z.infer<typeof ZRecentOrder>;

// Category Data Schema
export const ZCategoryData = z.object({
  name: z.string(),
  value: z.number(),
  color: z.string(),
});

export type TCategoryData = z.infer<typeof ZCategoryData>;
// Order Analytics Schema
export const ZOrderAnalytics = z.object({
  totalOrders: z.number(),
  completedOrders: z.number(),
  pendingOrders: z.number(),
  cancelledOrders: z.number(),
  totalRevenue: z.number(),
  avgOrderValue: z.number(),
  conversionRate: z.number(),
  orderStatusDistribution: z.record(z.string(), z.number()),
  dailyOrders: z.array(
    z.object({
      date: z.string(),
      orders: z.number(),
      revenue: z.number(),
    }),
  ),
});

export type TOrderAnalytics = z.infer<typeof ZOrderAnalytics>;

// Customer Analytics Schema
export const ZCustomerAnalytics = z.object({
  totalCustomers: z.number(),
  activeCustomers: z.number(),
  newCustomers: z.number(),
  returningCustomers: z.number(),
  customerGrowthRate: z.number(),
  avgCustomerValue: z.number(),
  topCustomers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      totalSpent: z.number(),
      orderCount: z.number(),
      lastOrderDate: z.date(),
    }),
  ),
});

export type TCustomerAnalytics = z.infer<typeof ZCustomerAnalytics>;

// Admin Product Analytics Schema
export const ZAdminProductAnalytics = z.object({
  totalProducts: z.number(),
  activeProducts: z.number(),
  lowStockProducts: z.number(),
  outOfStockProducts: z.number(),
  topSellingProducts: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      sales: z.number(),
      revenue: z.number(),
      rating: z.number(),
    }),
  ),
  categoryDistribution: z.array(ZCategoryData),
});

export type TAdminProductAnalytics = z.infer<typeof ZAdminProductAnalytics>;

// Admin Analytics Summary Schema
export const ZAdminAnalyticsSummary = z.object({
  dashboard: ZAdminDashboardStats,
  revenueTrend: z.array(ZRevenueTrendData),
  recentOrders: z.array(ZRecentOrder),
  categoryDistribution: z.array(ZCategoryData),
  orderAnalytics: ZOrderAnalytics,
  customerAnalytics: ZCustomerAnalytics,
  productAnalytics: ZAdminProductAnalytics,
});

export type TAdminAnalyticsSummary = z.infer<typeof ZAdminAnalyticsSummary>;

// Admin Dashboard Filters Schema
export const ZAdminDashboardFilters = z.object({
  dateRange: z
    .object({
      startDate: z.date(),
      endDate: z.date(),
    })
    .optional(),
  categories: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'pending', 'all']).optional(),
  sortBy: z
    .enum(['revenue', 'orders', 'growth', 'name', 'createdAt'])
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type TAdminDashboardFilters = z.infer<typeof ZAdminDashboardFilters>;

// Admin Report Schema
export const ZAdminReport = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum([
    'dashboard',
    'orders',
    'customers',
    'products',
    'custom',
  ]),
  filters: ZAdminDashboardFilters,
  generatedAt: z.date(),
  generatedBy: z.string(),
  data: z.any(), // Flexible data structure for different report types
});

export type TAdminReport = z.infer<typeof ZAdminReport>;

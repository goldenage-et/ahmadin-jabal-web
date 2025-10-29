import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import { Inject, Injectable } from '@nestjs/common';
import {
  EBookStatus,
  EOrderStatus,
  TAdminDashboardStats,
  TCategoryData,
  TRecentOrder,
  TRevenueTrendData,
  seededRandom
} from '@repo/common';
import { PrismaClient } from '@repo/prisma';

@Injectable()
export class AdminService {
  constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) { }

  async getDashboardAnalytics(): Promise<TAdminDashboardStats> {
    // Get total revenue, total orders, avg order value using prisma aggregate
    const revenueAggregate = await this.db.order.aggregate({
      _sum: { total: true },
      _count: { _all: true },
      _avg: { total: true },
      where: { status: EOrderStatus.delivered },
    });

    // Get total customers and categories
    const [totalCustomers] = await Promise.all([
      this.db.user.count(),
    ]);

    // Calculate monthly growth (last 30 days vs previous 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(now.getDate() - 60);

    const [currentMonthAggregate, previousMonthAggregate] = await Promise.all([
      this.db.order.aggregate({
        _sum: { total: true },
        where: {
          status: EOrderStatus.delivered,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      this.db.order.aggregate({
        _sum: { total: true },
        where: {
          status: EOrderStatus.delivered,
          createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        },
      }),
    ]);

    const currentMonthRevenue = Number(currentMonthAggregate._sum.total ?? 0);
    const previousMonthRevenue = Number(previousMonthAggregate._sum.total ?? 0);

    const monthlyGrowth =
      previousMonthRevenue > 0
        ? ((currentMonthRevenue - previousMonthRevenue) /
          previousMonthRevenue) *
        100
        : 0;

    return {
      totalRevenue: Number(revenueAggregate._sum.total ?? 0),
      totalOrders: revenueAggregate._count._all,
      totalCustomers,
      avgOrderValue: Number(revenueAggregate._avg.total ?? 0),
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
    };
  }


  async getRevenueTrend(): Promise<TRevenueTrendData[]> {
    // Get revenue data for the last 12 months
    const revenueData: TRevenueTrendData[] = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );
      const monthEnd = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i + 1,
        0,
      );

      const aggregate = await this.db.order.aggregate({
        _sum: { total: true },
        _count: { _all: true },
        where: {
          status: EOrderStatus.delivered,
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });

      revenueData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        revenue: Number(aggregate._sum.total ?? 0),
        orders: aggregate._count._all,
      });
    }

    return revenueData;
  }

  async getRecentOrders(): Promise<TRecentOrder[]> {
    const orders = await this.db.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      amount: Number(order.total ?? 0),
      status: order.status,
      date: order.createdAt.toISOString().split('T')[0],
      quantity: order.quantity,
      customer: order.userId,
    }));
  }

  async getCategoryDistribution(): Promise<TCategoryData[]> {
    // Use real data for category distribution
    // Assume stores have a categoryId and there's a Category table with name and color
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];
    // Fetch the count of stores grouped by categoryId
    const categoryDistribution = await this.db.book.groupBy({
      by: ['categoryId'],
      _count: {
        _all: true,
      },
      where: {
        status: EBookStatus.active,
      },
    });

    // Fetch all categories to map IDs to names and colors
    const categories = await this.db.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // Map grouping results to response format
    const categoryMap: Record<string, { name: string; color: string }> = {};
    for (const cat of categories) {
      const color = seededRandom(cat.id, 0, COLORS.length - 1);
      categoryMap[cat.id] = { name: cat.name, color: COLORS[color] };
    }

    const result = categoryDistribution.map((item) => {
      const color = seededRandom(item.categoryId, 0, COLORS.length - 1);
      const cat = categoryMap[item.categoryId];
      return {
        name: cat?.name ?? 'Uncategorized',
        value: item._count._all,
        color: COLORS[color],
      };
    });

    // Optionally include categories with 0 stores as well
    for (const cat of categories) {
      const color = seededRandom(cat.id, 0, COLORS.length - 1);
      if (!result.find((r) => r.name === cat.name)) {
        result.push({
          name: cat.name,
          value: 0,
          color: COLORS[color],
        });
      }
    }
    return result;
  }
}


import { UserAuthGuard } from '@/guards/auth.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  TAdminDashboardStats,
  TCategoryData,
  TRecentOrder,
  TRevenueTrendData,
  TSession
} from '@repo/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) { }

  @Get()
  @UseGuards(UserAuthGuard)
  async getDashboardAnalytics(): Promise<TAdminDashboardStats> {
    return this.adminService.getDashboardAnalytics();
  }

  @Get('revenue-trend')
  @UseGuards(UserAuthGuard)
  async getRevenueTrend(): Promise<TRevenueTrendData[]> {
    return this.adminService.getRevenueTrend();
  }

  @Get('orders-recent')
  @UseGuards(UserAuthGuard)
  async getRecentOrders(): Promise<TRecentOrder[]> {
    return this.adminService.getRecentOrders();
  }

  @Get('categories-distribution')
  @UseGuards(UserAuthGuard)
  async getCategoryDistribution(): Promise<TCategoryData[]> {
    return this.adminService.getCategoryDistribution();
  }
}

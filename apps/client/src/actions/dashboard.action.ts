'use server';

import { api } from '@/lib/api';

import { TAdminDashboardStats } from '@repo/common';

// Get dashboard statistics from analytics endpoint
export async function getDashboardStats(): Promise<TAdminDashboardStats> {
  try {
    const response = await api.get<TAdminDashboardStats>('/admin/analytics/dashboard');
    if (response.error) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        avgOrderValue: 0,
        monthlyGrowth: 0,
      }
    }
    return response;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

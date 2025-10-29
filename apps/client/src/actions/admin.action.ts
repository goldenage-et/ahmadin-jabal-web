'use server';

import { api } from '@/lib/api';
import {
  TAdminDashboardStats,
  TCategoryData,
  TRecentOrder,
  TRevenueTrendData,
} from '@repo/common';

// Admin Analytics API functions
export async function getAdminDashboardStats(): Promise<TAdminDashboardStats> {
  const response = await api.get<TAdminDashboardStats>(
    '/admin',
  );
  if ('error' in response) throw response;
  return response;
}


export async function getRevenueTrend(): Promise<TRevenueTrendData[]> {
  const response = await api.get<TRevenueTrendData[]>(
    '/admin/revenue-trend',
  );
  if ('error' in response) throw response;
  return response;
}

export async function getRecentOrders(): Promise<TRecentOrder[]> {
  const response = await api.get<TRecentOrder[]>(
    '/admin/orders-recent',
  );
  if ('error' in response) throw response;
  return response;
}

export async function getCategoryDistribution(): Promise<TCategoryData[]> {
  const response = await api.get<TCategoryData[]>(
    '/admin/categories-distribution',
  );
  if ('error' in response) throw response;
  return response;
}

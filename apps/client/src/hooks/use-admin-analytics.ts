'use client';

import { useState, useEffect } from 'react';
import {
  getAdminDashboardStats,
  getTopPerformingStores,
  getRevenueTrend,
  getRecentOrders,
  getCategoryDistribution,
} from '@/app/_actions/admin-analytics.action';
import {
  TAdminDashboardStats,
  TTopPerformingStore,
  TRevenueTrendData,
  TRecentOrder,
  TCategoryData,
} from '@repo/common';

export function useAdminAnalytics() {
  const [dashboardStats, setDashboardStats] =
    useState<TAdminDashboardStats | null>(null);
  const [topStores, setTopStores] = useState<TTopPerformingStore[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<TRevenueTrendData[]>([]);
  const [recentOrders, setRecentOrders] = useState<TRecentOrder[]>([]);
  const [categoryData, setCategoryData] = useState<TCategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [stats, stores, trend, orders, categories] = await Promise.all([
        getAdminDashboardStats(),
        getTopPerformingStores(),
        getRevenueTrend(),
        getRecentOrders(),
        getCategoryDistribution(),
      ]);

      setDashboardStats(stats);
      setTopStores(stores);
      setRevenueTrend(trend);
      setRecentOrders(orders);
      setCategoryData(categories);
    } catch (err) {
      console.error('Error fetching admin analytics:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch analytics data',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const refetch = () => {
    fetchAllData();
  };

  return {
    dashboardStats,
    topStores,
    revenueTrend,
    recentOrders,
    categoryData,
    loading,
    error,
    refetch,
  };
}

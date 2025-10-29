import { getAdminDashboardStats, getCategoryDistribution, getRecentOrders, getRevenueTrend } from '../../../actions/admin.action';
import AdminDashboard from '../../../features/admin/admin-dashboard';

export default async function Page() {
  const [stats, trend, orders, categories] = await Promise.all([
    getAdminDashboardStats(),
    getRevenueTrend(),
    getRecentOrders(),
    getCategoryDistribution(),
  ]);


  return (
    <AdminDashboard
      dashboardStats={stats}
      revenueTrend={trend}
      recentOrders={orders}
      categoryData={categories}
    />
  );
}

import { PageHeader } from '@/components';
import { OrdersContent } from '../components/orders-content';
import { getMyOrders } from '@/actions/profile.action';

export default async function OrdersPage() {
  const ordersData = await getMyOrders();
  if (!ordersData || 'error' in ordersData) {
    throw ordersData.error
  }
  return (
    <div className='min-h-screen w-full max-w-7xl mx-auto py-6'>
      <PageHeader
        title='My Orders'
        description='View your orders and track your shipments'
      />
      <OrdersContent ordersData={ordersData} />
    </div>
  );
}

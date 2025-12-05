import { getPayments } from '@/actions/payment.action';
import { getMyOrderDetails } from '@/actions/profile.action';
import { notFound } from 'next/navigation';
import { OrderDetailsContent } from '@/features/portfolio/order-details-content';
import { PageHeader } from '@/components';

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getMyOrderDetails(id);
  if (!order || 'error' in order) {
    return notFound()
  }
  const paymentsResponse = await getPayments({ orderId: id });
  if ('error' in paymentsResponse || !('payments' in paymentsResponse)) {
    return notFound()
  }
  const payments = paymentsResponse.payments || [];

  return (
    <div className='min-h-screen w-full max-w-7xl mx-auto py-6'>
      <OrderDetailsContent order={order} payments={payments} />
    </div>
  );
}

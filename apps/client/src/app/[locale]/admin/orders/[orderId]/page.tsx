import { getPayments } from '@/actions/payment.action';
import { getOrder } from '@/features/orders/actions/order.action';
import { OrderManagement } from '@/features/orders/components/order-management';
import { OrderTimeline } from '@/features/orders/components/order-timeline';
import { PaymentsList } from './_components/payments-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EOrderStatus, EPaymentStatus, TOrderDetail, TPayment, isErrorResponse } from '@repo/common';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Truck,
  User,
  XCircle,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

const statusColors = {
  [EOrderStatus.pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  [EOrderStatus.confirmed]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  [EOrderStatus.processing]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  [EOrderStatus.shipped]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
  [EOrderStatus.delivered]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  [EOrderStatus.cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  [EOrderStatus.refunded]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
};

const paymentStatusColors = {
  [EPaymentStatus.pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  [EPaymentStatus.paid]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  [EPaymentStatus.failed]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  [EPaymentStatus.refunded]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
};

const statusIcons = {
  [EOrderStatus.pending]: Clock,
  [EOrderStatus.confirmed]: CheckCircle,
  [EOrderStatus.processing]: Package,
  [EOrderStatus.shipped]: Truck,
  [EOrderStatus.delivered]: CheckCircle,
  [EOrderStatus.cancelled]: XCircle,
  [EOrderStatus.refunded]: AlertCircle,
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { orderId } = await params;

  // Fetch order data on the server
  const orderResponse = await getOrder(orderId);
  const paymentResponse = await getPayments({ orderId });

  // Handle the response properly
  if (!orderResponse || isErrorResponse(orderResponse) || !paymentResponse || isErrorResponse(paymentResponse)) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-foreground dark:text-foreground mb-4'>
            Order not found
          </h2>
          <Button asChild>
            <Link href='/admin/orders'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Orders
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const order: TOrderDetail = orderResponse;
  const payments: TPayment[] = paymentResponse?.payments || [];

  // Check if this is a subscription order
  const isSubscriptionOrder = !!order.planId;

  const formatCurrency = (amount: number, currency: string = 'ETB') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const getStatusIcon = (status: EOrderStatus) => {
    const Icon = statusIcons[status];
    return <Icon className='h-4 w-4' />;
  };

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <Button variant='ghost' size='sm' asChild>
        <Link href='/admin/orders'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back to Orders
        </Link>
      </Button>
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-foreground dark:text-foreground'>
              {order.orderNumber}
            </h1>
            <p className='text-muted-foreground dark:text-muted-foreground'>Order Details</p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Badge className={statusColors[order.status]}>
            {getStatusIcon(order.status)}
            <span className='ml-1'>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </Badge>
          <Badge className={paymentStatusColors[order.paymentStatus]}>
            {order.paymentStatus.charAt(0).toUpperCase() +
              order.paymentStatus.slice(1)}
          </Badge>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Content */}
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div>
                <p className='font-medium'>
                  {order.user?.firstName} {order.user?.lastName}
                </p>
                <p className='text-sm text-gray-500'>{order.user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plan Info - Only show for subscription orders */}
        {isSubscriptionOrder && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Sparkles className='h-5 w-5' />
                Subscription Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-sm'>
                <p className='font-medium text-foreground'>Subscription Order</p>
                <p className='text-muted-foreground mt-1'>
                  Plan ID: <span className='font-mono'>{order.planId}</span>
                </p>
                <p className='text-muted-foreground mt-2'>
                  No physical shipping required. Subscription will be activated after payment confirmation.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shipping Address - Only show for book orders */}
        {!isSubscriptionOrder && order.shippingAddress && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <MapPin className='h-5 w-5' />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-sm'>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CreditCard className='h-5 w-5' />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span>Method</span>
                <span className='capitalize'>{order.paymentMethod}</span>
              </div>
              <div className='flex justify-between'>
                <span>Status</span>
                <Badge className={paymentStatusColors[order.paymentStatus]}>
                  {order.paymentStatus.charAt(0).toUpperCase() +
                    order.paymentStatus.slice(1)}
                </Badge>
              </div>
              <div className='flex justify-between'>
                <span>Amount</span>
                <span className='font-medium'>
                  {formatCurrency(order.total, order.currency)}
                </span>
              </div>
              {isSubscriptionOrder && (
                <div className='pt-2 border-t'>
                  <p className='text-xs text-muted-foreground'>
                    Subscription payment - activates subscription upon confirmation
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <div className='lg:col-span-2 space-y-6'>
          {/* Payments List */}
          <PaymentsList payments={payments} orderCurrency={order.currency} />

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{isSubscriptionOrder ? 'Subscription Summary' : 'Order Summary'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal, order.currency)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax, order.currency)}</span>
                </div>
                {!isSubscriptionOrder && (
                  <div className='flex justify-between'>
                    <span>Shipping</span>
                    <span>{formatCurrency(order.shipping, order.currency)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className='flex justify-between text-green-600'>
                    <span>Discount</span>
                    <span>
                      -{formatCurrency(order.discount, order.currency)}
                    </span>
                  </div>
                )}
                <Separator />
                <div className='flex justify-between font-bold text-lg'>
                  <span>Total</span>
                  <span>{formatCurrency(order.total, order.currency)}</span>
                </div>
                {isSubscriptionOrder && (
                  <div className='pt-2 border-t'>
                    <p className='text-xs text-muted-foreground'>
                      Subscription orders have no shipping charges
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Order Management */}
          <OrderManagement order={order} />

          {/* Order Timeline */}
          <OrderTimeline order={order} />
        </div>
      </div>
    </div>
  );
}

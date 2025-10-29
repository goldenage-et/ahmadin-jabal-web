import { getOrders } from '@/features/orders/actions/order.action';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EOrderStatus, TOrderBasic, TOrderQueryFilter } from '@repo/common';
import { Clock, DollarSign, Download, Package, Truck } from 'lucide-react';
import { OrdersFilters } from '../../../../features/orders/components/orders-filters';
import { OrdersPagination } from '../../../../features/orders/components/orders-pagination';
import { OrdersTable } from '../../../../features/orders/components/orders-table';

interface OrdersPageProps {
  searchParams: Promise<TOrderQueryFilter>;
}

export default async function OrdersPage({
  searchParams: searchParamsPromise,
}: OrdersPageProps) {
  // Parse search params to create filters
  const searchParams = await searchParamsPromise;
  const ordersData = await getOrders(searchParams as TOrderQueryFilter);

  // Handle the response properly
  if (!ordersData || ordersData.error) {
    throw new Error(ordersData.message);
  }

  const { orders, total } = ordersData;

  const formatCurrency = (amount: number, currency: string = 'ETB') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const totalPages = Math.ceil(total / (searchParams.limit || 10));

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Orders</h1>
          <p className='text-gray-600'>Manage and track customer orders</p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm'>
            <Download className='h-4 w-4 mr-2' />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <Package className='h-6 w-6 text-blue-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Total Orders
                </p>
                <p className='text-2xl font-bold text-gray-900'>{total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <DollarSign className='h-6 w-6 text-green-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Total Revenue
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(
                    orders.reduce(
                      (sum: number, order: TOrderBasic) => sum + order.total,
                      0,
                    ),
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-yellow-100 rounded-lg'>
                <Clock className='h-6 w-6 text-yellow-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Pending Orders
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {
                    orders.filter(
                      (order: TOrderBasic) =>
                        order.status === EOrderStatus.pending,
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-purple-100 rounded-lg'>
                <Truck className='h-6 w-6 text-purple-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Shipped Orders
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {
                    orders.filter(
                      (order: TOrderBasic) =>
                        order.status === EOrderStatus.shipped,
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <OrdersFilters currentFilters={searchParams} />

      {/* Orders Table */}
      <OrdersTable orders={orders} total={total} />

      {/* Pagination */}
      {totalPages > 1 && (
        <OrdersPagination
          currentPage={searchParams.page || 1}
          totalPages={totalPages}
          total={total}
          limit={searchParams.limit || 10}
        />
      )}
    </div>
  );
}

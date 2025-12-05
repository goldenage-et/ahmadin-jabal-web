'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TOrderBasic, EOrderStatus, EPaymentStatus } from '@repo/common';
import {
  Search,
  FileText,
  Trash2,
  Filter,
  X,
  SortAsc,
  SortDesc,
  CreditCard
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getMyOrders } from '@/actions/profile.action';
import { TOrderQueryFilter } from '@repo/common';
import { OrderTrackingModal } from './order-tracking-modal';

export function OrdersContent({ ordersData }: {
  ordersData: {
    orders: TOrderBasic[];
    total: number;
  }
}) {
  const [activeOrderTab, setActiveOrderTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('');

  // Build query parameters for backend filtering
  const buildQueryParams = (): TOrderQueryFilter => {
    const query: TOrderQueryFilter = {
      page: 1,
      limit: 50,
      sortBy: sortBy === 'newest' ? 'createdAt' : sortBy === 'oldest' ? 'createdAt' : 'createdAt',
      sortOrder: sortBy === 'oldest' ? 'asc' : 'desc',
    };

    // Add search term
    if (searchTerm.trim()) {
      query.search = searchTerm.trim();
    }

    // Add order status filter based on active tab
    if (activeOrderTab !== 'all') {
      switch (activeOrderTab) {
        case 'to_pay':
          query.paymentStatus = EPaymentStatus.pending;
          break;
        case 'to_ship':
          query.status = EOrderStatus.confirmed;
          break;
        case 'shipped':
          query.status = EOrderStatus.shipped;
          break;
        case 'processed':
          query.status = EOrderStatus.delivered;
          break;
      }
    }

    // Add payment status filter
    if (paymentStatusFilter !== 'all') {
      query.paymentStatus = paymentStatusFilter as EPaymentStatus;
    }

    // Add time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (timeFilter) {
        case 'last_month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        case 'last_3_months':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          break;
        case 'last_6_months':
          startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          break;
        case 'last_year':
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
        default:
          startDate = new Date(0);
      }

      query.startDate = startDate.toISOString();
    }

    return query;
  };

  const totalOrders = ordersData?.total || 0;
  const orders = ordersData?.orders || [];

  const orderTabs = [
    { id: 'all', label: 'View all' },
    { id: 'to_pay', label: 'To pay' },
    { id: 'to_ship', label: 'To ship' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'processed', label: 'Processed' },
  ];

  const getOrderStatusColor = (status: EOrderStatus) => {
    switch (status) {
      case EOrderStatus.pending:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case EOrderStatus.confirmed:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case EOrderStatus.processing:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case EOrderStatus.shipped:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100';
      case EOrderStatus.delivered:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case EOrderStatus.cancelled:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case EOrderStatus.refunded:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getPaymentStatusColor = (status: EPaymentStatus) => {
    switch (status) {
      case EPaymentStatus.pending:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case EPaymentStatus.paid:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case EPaymentStatus.failed:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case EPaymentStatus.refunded:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  // Orders are now filtered and sorted by the backend
  const filteredOrders = orders;

  return (
    <div className='space-y-6'>
      {/* Breadcrumb */}
      <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
        <Link href='/' className='hover:text-gray-700'>Home</Link>
        <span>›</span>
        <Link href='/profile' className='hover:text-muted-foreground'>Account</Link>
        <span>›</span>
        <span className='text-foreground font-medium'>Orders</span>
      </div>

      {/* Order Tabs */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='flex space-x-1 bg-primary/10 p-1 rounded-lg overflow-x-auto'>
          {orderTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveOrderTab(tab.id)}
              className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeOrderTab === tab.id
                ? 'bg-primary/10 text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className='flex items-center space-x-2'>
          <Button variant='outline' size='sm' className='text-xs sm:text-sm'>
            <Trash2 className='h-4 w-4 mr-1 sm:mr-2' />
            <span className='hidden sm:inline'>Deleted orders</span>
            <span className='sm:hidden'>Deleted</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='space-y-4'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search orders, books, or SKU...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 pr-12'
            />
            {searchTerm && (
              <Button
                size='sm'
                variant='ghost'
                className='absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0'
                onClick={() => setSearchTerm('')}
              >
                <X className='h-4 w-4' />
              </Button>
            )}
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowFilters(!showFilters)}
              className='flex items-center gap-2'
            >
              <Filter className='h-4 w-4' />
              Filters
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className='w-[140px]'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='newest'>Newest first</SelectItem>
                <SelectItem value='oldest'>Oldest first</SelectItem>
                <SelectItem value='total_high'>Highest total</SelectItem>
                <SelectItem value='total_low'>Lowest total</SelectItem>
                <SelectItem value='status'>By status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className='p-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div>
                <label className='text-sm font-medium mb-2 block'>Time Period</label>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select time period' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All time</SelectItem>
                    <SelectItem value='last_month'>Last month</SelectItem>
                    <SelectItem value='last_3_months'>Last 3 months</SelectItem>
                    <SelectItem value='last_6_months'>Last 6 months</SelectItem>
                    <SelectItem value='last_year'>Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className='text-sm font-medium mb-2 block'>Payment Status</label>
                <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder='Payment status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All payments</SelectItem>
                    <SelectItem value='pending'>Pending</SelectItem>
                    <SelectItem value='paid'>Paid</SelectItem>
                    <SelectItem value='failed'>Failed</SelectItem>
                    <SelectItem value='refunded'>Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='sm:col-span-2 flex items-end'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setTimeFilter('all');
                    setPaymentStatusFilter('all');
                    setSearchTerm('');
                    setSortBy('newest');
                  }}
                  className='w-full sm:w-auto'
                >
                  Clear all filters
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className='space-y-4'>
          {filteredOrders.map((order: any) => (
            <Card key={order.id} className='hover:shadow-md transition-shadow'>
              <CardContent className='p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4'>
                  <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4'>
                    <span className='font-semibold text-lg'>#{order.orderNumber}</span>
                    <div className='flex gap-2'>
                      <Badge className={getOrderStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                  <div className='text-left sm:text-right'>
                    <div className='font-semibold text-lg'>${order.total.toFixed(2)}</div>
                    <div className='text-sm text-muted-foreground'>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                  <div className='text-sm text-muted-foreground'>
                    {order.totalItems || 0} item(s)
                  </div>
                  <div className='flex flex-col sm:flex-row gap-2 sm:space-x-2'>
                    {order.paymentStatus === EPaymentStatus.paid ? (
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full sm:w-auto'
                        onClick={() => {
                          setTrackingOrderId(order.id);
                          setTrackingOrderNumber(order.orderNumber);
                        }}
                      >
                        Track Order
                      </Button>
                    ) : (
                      <Button asChild size='sm' className='w-full sm:w-auto'>
                        <Link href={`/checkout/${order.id}/payment`}>
                          <CreditCard className="mr-2 h-5 w-5" />
                          Proceed to Payment
                        </Link>
                      </Button>
                    )}
                    <Link href={`/my-orders/${order.id}`}>
                      <Button variant='outline' size='sm' className='w-full sm:w-auto'>
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <div className='w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4'>
            <FileText className='w-8 h-8 text-muted-foreground' />
          </div>
          <h3 className='text-lg font-semibold text-foreground mb-2'>No orders yet.</h3>
          <p className='text-muted-foreground mb-6'>
            Please switch account or{' '}
            <Link href='#' className='text-primary hover:underline'>
              feedback
            </Link>
          </p>
          <Link href='/shop'>
            <Button>Start Shopping</Button>
          </Link>
        </div>
      )}

      {/* Tracking Modal */}
      {trackingOrderId && (
        <OrderTrackingModal
          orderId={trackingOrderId}
          orderNumber={trackingOrderNumber}
          isOpen={!!trackingOrderId}
          onClose={() => {
            setTrackingOrderId(null);
            setTrackingOrderNumber('');
          }}
        />
      )}
    </div>
  );
}

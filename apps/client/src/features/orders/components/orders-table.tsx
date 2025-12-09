'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Eye,
  MoreHorizontal,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Package,
  Truck,
  Sparkles,
} from 'lucide-react';
import { TOrderBasic, EOrderStatus, EPaymentStatus } from '@repo/common';
import Link from 'next/link';
import { format } from 'date-fns';

interface OrdersTableProps {
  orders: TOrderBasic[];
  total: number;
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

export function OrdersTable({ orders, total }: OrdersTableProps) {
  const getStatusIcon = (status: EOrderStatus) => {
    const Icon = statusIcons[status];
    return <Icon className='h-4 w-4' />;
  };

  const formatCurrency = (amount: number, currency: string = 'ETB') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders ({total})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className='w-[50px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <div className='flex items-center gap-2'>
                        <p className='font-medium'>{order.orderNumber}</p>
                        {order.planId && (
                          <Badge variant='outline' className='text-xs'>
                            <Sparkles className='h-3 w-3 mr-1' />
                            Subscription
                          </Badge>
                        )}
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        {order.planId ? 'Subscription order' : 'Book order'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className='font-medium'>
                        {order.user?.firstName} {order.user?.lastName}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {order.user?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]}>
                      {getStatusIcon(order.status)}
                      <span className='ml-1'>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={paymentStatusColors[order.paymentStatus]}>
                      {order.paymentStatus.charAt(0).toUpperCase() +
                        order.paymentStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className='font-medium'>
                      {formatCurrency(order.total, order.currency)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center text-sm text-muted-foreground'>
                      <Calendar className='h-4 w-4 mr-1' />
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='sm'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className='h-4 w-4 mr-2' />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

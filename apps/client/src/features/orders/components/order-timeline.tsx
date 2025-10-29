import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EOrderStatus, TOrderDetail } from '@repo/common';
import { format } from 'date-fns';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Package,
  Truck,
  XCircle,
} from 'lucide-react';

const statusColors = {
  [EOrderStatus.pending]: 'bg-yellow-100 text-yellow-800',
  [EOrderStatus.confirmed]: 'bg-blue-100 text-blue-800',
  [EOrderStatus.processing]: 'bg-purple-100 text-purple-800',
  [EOrderStatus.shipped]: 'bg-indigo-100 text-indigo-800',
  [EOrderStatus.delivered]: 'bg-green-100 text-green-800',
  [EOrderStatus.cancelled]: 'bg-red-100 text-red-800',
  [EOrderStatus.refunded]: 'bg-gray-100 text-gray-800',
};

const StatusIcons = {
  [EOrderStatus.pending]: <Calendar className='h-4 w-4 text-yellow-800' />,
  [EOrderStatus.confirmed]: <CheckCircle className='h-4 w-4 text-blue-800' />,
  [EOrderStatus.processing]: <Package className='h-4 w-4 text-purple-800' />,
  [EOrderStatus.shipped]: <Truck className='h-4 w-4 text-indigo-800' />,
  [EOrderStatus.delivered]: <CheckCircle className='h-4 w-4 text-green-800' />,
  [EOrderStatus.cancelled]: <XCircle className='h-4 w-4 text-red-800' />,
  [EOrderStatus.refunded]: <AlertCircle className='h-4 w-4 text-gray-800' />,
};

interface OrderTimelineProps {
  order: TOrderDetail;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Calendar className='h-5 w-5' />
          Order Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className='relative border-l border-gray-200 dark:border-gray-700 ml-2'>
          {/* Order Created */}
          <li className='mb-8 ml-6 flex items-start'>
            <span className='flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900 absolute -left-3'>
              <Calendar className='h-4 w-4 text-blue-600' />
            </span>
            <div className='flex-1 pl-4'>
              <p className='font-medium text-sm'>Order Created</p>
              <p className='text-gray-500 text-xs'>
                {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
              </p>
              {order.user && (
                <p className='text-xs text-gray-400 mt-1'>
                  Created by: {order.user.firstName} {order.user.lastName} (
                  {order.user.email})
                </p>
              )}
            </div>
          </li>

          {/* Status History */}
          {order.statusHistory?.map((status, idx) => (
            <li key={status.id || idx} className='mb-8 ml-6 flex items-start'>
              <span className='flex items-center justify-center w-6 h-6 bg-green-100 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-green-900 absolute -left-3'>
                {StatusIcons[status.status]}
              </span>
              <div className='flex-1 pl-4'>
                <p className='font-medium text-sm'>
                  {status.status.charAt(0).toUpperCase() +
                    status.status.slice(1)}
                </p>
                <p className='text-gray-500 text-xs'>
                  {format(new Date(status.createdAt), 'MMM dd, yyyy HH:mm')}
                </p>
                {status.notes && (
                  <p className='text-xs text-gray-400 mt-1'>{status.notes}</p>
                )}
                {status.updatedBy && (
                  <p className='text-xs text-gray-400 mt-1'>
                    By: {status.updatedBy.firstName} {status.updatedBy.lastName}{' '}
                    ({status.updatedBy.email})
                  </p>
                )}
              </div>
            </li>
          ))}

          {/* Last Updated */}
          <li className='mb-8 ml-6 flex items-start'>
            <span className='flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-yellow-900 absolute -left-3'>
              <Calendar className='h-4 w-4 text-yellow-600' />
            </span>
            <div className='flex-1 pl-4'>
              <p className='font-medium text-sm'>Last Updated</p>
              <p className='text-gray-500 text-xs'>
                {format(new Date(order.updatedAt), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
          </li>

          {/* Estimated Delivery */}
          {order.estimatedDelivery && (
            <li className='ml-6 flex items-start'>
              <span className='flex items-center justify-center w-6 h-6 bg-purple-100 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-purple-900 absolute -left-3'>
                <Truck className='h-4 w-4 text-purple-600' />
              </span>
              <div className='flex-1 pl-4'>
                <p className='font-medium text-sm'>Estimated Delivery</p>
                <p className='text-gray-500 text-xs'>
                  {format(new Date(order.estimatedDelivery), 'MMM dd, yyyy')}
                </p>
              </div>
            </li>
          )}
        </ol>
      </CardContent>
    </Card>
  );
}

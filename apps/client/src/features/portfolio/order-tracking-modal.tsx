'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, Truck, MapPin, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMyOrderTracking } from '@/actions/profile.action';

interface OrderTrackingModalProps {
  orderId: string;
  orderNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderTrackingModal({ orderId, orderNumber, isOpen, onClose }: OrderTrackingModalProps) {
  const { data: tracking, isLoading } = useQuery({
    queryKey: ['order-tracking', orderId],
    queryFn: () => getMyOrderTracking(orderId),
    enabled: isOpen && !!orderId,
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className='h-5 w-5 text-yellow-600 dark:text-yellow-400' />;
      case 'confirmed':
        return <CheckCircle2 className='h-5 w-5 text-blue-600 dark:text-blue-400' />;
      case 'processing':
        return <Package className='h-5 w-5 text-purple-600 dark:text-purple-400' />;
      case 'shipped':
        return <Truck className='h-5 w-5 text-indigo-600 dark:text-indigo-400' />;
      case 'delivered':
        return <CheckCircle2 className='h-5 w-5 text-green-600 dark:text-green-400' />;
      default:
        return <Package className='h-5 w-5 text-muted-foreground dark:text-muted-foreground' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'processing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center space-x-2'>
            <Truck className='h-5 w-5' />
            <span>Track Order #{orderNumber}</span>
          </DialogTitle>
          <DialogDescription>
            Track your order status and delivery information
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
              <p className='text-muted-foreground'>Loading tracking information...</p>
            </div>
          </div>
        ) : tracking ? (
          <div className='space-y-6'>
            {/* Current Status */}
            <div className='bg-primary/10 p-4 rounded-lg'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center space-x-3'>
                  {getStatusIcon(tracking.status)}
                  <div>
                    <p className='text-sm text-muted-foreground'>Current Status</p>
                    <p className='font-semibold capitalize'>{tracking.status}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(tracking.status)}>
                  {tracking.status}
                </Badge>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                {tracking.trackingNumber && (
                  <div className='flex items-start space-x-3'>
                    <Package className='h-5 w-5 text-muted-foreground mt-0.5' />
                    <div>
                      <p className='text-sm text-muted-foreground'>Tracking Number</p>
                      <p className='font-mono text-sm font-medium'>{tracking.trackingNumber}</p>
                    </div>
                  </div>
                )}

                <div className='flex items-start space-x-3'>
                  <Truck className='h-5 w-5 text-muted-foreground mt-0.5' />
                  <div>
                    <p className='text-sm text-muted-foreground'>Shipping Method</p>
                    <p className='text-sm font-medium capitalize'>{tracking.shippingMethod.replace('_', ' ')}</p>
                  </div>
                </div>

                {tracking.estimatedDelivery && (
                  <div className='flex items-start space-x-3'>
                    <Calendar className='h-5 w-5 text-muted-foreground mt-0.5' />
                    <div>
                      <p className='text-sm text-muted-foreground'>Estimated Delivery</p>
                      <p className='text-sm font-medium'>
                        {new Date(tracking.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Status Timeline */}
            <div>
              <h3 className='font-semibold mb-4'>Order Timeline</h3>
              <div className='space-y-4'>
                {tracking.statusHistory && tracking.statusHistory.length > 0 ? (
                  tracking.statusHistory.map((history: any, index: number) => (
                    <div key={index} className='flex items-start space-x-4'>
                      <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center shrink-0'>
                        <div className='w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full' />
                      </div>
                      <div className='flex-1 pb-4 border-b border-gray-200 dark:border-gray-800 last:border-0'>
                        <div className='flex items-center justify-between mb-1'>
                          <p className='font-medium capitalize'>{history.status}</p>
                          <p className='text-sm text-muted-foreground'>
                            {new Date(history.timestamp || history.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {history.notes && (
                          <p className='text-sm text-muted-foreground'>{history.notes}</p>
                        )}
                        {history.location && (
                          <div className='flex items-center space-x-2 mt-2 text-sm text-muted-foreground'>
                            <MapPin className='h-4 w-4' />
                            <span>{history.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-center py-8 text-muted-foreground'>
                    <Package className='h-12 w-12 mx-auto mb-4 text-gray-400' />
                    <p>No tracking history available yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className='flex justify-end space-x-2 pt-4'>
              <Button variant='outline' onClick={onClose}>
                Close
              </Button>
              {tracking.trackingNumber && (
                <Button onClick={() => {
                  // Copy tracking number to clipboard
                  navigator.clipboard.writeText(tracking.trackingNumber || '');
                }}>
                  Copy Tracking Number
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className='text-center py-8 text-muted-foreground'>
            <Package className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
            <p>No tracking information available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


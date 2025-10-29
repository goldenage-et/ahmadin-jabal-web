'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, Truck } from 'lucide-react';
import { EOrderStatus, EPaymentStatus, TOrderDetail } from '@repo/common';
import { useApiMutation } from '@/hooks/use-api-mutation';
import {
  addTrackingNumber,
  updateOrderPaymentStatus,
  updateOrderStatus,
} from '@/features/orders/actions/order.action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface OrderManagementProps {
  order: TOrderDetail;
}

const statusColors = {
  [EOrderStatus.pending]: 'bg-yellow-100 text-yellow-800',
  [EOrderStatus.confirmed]: 'bg-blue-100 text-blue-800',
  [EOrderStatus.processing]: 'bg-purple-100 text-purple-800',
  [EOrderStatus.shipped]: 'bg-indigo-100 text-indigo-800',
  [EOrderStatus.delivered]: 'bg-green-100 text-green-800',
  [EOrderStatus.cancelled]: 'bg-red-100 text-red-800',
  [EOrderStatus.refunded]: 'bg-gray-100 text-gray-800',
};

const paymentStatusColors = {
  [EPaymentStatus.pending]: 'bg-yellow-100 text-yellow-800',
  [EPaymentStatus.paid]: 'bg-green-100 text-green-800',
  [EPaymentStatus.failed]: 'bg-red-100 text-red-800',
  [EPaymentStatus.refunded]: 'bg-gray-100 text-gray-800',
};

export function OrderManagement({ order }: OrderManagementProps) {
  const router = useRouter();
  const [newStatus, setNewStatus] = useState<EOrderStatus>(order.status);
  const [newPaymentStatus, setNewPaymentStatus] = useState<EPaymentStatus>(
    order.paymentStatus,
  );
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber || '',
  );
  const [statusNotes, setStatusNotes] = useState('');

  const { mutate: updateStatus, isLoading: isUpdatingStatus } =
    useApiMutation();
  const { mutate: updatePaymentStatus, isLoading: isUpdatingPaymentStatus } =
    useApiMutation();
  const { mutate: addTracking, isLoading: isAddingTracking } = useApiMutation();

  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    try {
      await updateStatus(
        () => updateOrderStatus(order.id, newStatus, statusNotes),
        {
          onSuccess: () => {
            toast.success('Order status updated successfully');
            setStatusNotes('');
            router.refresh(); // Refresh the page to get updated data
          },
          onError: (error) => {
            toast.error('Failed to update order status');
            console.error('Error updating status:', error);
          },
        },
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePaymentStatusUpdate = async () => {
    if (!newPaymentStatus) return;

    try {
      await updatePaymentStatus(
        () => updateOrderPaymentStatus(order.id, newPaymentStatus),
        {
          onSuccess: () => {
            toast.success('Payment status updated successfully');
            router.refresh(); // Refresh the page to get updated data
          },
          onError: (error) => {
            toast.error('Failed to update payment status');
            console.error('Error updating payment status:', error);
          },
        },
      );
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleTrackingUpdate = async () => {
    if (!trackingNumber.trim()) return;

    try {
      await addTracking(() => addTrackingNumber(order.id, trackingNumber), {
        onSuccess: () => {
          toast.success('Tracking number added successfully');
          router.refresh(); // Refresh the page to get updated data
        },
        onError: (error) => {
          toast.error('Failed to add tracking number');
          console.error('Error adding tracking number:', error);
        },
      });
    } catch (error) {
      console.error('Error adding tracking number:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Edit className='h-5 w-5' />
          Order Management
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Status Update */}
        <div>
          <Label htmlFor='status'>Order Status</Label>
          <div className='flex justify-between gap-2 mt-1'>
            <div>
              <Badge className={statusColors[order.status]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size='icon' variant='outline'>
                  <Edit className='h-4 w-4' />
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-3xl' >
                <DialogHeader>
                  <DialogTitle>Update Order Status</DialogTitle>
                  <DialogDescription>
                    Update the order status to {newStatus}
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                  <Select
                    value={newStatus}
                    onValueChange={(value) =>
                      setNewStatus(value as EOrderStatus)
                    }
                  >
                    <SelectTrigger className='flex-1'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(EOrderStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className='mt-2 space-y-2'>
                    <Label htmlFor='notes'>Notes (optional)</Label>
                    <Textarea
                      value={statusNotes}
                      onChange={(e) => setStatusNotes(e.target.value)}
                      placeholder='Add any notes about this status change...'
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={isUpdatingStatus}
                  >
                    <Save className='h-4 w-4 mr-2' />
                    {isUpdatingStatus ? 'Updating...' : 'Update Status'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Payment Status Update */}
        {/* <div>
          <Label htmlFor='payment-status'>Payment Status</Label>
          <div className='flex gap-2 mt-1'>
            <Select
              value={newPaymentStatus}
              onValueChange={(value) =>
                setNewPaymentStatus(value as EPaymentStatus)
              }
            >
              <SelectTrigger className='flex-1'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(EPaymentStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size='sm'
              disabled={
                newPaymentStatus === order.paymentStatus ||
                isUpdatingPaymentStatus
              }
              onClick={handlePaymentStatusUpdate}
            >
              <Save className='h-4 w-4' />
            </Button>
          </div>
        </div> */}

        {/* Tracking Number */}
        <div>
          <Label htmlFor='tracking'>Tracking Number</Label>
          <div className='flex gap-2 mt-1'>
            <Input
              id='tracking'
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder='Enter tracking number'
            />
            <Button
              size='sm'
              disabled={
                !trackingNumber.trim() ||
                trackingNumber === order.trackingNumber ||
                isAddingTracking
              }
              onClick={handleTrackingUpdate}
            >
              <Truck className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

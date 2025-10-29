import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { TOrderDetail } from '@repo/common';
import Image from 'next/image';

interface OrderItemsProps {
  order: TOrderDetail;
}

export function OrderItems({ order }: OrderItemsProps) {
  const formatCurrency = (amount: number, currency: string = 'ETB') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Package className='h-5 w-5' />
          Order Items ({order.items.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {order.items.map((item) => (
            <div
              key={item.id}
              className='flex items-center gap-4 p-4 border rounded-lg'
            >
              <div className='w-16 h-16 bg-gray-100 rounded-lg overflow-hidden'>
                {item.bookImage ? (
                  <Image
                    src={item.bookImage}
                    alt={item.bookName || 'Book Image'}
                    width={64}
                    height={64}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-gray-400'>
                    <Package className='h-6 w-6' />
                  </div>
                )}
              </div>
              <div className='flex-1'>
                <h4 className='font-medium'>{item.bookName}</h4>
                {item.variantName && (
                  <p className='text-sm text-gray-500'>
                    Variant: {item.variantName}
                  </p>
                )}
                {item.bookSku && (
                  <p className='text-sm text-gray-500'>
                    SKU: {item.bookSku}
                  </p>
                )}
              </div>
              <div className='text-right'>
                <p className='font-medium'>Qty: {item.quantity}</p>
                <p className='text-sm text-gray-500'>
                  {formatCurrency(item.price, order.currency)} each
                </p>
                <p className='font-medium'>
                  {formatCurrency(item.total, order.currency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

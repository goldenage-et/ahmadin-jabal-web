'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Truck } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmation() {
  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-8'>
          <div className='flex justify-center mb-6'>
            <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center'>
              <CheckCircle className='h-10 w-10 text-green-600' />
            </div>
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            Order Confirmed!
          </h1>
          <p className='text-gray-600 text-lg'>
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
        </div>

        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-start space-x-3'>
              <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                <Package className='h-4 w-4 text-blue-600' />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900'>
                  Order Processing
                </h3>
                <p className='text-gray-600 text-sm'>
                  We're preparing your items for shipment. You'll receive a
                  confirmation email shortly.
                </p>
              </div>
            </div>

            <div className='flex items-start space-x-3'>
              <div className='w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0'>
                <Truck className='h-4 w-4 text-orange-600' />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900'>Shipping</h3>
                <p className='text-gray-600 text-sm'>
                  Your order will be shipped within 1-2 business days. You'll
                  receive tracking information via email.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='text-center space-y-4'>
          <p className='text-gray-600'>
            Order ID:{' '}
            <span className='font-mono font-semibold'>
              #ABM-{Date.now().toString().slice(-8)}
            </span>
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button asChild>
              <Link href='/'>Continue Shopping</Link>
            </Button>
            <Button asChild variant='outline'>
              <Link href='/orders'>View Order History</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

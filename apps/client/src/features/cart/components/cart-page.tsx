'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store/cart-store';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

export function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCartStore();

  const handleQuantityChange = (bookId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(bookId);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(bookId, newQuantity);
    }
  };

  const handleRemoveItem = (bookId: string) => {
    removeFromCart(bookId);
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  if (cart.items.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 py-12'>
        <div className=' mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <ShoppingBag className='h-24 w-24 text-gray-400 mx-auto mb-6' />
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              Your cart is empty
            </h1>
            <p className='text-gray-600 mb-8'>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild size='lg'>
              <Link href='/'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className=' mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Shopping Cart</h1>
          <p className='text-gray-600 mt-2'>
            {cart.itemCount} item(s) in your cart
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Cart Items */}
          <div className='lg:col-span-2 space-y-4'>
            {cart.items.map((item) => (
              <Card key={item.id} className='overflow-hidden'>
                <CardContent className='p-6'>
                  <div className='flex items-center space-x-4'>
                    <div className='relative w-20 h-20 flex-shrink-0'>
                      <Image
                        src={
                          item.book.images?.[0]?.url || '/placeholder.jpg'
                        }
                        alt={item.book.name}
                        fill
                        className='object-cover rounded-lg'
                      />
                    </div>

                    <div className='flex-1 min-w-0'>
                      <h3 className='text-lg font-semibold text-gray-900 truncate'>
                        {item.book.name}
                      </h3>
                      <p className='text-sm text-gray-600 truncate'>
                        SKU: {item.book.sku}
                      </p>
                      <div className='flex items-center space-x-2 mt-2'>
                        <span className='text-lg font-bold text-gray-900'>
                          ${item.price.toFixed(2)}
                        </span>
                        {/* {item.book.compareAtPrice && (
                          <span className='text-sm text-gray-500 line-through'>
                            ${item.book.compareAtPrice.toFixed(2)}
                          </span>
                        )} */}
                      </div>
                    </div>

                    <div className='flex items-center space-x-3'>
                      {/* Quantity Controls */}
                      <div className='flex items-center space-x-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            handleQuantityChange(
                              item.book.id,
                              item.quantity - 1,
                            )
                          }
                          className='h-8 w-8 p-0'
                        >
                          <Minus className='h-4 w-4' />
                        </Button>
                        <span className='text-sm font-medium min-w-[2rem] text-center'>
                          {item.quantity}
                        </span>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            handleQuantityChange(
                              item.book.id,
                              item.quantity + 1,
                            )
                          }
                          className='h-8 w-8 p-0'
                          disabled={
                            item.book.inventoryQuantity !== null &&
                            item.book.inventoryQuantity !== undefined &&
                            item.quantity >= item.book.inventoryQuantity
                          }
                        >
                          <Plus className='h-4 w-4' />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleRemoveItem(item.book.id)}
                        className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>

                    <div className='text-right'>
                      <div className='text-lg font-bold text-gray-900'>
                        ${item.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear Cart Button */}
            <div className='flex justify-end'>
              <Button
                variant='outline'
                onClick={handleClearCart}
                className='text-red-600 hover:text-red-700 hover:bg-red-50'
              >
                <Trash2 className='h-4 w-4 mr-2' />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <Card className='sticky top-4'>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-between text-sm'>
                  <span>Subtotal ({cart.itemCount} items)</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>

                <div className='flex justify-between text-sm'>
                  <span>Shipping</span>
                  <span>
                    {cart.shipping === 0 ? (
                      <Badge variant='secondary'>Free</Badge>
                    ) : (
                      `$${cart.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className='flex justify-between text-sm'>
                  <span>Tax</span>
                  {cart.tax === 0 ? (
                    <Badge variant='secondary'>Free</Badge>
                  ) : (
                    `$${cart.tax.toFixed(2)}`
                  )}
                </div>

                {cart.discount > 0 && (
                  <div className='flex justify-between text-sm text-green-600'>
                    <span>Discount</span>
                    <span>-${cart.discount.toFixed(2)}</span>
                  </div>
                )}

                <Separator />

                <div className='flex justify-between text-lg font-bold'>
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>

                <Button asChild size='lg' className='w-full'>
                  <Link href='/checkout'>Proceed to Checkout</Link>
                </Button>

                <Button asChild variant='outline' size='lg' className='w-full'>
                  <Link href='/'>Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

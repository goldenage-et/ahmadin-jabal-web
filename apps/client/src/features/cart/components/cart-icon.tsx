'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cart-store';
import Link from 'next/link';

interface CartIconProps {
  className?: string;
  showCount?: boolean;
}

export function CartIcon({ className = '', showCount = true }: CartIconProps) {
  const cart = useCartStore((state) => state.cart);

  return (
    <Button
      asChild
      variant='ghost'
      size='sm'
      className={`relative ${className}`}
    >
      <Link href='/cart'>
        <ShoppingCart className='h-5 w-5' />
        {showCount && cart.itemCount > 0 && (
          <Badge
            variant='destructive'
            className='absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs'
          >
            {cart.itemCount > 99 ? '99+' : cart.itemCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}

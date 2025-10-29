'use client';

import { Button } from '@/components/ui/button';
import { TBookBasic } from '@repo/common';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useBuyNowStore } from '../store/buy-now-store';

interface BuyNowButtonProps {
  book: TBookBasic;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  disabled?: boolean;
  quantity?: number;
}

export function BuyNowButton({
  book,
  variant = 'default',
  size = 'default',
  className = '',
  disabled = false,
  quantity = 1,
}: BuyNowButtonProps) {
  const { setBuyNowItem } = useBuyNowStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleBuyNow = async () => {
    // Check stock availability
    if (
      book.inventoryQuantity !== null &&
      book.inventoryQuantity !== undefined &&
      book.inventoryQuantity < quantity
    ) {
      toast.error('Not enough stock available');
      return;
    }

    setIsProcessing(true);
    try {
      setBuyNowItem(book);
      router.push('/checkout?buyNow=true');
    } catch (error) {
      toast.error('Failed to process buy now');
      console.error('Error in buy now:', error);
      setIsProcessing(false);
    }
  };

  const isOutOfStock =
    book.inventoryQuantity !== null &&
    book.inventoryQuantity !== undefined &&
    book.inventoryQuantity <= 0;

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleBuyNow}
      disabled={disabled || isProcessing || isOutOfStock}
    >
      <ShoppingBag className='h-4 w-4 mr-2' />
      {isProcessing ? 'Processing...' : 'Buy Now'}
    </Button>
  );
}


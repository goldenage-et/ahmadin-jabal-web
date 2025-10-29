'use client';

import { Button } from '@/components/ui/button';
import { Check, Minus, Plus, ShoppingCart, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCartStore } from '../store/cart-store';
import { RequiredBook } from '../types/cart.types';

interface AddToCartButtonProps {
  book: RequiredBook;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showQuantityControls?: boolean;
  disabled?: boolean;
}

export function AddToCartButton({
  book,
  variant = 'default',
  size = 'default',
  className = '',
  showQuantityControls = false,
  disabled = false,
}: AddToCartButtonProps) {
  const { addToCart, isInCart, getItemQuantity, updateQuantity } =
    useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const inCart = isInCart(book.id);
  const currentQuantity = getItemQuantity(book.id);

  const handleAddToCart = async () => {
    if (
      book.inventoryQuantity !== null &&
      book.inventoryQuantity !== undefined &&
      book.inventoryQuantity < quantity
    ) {
      toast.error('Not enough stock available');
      return;
    }

    setIsAdding(true);
    try {
      addToCart(book, quantity);
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleIncreaseQuantity = () => {
    if (
      book.inventoryQuantity !== null &&
      book.inventoryQuantity !== undefined &&
      currentQuantity >= book.inventoryQuantity
    ) {
      toast.error('Not enough stock available');
      return;
    }
    updateQuantity(book.id, currentQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (currentQuantity > 1) {
      updateQuantity(book.id, currentQuantity - 1);
    } else {
      updateQuantity(book.id, 0); // This will remove the item
    }
  };

  const handleRemoveItem = () => {
    updateQuantity(book.id, 0);
  };

  if (showQuantityControls && inCart) {
    return (
      <div className='flex items-center space-x-2 w-full'>
        <Button
          variant='outline'
          size='sm'
          onClick={handleDecreaseQuantity}
          className='h-8 p-0 flex-1'
        >
          <Minus className='h-4 w-4' />
        </Button>
        <span className='text-sm font-medium min-w-[2rem] text-center flex-1'>
          {currentQuantity}
        </span>
        <Button
          variant='outline'
          size='sm'
          onClick={handleIncreaseQuantity}
          className='h-8 p-0 flex-1'
          disabled={
            book.inventoryQuantity !== null &&
            book.inventoryQuantity !== undefined &&
            currentQuantity >= book.inventoryQuantity
          }
        >
          <Plus className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={handleRemoveItem}
          className='h-8 w-8 p-0 flex-1'
        >
          <Trash className='h-4 w-4' />
        </Button>
      </div>
    );
  }

  if (inCart) {
    return (
      <Button
        variant='outline'
        size={size}
        className={`w-full ${className}`}
        onClick={handleIncreaseQuantity}
        disabled={
          disabled ||
          (book.inventoryQuantity !== null &&
            book.inventoryQuantity !== undefined &&
            currentQuantity >= book.inventoryQuantity)
        }
      >
        <Check className='h-4 w-4 mr-2' />
        In Cart ({currentQuantity})
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`w-full ${className}`}
      onClick={handleAddToCart}
      disabled={
        disabled ||
        isAdding ||
        (book.inventoryQuantity !== null &&
          book.inventoryQuantity !== undefined &&
          book.inventoryQuantity < quantity)
      }
    >
      <ShoppingCart className='h-4 w-4 mr-2' />
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </Button>
  );
}

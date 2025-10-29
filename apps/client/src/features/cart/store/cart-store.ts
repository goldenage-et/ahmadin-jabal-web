import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem, RequiredBook } from '../types/cart.types';

// Helper function to calculate cart totals
function calculateCartTotals(cart: Cart): Cart {
  const subtotal = cart.items.reduce((sum, item) => sum + item.total, 0);
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate tax (8% for example)
  const tax = subtotal * 0;

  // Calculate shipping (free over $50, otherwise $5.99)
  const shipping = 0 // subtotal >= 50 ? 0 : 5.99;

  // Calculate discount (placeholder for future implementation)
  const discount = 0;

  const total = subtotal + tax + shipping - discount;

  return {
    ...cart,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100,
    itemCount,
  };
}

interface CartStore {
  cart: Cart;
  addToCart: (book: RequiredBook, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (bookId: string) => boolean;
  getItemQuantity: (bookId: string) => number;
}

const initialCart: Cart = {
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  itemCount: 0,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: initialCart,

      addToCart: (book: RequiredBook, quantity: number = 1) => {
        const { cart } = get();
        const existingItemIndex = cart.items.findIndex(
          (item) => item.book.id === book.id,
        );

        let newItems: CartItem[];

        if (existingItemIndex >= 0) {
          // Update existing item
          newItems = cart.items.map((item, index) =>
            index === existingItemIndex
              ? {
                ...item,
                quantity: item.quantity + quantity,
                total: (item.quantity + quantity) * item.price,
              }
              : item,
          );
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${book.id}-${Date.now()}`,
            book,
            quantity,
            price: book.price || 0,
            total: quantity * (book.price || 0),
          };
          newItems = [...cart.items, newItem];
        }

        const updatedCart = calculateCartTotals({ ...cart, items: newItems });
        set({ cart: updatedCart });
      },

      removeFromCart: (bookId: string) => {
        const { cart } = get();
        const newItems = cart.items.filter(
          (item) => item.book.id !== bookId,
        );
        const updatedCart = calculateCartTotals({ ...cart, items: newItems });
        set({ cart: updatedCart });
      },

      updateQuantity: (bookId: string, quantity: number) => {
        const { cart } = get();

        if (quantity <= 0) {
          get().removeFromCart(bookId);
          return;
        }

        const newItems = cart.items.map((item) =>
          item.book.id === bookId
            ? { ...item, quantity, total: quantity * item.price }
            : item,
        );

        const updatedCart = calculateCartTotals({ ...cart, items: newItems });
        set({ cart: updatedCart });
      },

      clearCart: () => {
        set({ cart: initialCart });
      },

      isInCart: (bookId: string) => {
        const { cart } = get();
        return cart.items.some((item) => item.book.id === bookId);
      },

      getItemQuantity: (bookId: string) => {
        const { cart } = get();
        const item = cart.items.find((item) => item.book.id === bookId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'cart-storage',
      // Only persist the cart items, totals will be recalculated
      partialize: (state) => ({ cart: state.cart }),
    },
  ),
);

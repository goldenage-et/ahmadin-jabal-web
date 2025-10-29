import { TBookBasic } from '@repo/common';

export type RequiredBook = Pick<
  TBookBasic,
  | 'id'
  | 'inventoryQuantity'
  | 'price'
  | 'title'
  | 'purchasePrice'
  | 'images'
  | 'sku'
>;

export interface CartItem {
  id: string;
  book: RequiredBook;
  quantity: number;
  price: number; // Price at time of adding to cart
  total: number; // quantity * price
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (book: RequiredBook, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (bookId: string) => boolean;
  getItemQuantity: (bookId: string) => number;
}

// Cart actions for reducer
export type CartAction =
  | {
    type: 'ADD_TO_CART';
    payload: { book: RequiredBook; quantity: number };
  }
  | { type: 'REMOVE_FROM_CART'; payload: { bookId: string } }
  | {
    type: 'UPDATE_QUANTITY';
    payload: { bookId: string; quantity: number };
  }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: { cart: Cart } };

// Checkout types
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'bank_transfer';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

export interface CheckoutData {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  shippingMethod: string;
  notes?: string;
}

export interface OrderSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

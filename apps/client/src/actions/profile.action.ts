'use server';

import { api } from '@/lib/api';
import { TOrderBasic, TWishlist, TUserBasic, TOrderQueryFilter, TOrderDetail, TWishlistBasic } from '@repo/common';

// Get current user's orders with query parameters
export async function getMyOrders(query: TOrderQueryFilter = {}): Promise<{ orders: TOrderBasic[]; total: number }> {
  const response = await api.get<{ orders: TOrderBasic[]; total: number }>('/orders/my', { params: query });
  if ('error' in response) return { orders: [], total: 0 };
  return response;
}

// Get detailed order information
export async function getMyOrderDetails(orderId: string) {
  const response = await api.get<TOrderDetail>(`/orders/my/${orderId}`);
  return response;
}

// Cancel an order
export async function cancelMyOrder(orderId: string, reason?: string): Promise<TOrderDetail> {
  const response = await api.post<TOrderDetail>(`/orders/my/${orderId}/cancel`, { reason });
  if ('error' in response) throw response;
  return response;
}

// Request a return/refund
export async function requestReturn(
  orderId: string,
  reason?: string,
  items?: string[]
): Promise<TOrderDetail> {
  const response = await api.post<TOrderDetail>(`/orders/my/${orderId}/return`, {
    reason,
    items
  });
  if ('error' in response) throw response;
  return response;
}

// Get order tracking information
export async function getMyOrderTracking(orderId: string): Promise<{
  orderNumber: string;
  status: string;
  trackingNumber: string | null;
  estimatedDelivery: Date | null;
  shippingMethod: string;
  statusHistory: any[];
}> {
  const response = await api.get<{
    orderNumber: string;
    status: string;
    trackingNumber: string | null;
    estimatedDelivery: Date | null;
    shippingMethod: string;
    statusHistory: any[];
  }>(`/orders/my/${orderId}/tracking`);
  if ('error' in response) throw response;
  return response;
}

// Get current user's wishlist
export async function getMyWishlist(): Promise<TWishlistBasic[]> {
  const response = await api.get<TWishlist>('/wishlist/my');
  if ('error' in response) return [];
  return response;
}

// Get current user's profile with statistics
export async function getMyProfile(): Promise<{
  user: TUserBasic;
  totalOrders: number;
  totalSpent: number;
  addresses: any[];
}> {
  const response = await api.get<{
    user: TUserBasic;
    totalOrders: number;
    totalSpent: number;
    addresses: any[];
  }>('/profile/my');
  if ('error' in response) throw response;
  return response;
}

// Add item to wishlist
export async function toggleWishlist(
  bookId: string,
  variantId?: string,
): Promise<TWishlist> {
  const response = await api.post<TWishlist>('/wishlist/toggle', {
    bookId,
    variantId,
  });
  if ('error' in response) throw response;
  return response;
}

// Add shipping address
export async function addShippingAddress(address: {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault?: boolean;
}): Promise<any> {
  const response = await api.post<any>('/profile/addresses', address);
  if ('error' in response) throw response;
  return response;
}

// Update shipping address
export async function updateShippingAddress(
  addressId: string,
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault?: boolean;
  },
): Promise<any> {
  const response = await api.put<any>(
    `/profile/addresses/${addressId}`,
    address,
  );
  if ('error' in response) throw response;
  return response;
}

// Delete shipping address
export async function deleteShippingAddress(
  addressId: string,
): Promise<boolean> {
  const response = await api.delete<boolean>(`/profile/addresses/${addressId}`);
  if ('error' in response) throw response;
  return response;
}

// Set default address
export async function setDefaultAddress(addressId: string): Promise<boolean> {
  const response = await api.put<boolean>(
    `/profile/addresses/${addressId}/default`,
    {},
  );
  if ('error' in response) throw response;
  return response;
}

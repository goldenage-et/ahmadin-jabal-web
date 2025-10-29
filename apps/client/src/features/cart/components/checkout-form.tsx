'use client';

import { getAddresses } from '@/actions/address.action';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { EPaymentMethod, EShippingMethod, TAddress, TCreateOrder, TOrderBasic } from '@repo/common';
import { AlertCircle, Building2, CheckCircle, CreditCard, Loader2, MapPin, ShoppingBag, Clock, Banknote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { createOrder } from '../../orders/actions/order.action';
import { useBuyNowStore } from '../store/buy-now-store';
import { useCartStore } from '../store/cart-store';

const shippingAddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const checkoutSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(EPaymentMethod),
  shippingMethod: z.enum(EShippingMethod),
  notes: z.string().optional(),
  customerNotes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const shippingMethods = [
  {
    id: EShippingMethod.standard,
    name: 'Standard Shipping',
    price: 0,
    estimatedDays: '5-7 business days',
    icon: Truck,
  },
  {
    id: EShippingMethod.express,
    name: 'Express Shipping',
    price: 0,
    estimatedDays: '2-3 business days',
    icon: Package,
  },
  {
    id: EShippingMethod.pickup,
    name: 'Store Pickup',
    price: 0,
    estimatedDays: 'Same day',
    icon: ShoppingBag,
  },
];

function Truck({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

export function CheckoutForm() {
  const searchParams = useSearchParams();
  const isBuyNow = searchParams?.get('buyNow') === 'true';
  const [createdOrder, setCreatedOrder] = useState<TOrderBasic | null>(null);
  const { cart, clearCart } = useCartStore();
  const { buyNowItem, clearBuyNowItem } = useBuyNowStore();
  const [savedAddresses, setSavedAddresses] = useState<TAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const { mutate, isLoading } = useApiMutation();
  const router = useRouter();

  // Use buy now item or cart items
  const checkoutItems = useMemo(() => {
    if (isBuyNow && buyNowItem) {
      return [buyNowItem];
    }
    return cart.items;
  }, [isBuyNow, buyNowItem, cart.items]);

  // Calculate totals for checkout
  const checkoutCart = useMemo(() => {
    if (isBuyNow && buyNowItem) {
      const subtotal = buyNowItem.price * buyNowItem.quantity;
      const tax = 0 //subtotal * 0.1; // 10% tax
      return {
        items: [buyNowItem],
        subtotal,
        tax,
        shipping: 0,
        discount: 0,
        total: subtotal + tax,
        itemCount: buyNowItem.quantity,
      };
    }
    return cart;
  }, [isBuyNow, buyNowItem, cart]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: EPaymentMethod.bankTransfer,
      shippingMethod: EShippingMethod.standard,
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    },
  });

  const selectedShippingMethod = watch('shippingMethod');
  const paymentMethod = watch('paymentMethod');

  const selectedShipping = shippingMethods.find(method => method.id === selectedShippingMethod);
  const finalTotal = checkoutCart.total + (selectedShipping?.price || 0);

  // Fetch saved addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const response = await getAddresses({
          page: 1,
          limit: 50,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        if (response && 'data' in response) {
          setSavedAddresses(response.data);

          // Auto-select first address if available
          if (response.data.length > 0 && !selectedAddressId) {
            handleAddressSelection(response.data[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
        toast.error('Failed to load saved addresses');
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  // Handle address selection
  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId);

    if (addressId === 'new') {
      // Clear form fields for new address
      setValue('shippingAddress.street', '', { shouldValidate: false });
      setValue('shippingAddress.city', '', { shouldValidate: false });
      setValue('shippingAddress.state', '', { shouldValidate: false });
      setValue('shippingAddress.zipCode', '', { shouldValidate: false });
      setValue('shippingAddress.country', '', { shouldValidate: false });
      setValue('shippingAddress.latitude', undefined);
      setValue('shippingAddress.longitude', undefined);
    } else {
      // Find and populate the selected address
      const selectedAddress = savedAddresses.find(addr => addr.id === addressId);
      if (selectedAddress) {
        setValue('shippingAddress.street', selectedAddress.street, { shouldValidate: true });
        setValue('shippingAddress.city', selectedAddress.city, { shouldValidate: true });
        setValue('shippingAddress.state', selectedAddress.state, { shouldValidate: true });
        setValue('shippingAddress.zipCode', selectedAddress.zipCode || '', { shouldValidate: true });
        setValue('shippingAddress.country', selectedAddress.country, { shouldValidate: true });
        setValue('shippingAddress.latitude', undefined);
        setValue('shippingAddress.longitude', undefined);
      }
    }
  };

  // Handle current location detection
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    setIsDetectingLocation(true);
    setSelectedAddressId('current');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch location data');
          }

          const data = await response.json();

          setValue('shippingAddress.street', data.principalSubdivision || '', { shouldValidate: true });
          setValue('shippingAddress.city', data.city || data.locality || '', { shouldValidate: true });
          setValue('shippingAddress.state', data.principalSubdivision || '', { shouldValidate: true });
          setValue('shippingAddress.zipCode', data.postcode || '', { shouldValidate: true });
          setValue('shippingAddress.country', data.countryName || '', { shouldValidate: true });
          setValue('shippingAddress.latitude', latitude);
          setValue('shippingAddress.longitude', longitude);

          toast.success('Location detected successfully!');
        } catch (error) {
          console.error('Error getting location:', error);
          toast.error('Failed to detect location. Please enter address manually.');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Failed to get your location. ';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'Please enter address manually.';
            break;
        }

        toast.error(errorMessage);
        setIsDetectingLocation(false);
        setSelectedAddressId('new');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const onSubmit = async (data: CheckoutFormData) => {
    mutate(
      async () => {
        const itemsByStore = checkoutCart.items.reduce(
          (acc, item) => {
            const storeId = item.book.storeId;
            if (!acc[storeId]) {
              acc[storeId] = [];
            }
            acc[storeId].push(item);
            return acc;
          },
          {} as Record<string, typeof checkoutCart.items>,
        );

        const storeTotals = Object.entries(itemsByStore).map(
          ([storeId, items]) => {
            const storeSubtotal = items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0,
            );
            const storeTax = (storeSubtotal / checkoutCart.subtotal) * checkoutCart.tax;
            const storeShipping =
              (storeSubtotal / checkoutCart.subtotal) * (selectedShipping?.price || 0);
            const storeTotal = storeSubtotal + storeTax + storeShipping;

            return {
              storeId,
              items,
              subtotal: storeSubtotal,
              tax: storeTax,
              shipping: storeShipping,
              total: storeTotal,
            };
          },
        );

        const orderPromises = storeTotals.map((storeData) => {
          const orderData: TCreateOrder = {
            storeId: storeData.storeId,
            items: storeData.items.map(item => ({
              bookId: item.book.id,
              quantity: item.quantity,
              price: item.book.price || 0,
              bookName: item.book.name,
              bookSku: item.book.sku,
              bookImage: item.book.images?.[0]?.url,
            })),
            paymentMethod: data.paymentMethod as EPaymentMethod,
            shippingAddress: {
              street: data.shippingAddress.street,
              city: data.shippingAddress.city,
              state: data.shippingAddress.state,
              zipCode: data.shippingAddress.zipCode || '',
              country: data.shippingAddress.country,
              ...(data.shippingAddress.latitude && { latitude: data.shippingAddress.latitude }),
              ...(data.shippingAddress.longitude && { longitude: data.shippingAddress.longitude }),
            } as any,
            shippingMethod: data.shippingMethod as EShippingMethod,
            subtotal: storeData.subtotal,
            tax: storeData.tax,
            shipping: storeData.shipping,
            total: storeData.total,
            currency: 'ETB',
            notes: data.notes,
            customerNotes: data.customerNotes,
          };
          return orderData;
        });

        const responses = await createOrder(orderPromises);
        return responses;
      }, {
      onSuccess: (responses) => {
        if (Array.isArray(responses)) {
          toast.success(`Successfully created ${responses.length} order(s)!`);
          setCreatedOrder(responses[0] as TOrderBasic);

          // Clear appropriate store
          if (isBuyNow) {
            clearBuyNowItem();
          } else {
            clearCart();
          }

          // Redirect after showing success message
          setTimeout(() => {
            router.push(`/checkout/${responses[0].id}/payment`);
          }, 2000);
        } else {
          toast.success('Order created successfully!');
        }
      },
      onError: (error) => {
        console.error('Order creation error:', error);
        const errorMessage = error?.message || (typeof error?.details === 'string' ? error.details : 'Failed to place order. Please try again.');
        toast.error(errorMessage);
      }
    });
  };

  // Loading state - Submitting order
  if (isLoading || isSubmitting) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Processing Your Order
                </h2>
                <p className="text-gray-600 mb-4">
                  Please wait while we create your order...
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Validating items</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span>Creating order</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>Setting up payment</span>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <p className="text-xs text-gray-500">
                  This should only take a moment. Please don't close this window.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state - Order created successfully
  if (createdOrder) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-in zoom-in duration-300">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Order Created Successfully! 🎉
                </h2>
                <p className="text-gray-600 mb-4">
                  Order #{createdOrder.orderNumber}
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  <span className="text-blue-700 font-medium">
                    Redirecting to payment page...
                  </span>
                </div>
              </div>
              <Card className="bg-white border-green-200 max-w-md mx-auto">
                <CardContent className="pt-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-bold text-lg text-gray-900">
                        ${createdOrder.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <Badge variant="outline" className="text-xs">
                        {createdOrder.paymentMethod === EPaymentMethod.bankTransfer
                          ? 'Bank Transfer'
                          : 'Cash on Delivery'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status</span>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                        {createdOrder.paymentStatus.charAt(0).toUpperCase() + createdOrder.paymentStatus.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="pt-4">
                <p className="text-xs text-gray-500">
                  If you're not redirected automatically,{' '}
                  <button
                    onClick={() => router.push(`/checkout/${createdOrder.id}/payment`)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    click here
                  </button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty cart state
  if (checkoutCart.items.length === 0 && !isBuyNow) {
    return (
      <div className='text-center py-12'>
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <ShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          Your cart is empty
        </h2>
        <p className='text-gray-600 mb-6'>
          Add some items to your cart to proceed with checkout.
        </p>
        <Button asChild size="lg">
          <a href='/'>Continue Shopping</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Shipping Information</span>
              </CardTitle>
              <CardDescription>Where should we deliver your order?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Address Selection */}
              <div className='space-y-3'>
                <Label className="text-base font-semibold">Select Delivery Address</Label>
                {isLoadingAddresses ? (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading saved addresses...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedAddresses.length > 0 && (
                      <div className="grid gap-3">
                        {savedAddresses.map((address) => (
                          <Card
                            key={address.id}
                            className={`cursor-pointer transition-all duration-200 ${selectedAddressId === address.id
                              ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300 shadow-md'
                              : 'hover:bg-gray-50 hover:border-blue-200 border-gray-200'
                              }`}
                            onClick={() => handleAddressSelection(address.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-semibold text-sm text-gray-900 mb-1">
                                    {address.street}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {address.city}, {address.state} {address.zipCode}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {address.country}
                                  </div>
                                </div>
                                <div className="ml-3 flex-shrink-0">
                                  {selectedAddressId === address.id ? (
                                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                      <CheckCircle className="w-3 h-3 text-white" />
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Use Current Location Option */}
                    <Card
                      className={`cursor-pointer transition-all duration-200 ${selectedAddressId === 'current'
                        ? 'ring-2 ring-purple-500 bg-purple-50 border-purple-300 shadow-md'
                        : 'hover:bg-gray-50 hover:border-purple-200 border-gray-200'
                        }`}
                      onClick={handleUseCurrentLocation}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              {isDetectingLocation ? (
                                <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                              ) : (
                                <MapPin className="w-4 h-4 text-purple-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-gray-900">
                                {isDetectingLocation ? 'Detecting Location...' : 'Use Current Location'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {isDetectingLocation ? 'Please wait...' : 'Automatically detect your location'}
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {selectedAddressId === 'current' ? (
                              <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Add New Address Option */}
                    <Card
                      className={`cursor-pointer transition-all duration-200 ${selectedAddressId === 'new'
                        ? 'ring-2 ring-green-500 bg-green-50 border-green-300 shadow-md'
                        : 'hover:bg-gray-50 hover:border-green-200 border-gray-200'
                        }`}
                      onClick={() => handleAddressSelection('new')}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-lg font-bold">+</span>
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-gray-900">Add New Address</div>
                              <div className="text-xs text-gray-500">Enter a new shipping address</div>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {selectedAddressId === 'new' ? (
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Address Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="street" className="text-sm font-medium">
                    Street Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="street"
                    {...register('shippingAddress.street')}
                    className={errors.shippingAddress?.street ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    placeholder="123 Main Street, Apt 4B"
                  />
                  {errors.shippingAddress?.street && (
                    <p className="text-sm text-red-600 mt-1 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.shippingAddress.street.message}</span>
                    </p>
                  )}
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='city' className="text-sm font-medium">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id='city'
                      {...register('shippingAddress.city')}
                      className={errors.shippingAddress?.city ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      placeholder='New York'
                    />
                    {errors.shippingAddress?.city && (
                      <p className='text-sm text-red-600 mt-1 flex items-center space-x-1'>
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.shippingAddress.city.message}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor='state' className="text-sm font-medium">
                      State/Province <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id='state'
                      {...register('shippingAddress.state')}
                      className={errors.shippingAddress?.state ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      placeholder='NY'
                    />
                    {errors.shippingAddress?.state && (
                      <p className='text-sm text-red-600 mt-1 flex items-center space-x-1'>
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.shippingAddress.state.message}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode" className="text-sm font-medium">ZIP/Postal Code</Label>
                    <Input
                      id="zipCode"
                      {...register('shippingAddress.zipCode')}
                      className={errors.shippingAddress?.zipCode ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      placeholder="10001"
                    />
                    {errors.shippingAddress?.zipCode && (
                      <p className="text-sm text-red-600 mt-1 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.shippingAddress.zipCode.message}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-sm font-medium">
                      Country <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="country"
                      {...register('shippingAddress.country')}
                      className={errors.shippingAddress?.country ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      placeholder="United States"
                    />
                    {errors.shippingAddress?.country && (
                      <p className="text-sm text-red-600 mt-1 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.shippingAddress.country.message}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Method</span>
              </CardTitle>
              <CardDescription>Choose how you'd like to pay</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    <Card
                      className={`cursor-pointer transition-all border-2 ${field.value === EPaymentMethod.bankTransfer
                        ? 'border-blue-500 shadow-lg bg-blue-50'
                        : 'border-gray-200 hover:shadow-md hover:border-blue-300'
                        }`}
                      onClick={() => field.onChange(EPaymentMethod.bankTransfer)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-full ${field.value === EPaymentMethod.bankTransfer ? 'bg-blue-200' : 'bg-blue-100'
                              }`}>
                              <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Bank Transfer</p>
                              <p className="text-sm text-gray-600">
                                Secure transfer from your bank
                              </p>
                            </div>
                          </div>
                          {field.value === EPaymentMethod.bankTransfer && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        {field.value === EPaymentMethod.bankTransfer && (
                          <div className="mt-3 pt-3 border-t space-y-2 text-sm text-gray-600">
                            <div className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Fast and secure verification</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>No additional fees</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer transition-all border-2 ${field.value === EPaymentMethod.onDelivery
                        ? 'border-green-500 shadow-lg bg-green-50'
                        : 'border-gray-200 hover:shadow-md hover:border-green-300'
                        }`}
                      onClick={() => field.onChange(EPaymentMethod.onDelivery)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-full ${field.value === EPaymentMethod.onDelivery ? 'bg-green-200' : 'bg-green-100'
                              }`}>
                              <Banknote className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Cash on Delivery</p>
                              <p className="text-sm text-gray-600">
                                Pay when you receive your order
                              </p>
                            </div>
                          </div>
                          {field.value === EPaymentMethod.onDelivery && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        {field.value === EPaymentMethod.onDelivery && (
                          <div className="mt-3 pt-3 border-t space-y-2 text-sm text-gray-600">
                            <div className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Pay in cash to delivery person</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>No advance payment required</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              />
              {errors.paymentMethod && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.paymentMethod.message}</span>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Shipping Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Shipping Method</span>
              </CardTitle>
              <CardDescription>How fast do you need it?</CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                name="shippingMethod"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className='space-y-3'
                  >
                    {shippingMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <Card
                          key={method.id}
                          className={`cursor-pointer transition-all border-2 ${field.value === method.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                            }`}
                          onClick={() => field.onChange(method.id)}
                        >
                          <CardContent className='p-4'>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-3'>
                                <RadioGroupItem value={method.id} id={method.id} />
                                <div className={`p-2 rounded-lg ${field.value === method.id ? 'bg-blue-100' : 'bg-gray-100'
                                  }`}>
                                  <Icon className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                  <Label htmlFor={method.id} className='font-semibold text-gray-900 cursor-pointer'>
                                    {method.name}
                                  </Label>
                                  <p className='text-sm text-gray-500'>
                                    {method.estimatedDays}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className='font-bold text-lg text-gray-900'>
                                  {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
                                </span>
                                {method.price === 0 && (
                                  <Badge className="bg-green-100 text-green-800 text-xs ml-2">
                                    Free
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </RadioGroup>
                )}
              />
              {errors.shippingMethod && (
                <p className="text-sm text-red-600 mt-2 flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.shippingMethod.message}</span>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Notes (Optional)</CardTitle>
              <CardDescription>Any special instructions?</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor='customerNotes' className="text-sm font-medium">
                  Delivery Instructions
                </Label>
                <textarea
                  id='customerNotes'
                  {...register('customerNotes')}
                  className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  rows={3}
                  placeholder='e.g., "Please ring doorbell twice" or "Leave package at front desk"'
                />
                <p className="text-xs text-gray-500 mt-1">
                  These notes will be shared with the delivery person
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar - 1/3 width */}
        <div className="lg:col-span-1">
          <Card className="sticky top-28">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {checkoutCart.items.length} item{checkoutCart.items.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {/* Items Preview */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {checkoutCart.items.slice(0, 3).map((item) => (
                    <div key={item.id} className='flex items-center space-x-3 text-sm'>
                      <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                        {item.book.images?.[0]?.url ? (
                          <img
                            src={item.book.images[0].url}
                            alt={item.book.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className='font-medium text-gray-900 truncate'>{item.book.name}</p>
                        <p className='text-xs text-gray-500'>Qty: {item.quantity}</p>
                      </div>
                      <span className='font-semibold text-gray-900 flex-shrink-0'>
                        ${item.total.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {checkoutCart.items.length > 3 && (
                    <p className="text-xs text-center text-gray-500 pt-2">
                      + {checkoutCart.items.length - 3} more item{checkoutCart.items.length - 3 !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between text-gray-600'>
                    <span>Subtotal</span>
                    <span className="font-medium">${checkoutCart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-gray-600'>
                    <span>Tax</span>
                    <span className="font-medium">${checkoutCart.tax.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-gray-600'>
                    <span>Shipping</span>
                    <span className="font-medium">${(selectedShipping?.price || 0).toFixed(2)}</span>
                  </div>
                  {checkoutCart.discount > 0 && (
                    <div className='flex justify-between text-green-600'>
                      <span>Discount</span>
                      <span className="font-medium">-${checkoutCart.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className='flex justify-between text-lg font-bold text-gray-900'>
                    <span>Total</span>
                    <span className="text-blue-600">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Multi-store warning */}
                {(() => {
                  const uniqueStores = new Set(
                    checkoutCart.items.map((item) => item.book.storeId),
                  );
                  if (uniqueStores.size > 1) {
                    return (
                      <div className='text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200 flex items-start space-x-2'>
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>
                          This order will be split into {uniqueStores.size}{' '}
                          separate orders (one per store)
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Submit Button */}
                <Button
                  type='submit'
                  size='lg'
                  disabled={isLoading || isSubmitting}
                  className='w-full'
                >
                  {isLoading || isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {(() => {
                        const uniqueStores = new Set(
                          checkoutCart.items.map((item) => item.book.storeId),
                        );
                        const orderText =
                          uniqueStores.size > 1 ? 'Place Orders' : 'Place Order';
                        return `${orderText} - $${finalTotal.toFixed(2)}`;
                      })()}
                    </>
                  )}
                </Button>

                {/* Security Badge */}
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Secure Checkout</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

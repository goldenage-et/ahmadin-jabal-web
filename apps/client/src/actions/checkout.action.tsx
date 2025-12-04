'use client';

import { useBuyNow } from '@/actions/buy-now.action';
import { createOrder } from '@/features/orders/actions/order.action';
import { getMyProfile } from '@/actions/profile.action';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { TCreateOrder, EPaymentMethod, EShippingMethod, TBookBasic } from '@repo/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useApiMutation } from '@/hooks/use-api-mutation';
import Image from 'next/image';
import { MapPin, Plus, CreditCard, Package } from 'lucide-react';
import { AddressForm } from '@/features/portfolio/address-form';

const checkoutSchema = z.object({
    shippingAddress: z.object({
        street: z.string().min(1, 'Street address is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        country: z.string().min(1, 'Country is required'),
        zipCode: z.string().min(1, 'ZIP code is required'),
    }),
    paymentMethod: z.nativeEnum(EPaymentMethod),
    shippingMethod: z.nativeEnum(EShippingMethod),
    quantity: z.coerce.number().min(1),
    customerNotes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault: boolean;
}

export function CheckoutForm() {
    const router = useRouter();
    const { buyNowItem, clearBuyNowItem } = useBuyNow();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

    const { mutate: submitOrder, isLoading: isSubmitting } = useApiMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            paymentMethod: EPaymentMethod.bankTransfer,
            shippingMethod: EShippingMethod.standard,
            quantity: 1,
            customerNotes: '',
        },
    });

    const paymentMethod = watch('paymentMethod');
    const quantity = watch('quantity');
    const shippingMethod = watch('shippingMethod');

    // Load user addresses
    useEffect(() => {
        const loadAddresses = async () => {
            try {
                const profile = await getMyProfile();
                if (profile && 'addresses' in profile) {
                    const userAddresses = profile.addresses || [];
                    setAddresses(userAddresses as Address[]);

                    // Set default address if available
                    const defaultAddress = userAddresses.find((addr: any) => addr.isDefault);
                    if (defaultAddress) {
                        setSelectedAddressId(defaultAddress.id);
                        setValue('shippingAddress', {
                            street: defaultAddress.street,
                            city: defaultAddress.city,
                            state: defaultAddress.state,
                            country: defaultAddress.country,
                            zipCode: defaultAddress.zipCode,
                        });
                    }
                }
            } catch (error) {
                console.error('Error loading addresses:', error);
            } finally {
                setIsLoadingAddresses(false);
            }
        };

        loadAddresses();
    }, [setValue]);

    // Redirect if no buy-now item
    useEffect(() => {
        if (!buyNowItem && !isLoadingAddresses) {
            toast.error('No item selected for checkout');
            router.push('/');
        }
    }, [buyNowItem, isLoadingAddresses, router]);

    // Update form when address is selected
    useEffect(() => {
        if (selectedAddressId) {
            const address = addresses.find((addr) => addr.id === selectedAddressId);
            if (address) {
                setValue('shippingAddress', {
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    country: address.country,
                    zipCode: address.zipCode,
                });
            }
        }
    }, [selectedAddressId, addresses, setValue]);

    if (!buyNowItem) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">No item selected for checkout</p>
                <Button onClick={() => router.push('/')} className="mt-4">
                    Continue Shopping
                </Button>
            </div>
        );
    }

    const book = buyNowItem as TBookBasic;

    // Calculate pricing
    const price = book.price || 0;
    const subtotal = price * quantity;
    const tax = subtotal * 0.15; // 15% tax (adjust as needed)
    const shippingCost = shippingMethod === EShippingMethod.express ? 50 : shippingMethod === EShippingMethod.pickup ? 0 : 30;
    const discount = 0; // Can be calculated based on promotions
    const total = subtotal + tax + shippingCost - discount;

    const onSubmit = async (data: CheckoutFormData) => {
        if (!book.id) {
            toast.error('Invalid book information');
            return;
        }

        const orderData: TCreateOrder[] = [
            {
                bookId: book.id,
                quantity: data.quantity,
                paymentMethod: data.paymentMethod,
                shippingAddress: data.shippingAddress,
                price: price,
                subtotal: subtotal,
                tax: tax,
                shipping: shippingCost,
                discount: discount,
                total: total,
                currency: 'ETB',
                shippingMethod: data.shippingMethod,
                customerNotes: data.customerNotes || undefined,
            },
        ];

        submitOrder(
            async () => {
                const response = await createOrder(orderData);
                if ('error' in response) {
                    throw new Error(response.error?.message || 'Failed to create order');
                }
                return response;
            },
            {
                onSuccess: (orders) => {
                    if (orders && orders.length > 0) {
                        clearBuyNowItem();
                        toast.success('Order created successfully!');
                        router.push(`/checkout/${orders[0].id}`);
                    }
                },
                onError: (error) => {
                    toast.error(error?.message || 'Failed to create order. Please try again.');
                },
            }
        );
    };

    const handleAddressSelect = (addressId: string) => {
        setSelectedAddressId(addressId);
        setShowAddressForm(false);
    };

    const handleAddressFormSuccess = () => {
        // Reload addresses
        getMyProfile()
            .then((profile) => {
                if (profile && 'addresses' in profile) {
                    setAddresses(profile.addresses as Address[]);
                }
            })
            .catch(console.error);
        setShowAddressForm(false);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Book Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-4">
                                    {book.images && book.images.length > 0 && (
                                        <div className="relative w-24 h-32 flex-shrink-0">
                                            <Image
                                                src={book.images[0].url}
                                                alt={book.title || 'Book'}
                                                fill
                                                className="object-cover rounded"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">{book.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Price: {price.toFixed(2)} ETB
                                        </p>
                                        <div className="mt-4">
                                            <Label htmlFor="quantity">Quantity</Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                min="1"
                                                max={book.inventoryQuantity || 999}
                                                {...register('quantity')}
                                                className="w-24 mt-1"
                                            />
                                            {errors.quantity && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.quantity.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {addresses.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Select Saved Address</Label>
                                        <RadioGroup
                                            value={selectedAddressId || ''}
                                            onValueChange={handleAddressSelect}
                                        >
                                            {addresses.map((address) => (
                                                <div
                                                    key={address.id}
                                                    className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
                                                >
                                                    <RadioGroupItem value={address.id} id={address.id} />
                                                    <Label
                                                        htmlFor={address.id}
                                                        className="flex-1 cursor-pointer"
                                                    >
                                                        <div>
                                                            <p className="font-medium">{address.street}</p>
                                                            <p className="text-sm text-gray-600">
                                                                {address.city}, {address.state} {address.zipCode}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {address.country}
                                                            </p>
                                                            {address.isDefault && (
                                                                <span className="text-xs text-blue-600">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                )}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowAddressForm(true)}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    {addresses.length > 0
                                        ? 'Add New Address'
                                        : 'Add Shipping Address'}
                                </Button>

                                <Separator />

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="street">Street Address</Label>
                                        <Input
                                            id="street"
                                            {...register('shippingAddress.street')}
                                            placeholder="123 Main Street"
                                            className={errors.shippingAddress?.street ? 'border-red-500' : ''}
                                        />
                                        {errors.shippingAddress?.street && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.shippingAddress.street.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                {...register('shippingAddress.city')}
                                                placeholder="City"
                                                className={errors.shippingAddress?.city ? 'border-red-500' : ''}
                                            />
                                            {errors.shippingAddress?.city && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.shippingAddress.city.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="state">State</Label>
                                            <Input
                                                id="state"
                                                {...register('shippingAddress.state')}
                                                placeholder="State"
                                                className={errors.shippingAddress?.state ? 'border-red-500' : ''}
                                            />
                                            {errors.shippingAddress?.state && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.shippingAddress.state.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="country">Country</Label>
                                            <Input
                                                id="country"
                                                {...register('shippingAddress.country')}
                                                placeholder="Country"
                                                className={errors.shippingAddress?.country ? 'border-red-500' : ''}
                                            />
                                            {errors.shippingAddress?.country && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.shippingAddress.country.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="zipCode">ZIP Code</Label>
                                            <Input
                                                id="zipCode"
                                                {...register('shippingAddress.zipCode')}
                                                placeholder="ZIP Code"
                                                className={errors.shippingAddress?.zipCode ? 'border-red-500' : ''}
                                            />
                                            {errors.shippingAddress?.zipCode && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.shippingAddress.zipCode.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Shipping Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={shippingMethod}
                                    onValueChange={(value) =>
                                        setValue('shippingMethod', value as EShippingMethod)
                                    }
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                            <RadioGroupItem
                                                value={EShippingMethod.standard}
                                                id="standard"
                                            />
                                            <Label htmlFor="standard" className="flex-1 cursor-pointer">
                                                <div className="flex justify-between items-center">
                                                    <span>Standard Shipping</span>
                                                    <span className="text-sm text-gray-600">30 ETB</span>
                                                </div>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                            <RadioGroupItem
                                                value={EShippingMethod.express}
                                                id="express"
                                            />
                                            <Label htmlFor="express" className="flex-1 cursor-pointer">
                                                <div className="flex justify-between items-center">
                                                    <span>Express Shipping</span>
                                                    <span className="text-sm text-gray-600">50 ETB</span>
                                                </div>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                            <RadioGroupItem
                                                value={EShippingMethod.pickup}
                                                id="pickup"
                                            />
                                            <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                                                <div className="flex justify-between items-center">
                                                    <span>Pickup</span>
                                                    <span className="text-sm text-gray-600">Free</span>
                                                </div>
                                            </Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Payment Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={(value) =>
                                        setValue('paymentMethod', value as EPaymentMethod)
                                    }
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                            <RadioGroupItem
                                                value={EPaymentMethod.bankTransfer}
                                                id="bankTransfer"
                                            />
                                            <Label
                                                htmlFor="bankTransfer"
                                                className="flex-1 cursor-pointer"
                                            >
                                                Bank Transfer
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                            <RadioGroupItem
                                                value={EPaymentMethod.onDelivery}
                                                id="onDelivery"
                                            />
                                            <Label
                                                htmlFor="onDelivery"
                                                className="flex-1 cursor-pointer"
                                            >
                                                Cash on Delivery
                                            </Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        {/* Customer Notes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Notes (Optional)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <textarea
                                    {...register('customerNotes')}
                                    placeholder="Any special instructions for your order..."
                                    className="w-full min-h-[100px] p-3 border rounded-lg resize-none"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle>Order Total</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>{subtotal.toFixed(2)} ETB</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>{tax.toFixed(2)} ETB</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>{shippingCost.toFixed(2)} ETB</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span>-{discount.toFixed(2)} ETB</span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>{total.toFixed(2)} ETB</span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Processing...' : 'Place Order'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>

            {/* Address Form Modal */}
            <AddressForm
                isOpen={showAddressForm}
                onClose={() => setShowAddressForm(false)}
                onSuccess={handleAddressFormSuccess}
                editingAddress={null}
            />
        </div>
    );
}


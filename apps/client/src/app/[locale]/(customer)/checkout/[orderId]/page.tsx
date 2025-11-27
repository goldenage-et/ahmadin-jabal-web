import { getMyOrderDetails } from '@/actions/profile.action';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EOrderStatus, EPaymentMethod, EPaymentStatus, type TOrderDetail } from '@repo/common';
import { Clock, CreditCard, MapPin, Package, Truck } from 'lucide-react';
import { notFound } from 'next/navigation';
import { OrderActions } from './_components/order-actions';

export default async function OrderReviewPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;

    const response = await getMyOrderDetails(orderId);

    if (!response || 'error' in response) {
        notFound();
    }


    const order = response as TOrderDetail;

    const getStatusColor = (status: EOrderStatus) => {
        const colors = {
            [EOrderStatus.pending]: 'bg-yellow-100 text-yellow-800',
            [EOrderStatus.confirmed]: 'bg-blue-100 text-blue-800',
            [EOrderStatus.processing]: 'bg-purple-100 text-purple-800',
            [EOrderStatus.shipped]: 'bg-indigo-100 text-indigo-800',
            [EOrderStatus.delivered]: 'bg-green-100 text-green-800',
            [EOrderStatus.cancelled]: 'bg-red-100 text-red-800',
            [EOrderStatus.refunded]: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusColor = (status: EPaymentStatus) => {
        const colors = {
            [EPaymentStatus.pending]: 'bg-yellow-100 text-yellow-800',
            [EPaymentStatus.paid]: 'bg-green-100 text-green-800',
            [EPaymentStatus.failed]: 'bg-red-100 text-red-800',
            [EPaymentStatus.refunded]: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Review</h1>
                    <p className="text-gray-600">Order #{order.orderNumber}</p>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Package className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Order Status</p>
                                        <Badge className={getStatusColor(order.status)}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <CreditCard className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Payment Status</p>
                                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Shipping Address */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5" />
                            <span>Shipping Address</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-gray-700">
                            <p>{order.shippingAddress.street}</p>
                            <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment & Shipping Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <CreditCard className="h-5 w-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Payment Method</p>
                                <p className="font-medium">
                                    {order.paymentMethod === EPaymentMethod.onDelivery
                                        ? 'Cash on Delivery'
                                        : 'Bank Transfer'}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-center space-x-3">
                            <Truck className="h-5 w-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Shipping Method</p>
                                <p className="font-medium capitalize">{order.shippingMethod}</p>
                            </div>
                        </div>

                        {order.trackingNumber && (
                            <>
                                <Separator />
                                <div className="flex items-center space-x-3">
                                    <Package className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Tracking Number</p>
                                        <p className="font-medium">{order.trackingNumber}</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {order.estimatedDelivery && (
                            <>
                                <Separator />
                                <div className="flex items-center space-x-3">
                                    <Clock className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Estimated Delivery</p>
                                        <p className="font-medium">
                                            {new Date(order.estimatedDelivery).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Order Summary */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Tax</span>
                                <span>${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Shipping</span>
                                <span>${order.shipping.toFixed(2)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-${order.discount.toFixed(2)}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notes */}
                {(order.customerNotes || order.notes) && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {order.customerNotes && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Customer Notes</p>
                                    <p className="text-gray-700">{order.customerNotes}</p>
                                </div>
                            )}
                            {order.notes && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Order Notes</p>
                                    <p className="text-gray-700">{order.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Action Buttons */}
                <OrderActions
                    orderId={order.id}
                    paymentStatus={order.paymentStatus}
                    paymentMethod={order.paymentMethod}
                />

                <div className="text-center text-sm text-gray-500 mt-8">
                    <p>Created on {new Date(order.createdAt).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}

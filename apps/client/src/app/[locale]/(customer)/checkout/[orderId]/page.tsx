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
            [EOrderStatus.pending]: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
            [EOrderStatus.confirmed]: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
            [EOrderStatus.processing]: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
            [EOrderStatus.shipped]: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
            [EOrderStatus.delivered]: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
            [EOrderStatus.cancelled]: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
            [EOrderStatus.refunded]: 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200',
        };
        return colors[status] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    };

    const getPaymentStatusColor = (status: EPaymentStatus) => {
        const colors = {
            [EPaymentStatus.pending]: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
            [EPaymentStatus.paid]: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
            [EPaymentStatus.failed]: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
            [EPaymentStatus.refunded]: 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200',
        };
        return colors[status] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    };

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Order Review</h1>
                    <p className="text-muted-foreground">Order #{order.orderNumber}</p>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Package className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Order Status</p>
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
                                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Payment Status</p>
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
                        <div className="text-foreground">
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
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
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
                                <p className="text-sm text-muted-foreground">Shipping Method</p>
                                <p className="font-medium capitalize">{order.shippingMethod}</p>
                            </div>
                        </div>

                        {order.trackingNumber && (
                            <>
                                <Separator />
                                <div className="flex items-center space-x-3">
                                    <Package className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Tracking Number</p>
                                        <p className="font-medium">{order.trackingNumber}</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {order.estimatedDelivery && (
                            <>
                                <Separator />
                                <div className="flex items-center space-x-3">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Estimated Delivery</p>
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
                            <div className="flex justify-between text-foreground">
                                <span>Subtotal</span>
                                <span>{order.subtotal.toFixed(2)} {order.currency || 'ETB'}</span>
                            </div>
                            <div className="flex justify-between text-foreground">
                                <span>Tax</span>
                                <span>{order.tax.toFixed(2)} {order.currency || 'ETB'}</span>
                            </div>
                            <div className="flex justify-between text-foreground">
                                <span>Shipping</span>
                                <span>{order.shipping.toFixed(2)} {order.currency || 'ETB'}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-primary">
                                    <span>Discount</span>
                                    <span>-{order.discount.toFixed(2)} {order.currency || 'ETB'}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between text-lg font-bold text-foreground">
                                <span>Total</span>
                                <span>{order.total.toFixed(2)} {order.currency || 'ETB'}</span>
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
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Customer Notes</p>
                                    <p className="text-foreground">{order.customerNotes}</p>
                                </div>
                            )}
                            {order.notes && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Order Notes</p>
                                    <p className="text-foreground">{order.notes}</p>
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

                <div className="text-center text-sm text-muted-foreground mt-8">
                    <p>Created on {new Date(order.createdAt).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}

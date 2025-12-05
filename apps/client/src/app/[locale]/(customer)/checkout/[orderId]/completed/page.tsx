import { getMyOrderDetails } from '@/actions/profile.action';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EOrderStatus, EPaymentMethod, EPaymentStatus, type TOrderDetail } from '@repo/common';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    CreditCard,
    MapPin,
    Package,
    ShoppingBag,
    Truck,
} from 'lucide-react';
import { notFound } from 'next/navigation';
import { CelebrationToast } from './_components/celebration-toast';
import { OrderActions as CompletedOrderActions } from './_components/order-actions';
import { QuickActions } from './_components/quick-actions';

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={className}>{children}</div>;
}

export default async function OrderCompletedPage({ params }: { params: Promise<{ orderId: string }> }) {
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

    const isPaid = order.paymentStatus === EPaymentStatus.paid;
    const isCashOnDelivery = order.paymentMethod === EPaymentMethod.onDelivery;

    return (
        <div className="min-h-screen bg-background dark:bg-background py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <CelebrationToast />

                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
                        <CheckCircle className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                        {isPaid || isCashOnDelivery ? 'Order Confirmed!' : 'Order Placed!'}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Thank you for your order
                    </p>
                    <p className="text-muted-foreground mt-2">
                        Order Number: <span className="font-mono font-semibold">#{order.orderNumber}</span>
                    </p>
                </div>

                {/* Payment Status Alert */}
                {isPaid ? (
                    <Alert className="mb-6 bg-primary/10 border-primary/20">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <AlertDescription className="text-foreground">
                            <p className="font-medium">Payment Successful</p>
                            <p className="text-sm mt-1">
                                Your payment has been confirmed and your order is being processed.
                            </p>
                        </AlertDescription>
                    </Alert>
                ) : isCashOnDelivery ? (
                    <Alert className="mb-6 bg-primary/10 border-primary/20">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <AlertDescription className="text-foreground">
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-sm mt-1">
                                Please have {order.total.toFixed(2)} {order.currency || 'ETB'} ready when your order arrives.
                                You can pay in cash to the delivery person.
                            </p>
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert className="mb-6 bg-primary/10 border-primary/20">
                        <AlertCircle className="h-4 w-4 text-primary" />
                        <AlertDescription className="text-foreground">
                            <p className="font-medium">Payment Pending</p>
                            <p className="text-sm mt-1">
                                Your order is confirmed, but payment verification is still pending.
                                We'll notify you once the payment is confirmed.
                            </p>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Quick Actions */}
                <QuickActions orderNumber={order.orderNumber} />

                {/* Order Status */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Order Status</span>
                            <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-foreground">Order Placed</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {isPaid && (
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-foreground">Payment Confirmed</p>
                                        <p className="text-sm text-muted-foreground">
                                            Your payment has been received and verified
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-muted-foreground">Processing</p>
                                    <p className="text-sm text-muted-foreground">
                                        We'll start processing your order soon
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Truck className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-muted-foreground">Shipped</p>
                                    <p className="text-sm text-muted-foreground">
                                        Your order will be shipped when ready
                                    </p>
                                </div>
                            </div>

                            {order.estimatedDelivery && (
                                <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                    <div className="flex items-center space-x-2 text-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Order Items (details removed from schema) */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <ShoppingBag className="h-5 w-5" />
                            <span>Order Quantity</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            Total items: <span className="font-medium">{order.quantity}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery Information */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5" />
                            <span>Delivery Information</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-sm text-muted-foreground mb-1">Shipping Address</Label>
                            <div className="text-muted-foreground">
                                <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                                <p>
                                    <span className="text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</span>
                                </p>
                                <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <Label className="text-sm text-muted-foreground mb-1">Shipping Method</Label>
                            <p className="font-medium capitalize">{order.shippingMethod}</p>
                        </div>

                        {order.trackingNumber && (
                            <>
                                <Separator />
                                <div>
                                    <Label className="text-sm text-muted-foreground mb-1">Tracking Number</Label>
                                    <p className="font-mono font-medium">{order.trackingNumber}</p>
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
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>{order.subtotal.toFixed(2)} {order.currency || 'ETB'}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Tax</span>
                                <span>{order.tax.toFixed(2)} {order.currency || 'ETB'}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
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
                            <div className="flex justify-between text-xl font-bold text-foreground">
                                <span>Total</span>
                                <span>{order.total.toFixed(2)} {order.currency || 'ETB'}</span>
                            </div>
                            <div className="text-sm text-muted-foreground text-right">
                                Payment Method: {order.paymentMethod === EPaymentMethod.onDelivery
                                    ? 'Cash on Delivery'
                                    : 'Bank Transfer'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* What's Next */}
                <Card className="mb-6 bg-linear-to-r from-primary/10 to-primary/20 border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-foreground">What's Next?</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Here's what you can expect
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-start space-x-3">
                            <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                            <p className="text-foreground">
                                You'll receive an email confirmation with your order details
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                            <p className="text-foreground">
                                We'll notify you when your order is being processed
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                            <p className="text-foreground">
                                Track your order status in the "My Orders" section
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                            <p className="text-foreground">
                                You'll receive tracking information when your order ships
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <CompletedOrderActions orderId={order.id} />

                {/* Support Section */}
                <Card className="mt-6 border-dashed">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-muted-foreground mb-2">
                                Need help with your order?
                            </p>
                            <div className="text-primary">
                                Contact Support
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

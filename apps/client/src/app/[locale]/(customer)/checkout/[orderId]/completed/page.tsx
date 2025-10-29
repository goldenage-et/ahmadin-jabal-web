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

    const isPaid = order.paymentStatus === EPaymentStatus.paid;
    const isCashOnDelivery = order.paymentMethod === EPaymentMethod.onDelivery;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <CelebrationToast />

                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {isPaid || isCashOnDelivery ? 'Order Confirmed!' : 'Order Placed!'}
                    </h1>
                    <p className="text-xl text-gray-600">
                        Thank you for your order
                    </p>
                    <p className="text-gray-500 mt-2">
                        Order Number: <span className="font-mono font-semibold">#{order.orderNumber}</span>
                    </p>
                </div>

                {/* Payment Status Alert */}
                {isPaid ? (
                    <Alert className="mb-6 bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-900">
                            <p className="font-medium">Payment Successful</p>
                            <p className="text-sm mt-1">
                                Your payment has been confirmed and your order is being processed.
                            </p>
                        </AlertDescription>
                    </Alert>
                ) : isCashOnDelivery ? (
                    <Alert className="mb-6 bg-blue-50 border-blue-200">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-900">
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-sm mt-1">
                                Please have ${order.total.toFixed(2)} ready when your order arrives.
                                You can pay in cash to the delivery person.
                            </p>
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert className="mb-6 bg-yellow-50 border-yellow-200">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-900">
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
                                <div className="p-2 bg-green-100 rounded-full">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">Order Placed</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {isPaid && (
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">Payment Confirmed</p>
                                        <p className="text-sm text-gray-500">
                                            Your payment has been received and verified
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-gray-100 rounded-full">
                                    <Package className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-500">Processing</p>
                                    <p className="text-sm text-gray-400">
                                        We'll start processing your order soon
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-gray-100 rounded-full">
                                    <Truck className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-500">Shipped</p>
                                    <p className="text-sm text-gray-400">
                                        Your order will be shipped when ready
                                    </p>
                                </div>
                            </div>

                            {order.estimatedDelivery && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center space-x-2 text-blue-900">
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

                {/* Order Items */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <ShoppingBag className="h-5 w-5" />
                            <span>Order Items ({order.totalItems})</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-start space-x-4 pb-4 border-b last:border-0">
                                    {item.bookImage && (
                                        <img
                                            src={item.bookImage}
                                            alt={item.bookName || 'Book'}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.bookName}</h3>
                                        {item.bookSku && (
                                            <p className="text-sm text-gray-500">SKU: {item.bookSku}</p>
                                        )}
                                        {item.variantName && (
                                            <p className="text-sm text-gray-500">Variant: {item.variantName}</p>
                                        )}
                                        <p className="text-sm text-gray-600 mt-1">
                                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">${item.total.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
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
                            <Label className="text-sm text-gray-500 mb-1">Shipping Address</Label>
                            <div className="text-gray-700">
                                <p>{order.shippingAddress.street}</p>
                                <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                </p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <Label className="text-sm text-gray-500 mb-1">Shipping Method</Label>
                            <p className="font-medium capitalize">{order.shippingMethod}</p>
                        </div>

                        {order.trackingNumber && (
                            <>
                                <Separator />
                                <div>
                                    <Label className="text-sm text-gray-500 mb-1">Tracking Number</Label>
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
                            <div className="flex justify-between text-xl font-bold text-gray-900">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                            <div className="text-sm text-gray-500 text-right">
                                Payment Method: {order.paymentMethod === EPaymentMethod.onDelivery
                                    ? 'Cash on Delivery'
                                    : 'Bank Transfer'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* What's Next */}
                <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-900">What's Next?</CardTitle>
                        <CardDescription className="text-blue-700">
                            Here's what you can expect
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-start space-x-3">
                            <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500" />
                            <p className="text-blue-900">
                                You'll receive an email confirmation with your order details
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500" />
                            <p className="text-blue-900">
                                We'll notify you when your order is being processed
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500" />
                            <p className="text-blue-900">
                                Track your order status in the "My Orders" section
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500" />
                            <p className="text-blue-900">
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
                            <p className="text-gray-600 mb-2">
                                Need help with your order?
                            </p>
                            <div className="text-blue-600">
                                Contact Support
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getOrder } from '@/features/orders/actions/order.action';
import { EPaymentStatus, type TOrderDetail } from '@repo/common';
import {
    CreditCard,
    ArrowLeft,
    AlertCircle,
    Clock,
    Smartphone
} from 'lucide-react';
import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { getMyOrderDetails } from '@/actions/profile.action';

export default async function OnlinePaymentPage({
    params
}: {
    params: Promise<{ orderId: string; provider: string }>
}) {
    const { orderId, provider } = await params;

    const response = await getMyOrderDetails(orderId);

    if (!response || 'error' in response) {
        notFound();
    }

    const order = response as TOrderDetail;

    if (order.paymentStatus === EPaymentStatus.paid) {
        redirect(`/checkout/${orderId}/completed`);
    }

    const getProviderInfo = (providerCode: string) => {
        const providers: Record<string, { name: string; icon: any; description: string }> = {
            telebirr: {
                name: 'Telebirr',
                icon: Smartphone,
                description: 'Pay with Telebirr mobile wallet',
            },
            mpesa: {
                name: 'M-Pesa',
                icon: Smartphone,
                description: 'Pay with M-Pesa mobile money',
            },
            stripe: {
                name: 'Stripe',
                icon: CreditCard,
                description: 'Pay with credit or debit card',
            },
            paypal: {
                name: 'PayPal',
                icon: CreditCard,
                description: 'Pay with PayPal',
            },
        };

        return providers[providerCode] || {
            name: providerCode.charAt(0).toUpperCase() + providerCode.slice(1),
            icon: CreditCard,
            description: 'Online payment provider',
        };
    };

    const providerInfo = getProviderInfo(provider);
    const ProviderIcon = providerInfo.icon;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href={`/checkout/${orderId}/payment`}>
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Payment Methods
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Online Payment</h1>
                    <p className="text-gray-600">Order #{order.orderNumber}</p>
                </div>

                {/* Order Summary */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">{order.totalItems} item(s)</p>
                                <p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800">
                                Payment Pending
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Coming Soon Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                            <div className="p-4 bg-purple-100 rounded-full">
                                <ProviderIcon className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-2xl">{providerInfo.name}</CardTitle>
                                <CardDescription className="text-base mt-1">
                                    {providerInfo.description}
                                </CardDescription>
                            </div>
                            <Badge className="bg-amber-100 text-amber-800">Coming Soon</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Alert className="bg-blue-50 border-blue-200">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-900">
                                <p className="font-medium mb-2">Online Payment Integration Coming Soon</p>
                                <p>
                                    We're working hard to bring you a seamless online payment experience with {providerInfo.name}.
                                    This feature will be available in the near future.
                                </p>
                            </AlertDescription>
                        </Alert>

                        <div className="p-6 bg-gray-50 rounded-lg space-y-4">
                            <h3 className="font-semibold text-gray-900 mb-3">What's Coming:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start space-x-3">
                                    <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-500" />
                                    <span className="text-gray-700">
                                        Secure payment processing with {providerInfo.name}
                                    </span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-500" />
                                    <span className="text-gray-700">
                                        Instant payment confirmation
                                    </span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-500" />
                                    <span className="text-gray-700">
                                        Multiple payment options (cards, mobile money, etc.)
                                    </span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-500" />
                                    <span className="text-gray-700">
                                        Secure encryption and fraud protection
                                    </span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-500" />
                                    <span className="text-gray-700">
                                        Transaction history and receipts
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <p className="font-medium mb-1">Need to pay now?</p>
                                <p>
                                    Please use our Bank Transfer option which is currently available. You can go back
                                    to payment methods and select Bank Transfer to complete your payment.
                                </p>
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>

                {/* Alternative Payment Options */}
                <Card className="mb-6 bg-green-50 border-green-200">
                    <CardHeader>
                        <CardTitle className="text-green-900">Available Payment Methods</CardTitle>
                        <CardDescription className="text-green-700">
                            Use these methods to complete your payment now
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <Link href={`/checkout/${orderId}/payment`}>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-auto py-4 bg-white hover:bg-green-50 border-green-300"
                                >
                                    <div className="flex items-center space-x-3 w-full">
                                        <CreditCard className="h-5 w-5 text-green-600" />
                                        <div className="text-left flex-1">
                                            <p className="font-medium text-green-900">Bank Transfer</p>
                                            <p className="text-sm text-green-700">
                                                Transfer directly to our bank account
                                            </p>
                                        </div>
                                        <ArrowLeft className="h-4 w-4 rotate-180 text-green-600" />
                                    </div>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                    <Link href={`/checkout/${orderId}`}>
                        <Button variant="outline">
                            View Order Details
                        </Button>
                    </Link>

                    <Link href={`/checkout/${orderId}/payment`}>
                        <Button size="lg">
                            Choose Another Payment Method
                        </Button>
                    </Link>
                </div>

                {/* Notification Signup (Future Feature) */}
                <Card className="mt-6 border-dashed">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">
                                Want to be notified when {providerInfo.name} payment is available?
                            </p>
                            <Button variant="link" className="text-purple-600">
                                Notify Me When Available
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

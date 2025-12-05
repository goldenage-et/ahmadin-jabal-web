import { getBanks } from '@/actions/bank-transfer.action';
import { getMyOrderDetails } from '@/actions/profile.action';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EPaymentMethod, EPaymentStatus, TBankAccount, TBankInfo, type TOrderDetail } from '@repo/common';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { PaymentMethodSelector } from './_components/payment-method-selector';
import { getBankAccounts } from '@/actions/bank-account.action';

export default async function PaymentMethodSelectionPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;

    const response = await getMyOrderDetails(orderId);

    if (!response || 'error' in response) {
        notFound();
    }

    const order = response as TOrderDetail;

    // Fetch bank accounts and banks, handle errors gracefully
    let bankAccounts: TBankAccount[] = [];
    let banks: TBankInfo[] = [];

    try {
        bankAccounts = await getBankAccounts();
        if (!Array.isArray(bankAccounts)) {
            bankAccounts = [];
        }
    } catch (error) {
        console.error('Error fetching bank accounts:', error);
        bankAccounts = [];
    }

    try {
        banks = await getBanks();
        if (!Array.isArray(banks)) {
            banks = [];
        }
    } catch (error) {
        console.error('Error fetching banks:', error);
        banks = [];
    }

    // Redirect if already paid
    if (order.paymentStatus === EPaymentStatus.paid) {
        redirect(`/checkout/${orderId}/completed`);
    }

    // Redirect if payment method is cash on delivery
    if (order.paymentMethod === EPaymentMethod.onDelivery) {
        redirect(`/checkout/${orderId}/completed`);
    }

    return (
        <div className="min-h-screen bg-background dark:bg-background py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href={`/checkout/${orderId}`}>
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Order
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground dark:text-foreground mb-2">Select Payment Method</h1>
                    <p className="text-muted-foreground">Order #{order.orderNumber}</p>
                </div>

                {/* Order Summary Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-2xl font-bold text-foreground dark:text-foreground">{order.total.toFixed(2)} {order.currency || 'ETB'}</p>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800">
                                Payment Pending
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Methods */}
                <PaymentMethodSelector order={order} bankAccounts={bankAccounts}
                    banks={banks}
                />

                {/* Help Text */}
                <Card className="bg-primary/10 border-primary/20">
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                            <div className="text-sm text-foreground">
                                <p className="font-medium mb-1">Need Help?</p>
                                <p>
                                    If you have any questions about payment methods or need assistance,
                                    please contact our support team.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

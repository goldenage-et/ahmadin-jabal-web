import { getBanks } from '@/actions/bank-transfer.action';
import { getMyOrderDetails } from '@/actions/profile.action';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EPaymentStatus, type TBankAccount, type TOrderDetail } from '@repo/common';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRightLeft,
    Banknote,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { BankAccountSelector } from './_components/bank-account-selector';
import { getBankAccounts } from '@/actions/bank-account.action';

export default async function BankTransferPaymentPage({
    params
}: {
    params: Promise<{ orderId: string; bankCode: string }>
}) {
    const { orderId, bankCode } = await params;

    const [orderResponse, banksResponse] = await Promise.all([
        getMyOrderDetails(orderId),
        getBanks(),
    ]);

    if (!orderResponse || 'error' in orderResponse) {
        notFound();
    }

    const order = orderResponse as TOrderDetail;
    const banks = banksResponse || [];
    const selectedBank = banks.find(b => b.code === bankCode);

    if (!selectedBank) {
        notFound();
    }

    if (order.paymentStatus === EPaymentStatus.paid) {
        redirect(`/checkout/${orderId}/completed`);
    }

    const bankAccounts = await getBankAccounts();
    // Fetch bank accounts
    // Group accounts by whether they match the selected bank code
    const recommendedAccounts = bankAccounts.filter(account =>
        account.bankCode === bankCode
    );
    const otherAccounts = bankAccounts.filter(account =>
        account.bankCode !== bankCode
    );

    // If there are no accounts at all
    if (bankAccounts.length === 0) {
        return (
            <div className="min-h-screen bg-background py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="border-primary/20">
                        <CardContent className="pt-6 text-center">
                            <AlertCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-foreground mb-2">No Bank Accounts Available</h2>
                            <p className="text-muted-foreground mb-4">
                                The accounts haven't set up any bank accounts yet. Please contact support or try another payment method.
                            </p>
                            <Link href={`/checkout/${orderId}/payment`}>
                                <Button>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Choose Another Payment Method
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href={`/checkout/${orderId}/payment`}>
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Payment Methods
                        </Button>
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Complete Bank Transfer</h1>
                            <p className="text-muted-foreground">Order #{order.orderNumber}</p>
                        </div>
                        <Badge className="bg-primary/10 text-primary text-base px-4 py-2">
                            {selectedBank.name}
                        </Badge>
                    </div>
                </div>

                {/* Progress Steps */}
                <Card className="mb-6 bg-linear-to-r from-primary/10 to-primary/20 border-primary/20">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-primary rounded-full">
                                    <Banknote className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">1. Transfer Money</p>
                                    <p className="text-sm text-muted-foreground">Use your {selectedBank.name} account</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-primary rounded-full">
                                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">2. Verify Reference</p>
                                    <p className="text-sm text-muted-foreground">Enter your receipt reference</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-primary rounded-full">
                                    <ArrowRightLeft className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">3. Order Confirmed</p>
                                    <p className="text-sm text-muted-foreground">We process your order</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - 2/3 width */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Bank Account Selection */}
                        <BankAccountSelector
                            recommendedAccounts={recommendedAccounts}
                            otherAccounts={otherAccounts}
                            selectedBankName={selectedBank.name}
                            order={order}
                            orderId={orderId}
                            selectedBank={selectedBank}
                        />

                        {/* Instructions */}
                        <Card className="bg-primary/10 border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-foreground text-base">
                                    <AlertCircle className="h-5 w-5" />
                                    <span>Step-by-Step Payment Instructions</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-foreground">
                                <ol className="space-y-4">
                                    <li className="flex items-start space-x-3">
                                        <span className="shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                        <div>
                                            <p className="font-medium">Select a bank account from the list above</p>
                                            <p className="text-sm text-muted-foreground">
                                                {recommendedAccounts.length > 0
                                                    ? `Accounts matching your bank (${selectedBank.name}) are recommended for faster automatic verification`
                                                    : 'Choose any available account to transfer the payment to'}
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                        <div>
                                            <p className="font-medium">Copy the account details and open your {selectedBank.name} mobile banking app</p>
                                            <p className="text-sm text-muted-foreground">You can also visit a {selectedBank.name} branch if you prefer. Using the mobile app is faster and more convenient.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                        <div>
                                            <p className="font-medium">Transfer exactly {order.total.toFixed(2)} {order.currency || 'ETB'} to the selected account</p>
                                            <p className="text-sm text-muted-foreground">Use the exact amount shown in the order summary. Different amounts may cause verification delays.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                        <div>
                                            <p className="font-medium">Save or screenshot your transfer receipt</p>
                                            <p className="text-sm text-muted-foreground">You'll need the {selectedBank.referenceLabel || 'reference number'} from your transfer receipt to verify the payment</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">5</span>
                                        <div>
                                            <p className="font-medium">Enter the {selectedBank.referenceLabel || 'reference number'} in the form below and click "Validate Payment"</p>
                                            <p className="text-sm text-muted-foreground">Our system will automatically verify your payment with {selectedBank.name} and download your receipt</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">6</span>
                                        <div>
                                            <p className="font-medium">Review the receipt details and confirm payment</p>
                                            <p className="text-sm text-muted-foreground">Once confirmed, your order will be processed immediately and you'll be redirected to the order confirmation page</p>
                                        </div>
                                    </li>
                                </ol>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - 1/3 width */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Order Summary */}
                        <Card className="sticky top-28">
                            <CardHeader>
                                <CardTitle className="text-base">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-sm text-muted-foreground">Items</span>
                                    <span className="font-semibold">{order.quantity}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-sm text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-sm text-muted-foreground">Tax</span>
                                    <span className="font-medium">${order.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-sm text-muted-foreground">Shipping</span>
                                    <span className="font-medium">${order.shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-semibold text-lg">Total</span>
                                    <span className="font-bold text-2xl text-primary">${order.total.toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Help */}
                        <Card className="bg-primary/10 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-base">Need Help?</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground space-y-3">
                                <p>If you encounter any issues with the payment:</p>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Select an account from the list</li>
                                    <li>Double-check the account number</li>
                                    <li>Ensure the amount is exact</li>
                                    <li>Keep your receipt for reference</li>
                                    <li>Contact support if validation fails</li>
                                </ul>
                                <Link href={`/checkout/${orderId}`}>
                                    <Button variant="outline" size="sm" className="w-full mt-3">
                                        View Full Order Details
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

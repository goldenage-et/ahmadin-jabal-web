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
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="border-red-200">
                        <CardContent className="pt-6 text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-gray-900 mb-2">No Bank Accounts Available</h2>
                            <p className="text-gray-600 mb-4">
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
        <div className="min-h-screen bg-gray-50 py-12">
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Bank Transfer</h1>
                            <p className="text-gray-600">Order #{order.orderNumber}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 text-base px-4 py-2">
                            {selectedBank.name}
                        </Badge>
                    </div>
                </div>

                {/* Progress Steps */}
                <Card className="mb-6 bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-blue-600 rounded-full">
                                    <Banknote className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-blue-900">1. Transfer Money</p>
                                    <p className="text-sm text-blue-700">Use your {selectedBank.name} account</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-blue-400 rounded-full">
                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-blue-900">2. Verify Reference</p>
                                    <p className="text-sm text-blue-700">Enter your receipt reference</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-blue-200 rounded-full">
                                    <ArrowRightLeft className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-blue-900">3. Order Confirmed</p>
                                    <p className="text-sm text-blue-700">We process your order</p>
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
                        <Card className="bg-blue-50 border-blue-200">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-blue-900 text-base">
                                    <AlertCircle className="h-5 w-5" />
                                    <span>Step-by-Step Instructions</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-blue-900">
                                <ol className="space-y-3">
                                    <li className="flex items-start space-x-3">
                                        <span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                        <div>
                                            <p className="font-medium">Select a store account from the list above</p>
                                            <p className="text-sm text-blue-700">
                                                {recommendedAccounts.length > 0
                                                    ? 'Accounts matching your bank are recommended for faster verification'
                                                    : 'Choose any available account to transfer to'}
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                        <div>
                                            <p className="font-medium">Open your {selectedBank.name} mobile app or visit a branch</p>
                                            <p className="text-sm text-blue-700">Use the app for faster processing</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                        <div>
                                            <p className="font-medium">Transfer ${order.total.toFixed(2)} to the selected account</p>
                                            <p className="text-sm text-blue-700">Use the exact amount shown in the order summary</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                        <div>
                                            <p className="font-medium">Save your transfer receipt</p>
                                            <p className="text-sm text-blue-700">You'll need the {selectedBank.referenceLabel || 'reference number'} from it</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                                        <div>
                                            <p className="font-medium">Enter the reference number and click "Validate"</p>
                                            <p className="text-sm text-blue-700">We'll verify your payment automatically</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
                                        <div>
                                            <p className="font-medium">Confirm payment to complete your order</p>
                                            <p className="text-sm text-blue-700">Your order will be processed immediately</p>
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
                                    <span className="text-sm text-gray-600">Items</span>
                                    <span className="font-semibold">{order.quantity}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-sm text-gray-600">Subtotal</span>
                                    <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-sm text-gray-600">Tax</span>
                                    <span className="font-medium">${order.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-sm text-gray-600">Shipping</span>
                                    <span className="font-medium">${order.shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-semibold text-lg">Total</span>
                                    <span className="font-bold text-2xl text-blue-600">${order.total.toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Help */}
                        <Card className="bg-gray-50 border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-base">Need Help?</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-gray-600 space-y-3">
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

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { completePayment } from '@/actions/payment.action';
import { TBankClientReceiptData, EPaymentStatus } from '@repo/common';
import {
    CheckCircle,
    Loader2,
    CreditCard,
    User,
    Hash,
    Calendar,
    DollarSign,
    AlertCircle,
    ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/hooks/use-api-mutation';

interface BankTransferFormProps {
    orderId: string;
    bankCode: string;
    bankName: string;
    bankAccountId: string;
    referenceLabel: string;
    referencePlaceholder: string;
    orderTotal: number;
}

export function BankTransferForm({
    orderId,
    bankCode,
    bankName,
    bankAccountId,
    referenceLabel,
    referencePlaceholder,
    orderTotal,
}: BankTransferFormProps) {
    const router = useRouter();
    const [reference, setReference] = useState('');
    const [receiptData, setReceiptData] = useState<TBankClientReceiptData | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);

    const { mutate: processPayment, isLoading: isProcessing } = useApiMutation();

    const handleCompletePayment = async () => {
        if (!reference.trim()) {
            toast.error('Please enter a reference number');
            return;
        }

        processPayment(
            async () => {
                return await completePayment(
                    orderId,
                    bankCode,
                    reference.trim(),
                    bankAccountId,
                );
            },
            {
                onSuccess: (result) => {
                    if (result && 'receiptData' in result) {
                        setReceiptData(result.receiptData as TBankClientReceiptData);
                        setIsCompleted(true);
                        toast.success('Payment completed successfully!');

                        // Redirect to completion page after a short delay
                        setTimeout(() => {
                            router.push(`/checkout/${orderId}/completed`);
                        }, 2000);
                    }
                },
                onError: (error) => {
                    const errorMessage = error?.message || 'Failed to complete payment';
                    toast.error(errorMessage);
                },
            }
        );
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Payment Verification</span>
                    {isCompleted && (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    )}
                </CardTitle>
                <CardDescription>
                    Enter your transfer reference number to complete the payment
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!isCompleted ? (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="reference">
                                {referenceLabel || 'Reference Number'}
                            </Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="reference"
                                    placeholder={referencePlaceholder || 'Enter reference number'}
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    disabled={isProcessing}
                                    className="flex-1"
                                    autoComplete="off"
                                />
                                <Button
                                    onClick={handleCompletePayment}
                                    disabled={isProcessing || !reference.trim()}
                                    size="lg"
                                    className="min-w-[180px]"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Complete Payment
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500">
                                We'll automatically validate your reference and confirm the payment
                            </p>
                        </div>

                        <Alert className="bg-blue-50 border-blue-200">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-900">
                                <p className="font-medium mb-1">What happens next?</p>
                                <ol className="text-sm space-y-1 list-decimal list-inside">
                                    <li>We'll validate your reference number with {bankName}</li>
                                    <li>Download and verify your receipt automatically</li>
                                    <li>Check that the amount matches your order</li>
                                    <li>Confirm your payment and update your order status</li>
                                </ol>
                            </AlertDescription>
                        </Alert>
                    </>
                ) : (
                    <div className="space-y-4">
                        {/* Payment Completed Successfully */}
                        <Alert className="bg-green-50 border-green-200">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <AlertDescription className="text-green-900">
                                <p className="font-medium text-base mb-1">Payment Completed Successfully! 🎉</p>
                                <p className="text-sm">
                                    Your payment has been verified and confirmed. Redirecting to order confirmation...
                                </p>
                            </AlertDescription>
                        </Alert>

                        {/* Receipt Data Display */}
                        {receiptData && (
                            <div className="mt-6 p-4 border-2 border-green-200 bg-green-50 rounded-lg space-y-4">
                                <div className="flex items-center space-x-2 text-green-800 mb-4">
                                    <CheckCircle className="h-5 w-5" />
                                    <span className="font-semibold">Payment Receipt</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                                            <User className="h-4 w-4" />
                                            <span>Sender</span>
                                        </div>
                                        <p className="font-medium">{receiptData.senderName}</p>
                                        <p className="text-sm text-gray-600">{receiptData.senderBank}</p>
                                        <p className="text-sm text-gray-500 font-mono">{receiptData.senderAccountNumber}</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                                            <User className="h-4 w-4" />
                                            <span>Receiver</span>
                                        </div>
                                        <p className="font-medium">{receiptData.receiverName}</p>
                                        <p className="text-sm text-gray-600">{receiptData.receiverBank}</p>
                                        <p className="text-sm text-gray-500 font-mono">{receiptData.receiverAccountNumber}</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                                            <Hash className="h-4 w-4" />
                                            <span>Reference Number</span>
                                        </div>
                                        <p className="font-mono font-medium">{receiptData.referenceNo}</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>Date & Time</span>
                                        </div>
                                        <p className="font-medium">{receiptData.paymentDateTime}</p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <Separator className="my-2" />
                                    </div>

                                    <div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                                            <DollarSign className="h-4 w-4" />
                                            <span>Transferred Amount</span>
                                        </div>
                                        <p className="text-lg font-bold text-green-700">{receiptData.transferredAmount}</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                                            <CreditCard className="h-4 w-4" />
                                            <span>Total Amount</span>
                                        </div>
                                        <p className="text-lg font-bold">{receiptData.totalAmount}</p>
                                        <p className="text-xs text-gray-500">
                                            (includes commission: {receiptData.commission}, VAT: {receiptData.vat})
                                        </p>
                                    </div>
                                </div>

                                {receiptData.narrative && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Narrative</p>
                                            <p className="text-sm">{receiptData.narrative}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

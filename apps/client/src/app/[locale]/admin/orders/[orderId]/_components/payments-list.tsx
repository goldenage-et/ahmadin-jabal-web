'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TPayment, EPaymentStatus, EPaymentMethod } from '@repo/common';
import {
    CreditCard,
    Building2,
    CheckCircle,
    Clock,
    XCircle,
    Eye,
    RefreshCw,
    FileText,
    Calendar,
    Hash,
    Banknote,
} from 'lucide-react';
import { useState } from 'react';
import { ReceiptViewer } from './receipt-viewer';

interface PaymentsListProps {
    payments: TPayment[];
    orderCurrency: string;
}

export function PaymentsList({ payments, orderCurrency }: PaymentsListProps) {
    const [selectedPayment, setSelectedPayment] = useState<TPayment | null>(null);

    const getPaymentStatusColor = (status: EPaymentStatus) => {
        const colors = {
            [EPaymentStatus.pending]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            [EPaymentStatus.paid]: 'bg-green-100 text-green-800 border-green-300',
            [EPaymentStatus.failed]: 'bg-red-100 text-red-800 border-red-300',
            [EPaymentStatus.refunded]: 'bg-gray-100 text-gray-800 border-gray-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getPaymentStatusIcon = (status: EPaymentStatus) => {
        const icons = {
            [EPaymentStatus.pending]: Clock,
            [EPaymentStatus.paid]: CheckCircle,
            [EPaymentStatus.failed]: XCircle,
            [EPaymentStatus.refunded]: RefreshCw,
        };
        const Icon = icons[status] || Clock;
        return <Icon className="h-4 w-4" />;
    };

    const getPaymentMethodDisplay = (method: EPaymentMethod) => {
        return method === EPaymentMethod.bankTransfer
            ? { label: 'Bank Transfer', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' }
            : { label: 'Cash on Delivery', icon: Banknote, color: 'text-purple-600', bg: 'bg-purple-100' };
    };

    const formatCurrency = (amount: number, currency: string = 'ETB') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(amount);
    };

    if (payments.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <CreditCard className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 font-medium mb-1">No payment records found</p>
                        <p className="text-sm text-gray-400">Payment information will appear here once processed</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            <span>Payment History</span>
                        </div>
                        <Badge variant="secondary" className="text-sm">
                            {payments.length} {payments.length === 1 ? 'Payment' : 'Payments'}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {payments.map((payment, index) => {
                            const methodInfo = getPaymentMethodDisplay(payment.paymentMethod);
                            const MethodIcon = methodInfo.icon;

                            return (
                                <div key={payment.id}>
                                    <Card className="border-2 hover:shadow-md transition-shadow">
                                        <CardContent className="pt-6">
                                            <div className="space-y-4">
                                                {/* Header Row */}
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start space-x-3 flex-1">
                                                        <div className={`p-3 ${methodInfo.bg} rounded-lg`}>
                                                            <MethodIcon className={`h-6 w-6 ${methodInfo.color}`} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <h3 className="font-semibold text-foreground dark:text-foreground text-lg">
                                                                    {methodInfo.label}
                                                                </h3>
                                                                <Badge className={`${getPaymentStatusColor(payment.paymentStatus)} border`}>
                                                                    {getPaymentStatusIcon(payment.paymentStatus)}
                                                                    <span className="ml-1">
                                                                        {payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)}
                                                                    </span>
                                                                </Badge>
                                                            </div>

                                                            {/* Payment Details Grid */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                                <div className="flex items-center space-x-2">
                                                                    <Banknote className="h-4 w-4 text-gray-400" />
                                                                    <span className="text-muted-foreground dark:text-muted-foreground">Amount:</span>
                                                                    <span className="font-semibold text-foreground dark:text-foreground">
                                                                        {formatCurrency(payment.amount, payment.currency)}
                                                                    </span>
                                                                </div>

                                                                {payment.referenceNumber && (
                                                                    <div className="flex items-center space-x-2">
                                                                        <Hash className="h-4 w-4 text-gray-400" />
                                                                        <span className="text-muted-foreground dark:text-muted-foreground">Ref:</span>
                                                                        <span className="font-mono font-medium text-foreground dark:text-foreground">
                                                                            {payment.referenceNumber}
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                {payment.paidAt && (
                                                                    <div className="flex items-center space-x-2">
                                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                                        <span className="text-gray-600">Paid:</span>
                                                                        <span className="text-green-700 font-medium">
                                                                            {new Date(payment.paidAt).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                {payment.bankCode && (
                                                                    <div className="flex items-center space-x-2">
                                                                        <Building2 className="h-4 w-4 text-gray-400" />
                                                                        <span className="text-gray-600">Bank:</span>
                                                                        <span className="font-mono text-gray-900">{payment.bankCode}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex flex-col space-y-2 ml-4">
                                                        {payment.receiptData && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setSelectedPayment(payment)}
                                                                className="whitespace-nowrap"
                                                            >
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Receipt
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Failure Reason */}
                                                {payment.failureReason && (
                                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                                                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-red-900 mb-1">Payment Failed</p>
                                                            <p className="text-sm text-red-800">{payment.failureReason}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Refund Info */}
                                                {payment.refundedAt && (
                                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-start space-x-2">
                                                        <RefreshCw className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900 mb-1">Payment Refunded</p>
                                                            <p className="text-sm text-gray-700">
                                                                Refunded on {new Date(payment.refundedAt).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Footer Info */}
                                                <div className="pt-3 border-t flex items-center justify-between text-xs text-gray-500">
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Created: {new Date(payment.createdAt).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <FileText className="h-3 w-3" />
                                                        <span className="font-mono">ID: {payment.id.slice(0, 8)}...</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {index < payments.length - 1 && <Separator className="my-4" />}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Receipt Viewer Dialog */}
            {selectedPayment && (
                <ReceiptViewer
                    payment={selectedPayment}
                    onClose={() => setSelectedPayment(null)}
                />
            )}
        </>
    );
}

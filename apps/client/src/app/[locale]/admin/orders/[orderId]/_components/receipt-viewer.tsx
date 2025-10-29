'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { server_host } from '@/config/host.config.mjs';
import { TBankClientReceiptData, TPayment } from '@repo/common';
import {
    CheckCircle,
    Copy,
    DollarSign,
    Download,
    Eye,
    FileText,
    User
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface ReceiptViewerProps {
    payment: TPayment;
    onClose: () => void;
}

export function ReceiptViewer({ payment, onClose }: ReceiptViewerProps) {
    const receiptData = payment.receiptData as TBankClientReceiptData | null;

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    const receiptPath = payment.metadata?.receiptPath ?? null;

    if (!receiptData) {
        return (
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>No Receipt Data</DialogTitle>
                        <DialogDescription>
                            Receipt data is not available for this payment.
                        </DialogDescription>
                    </DialogHeader>
                    <Button onClick={onClose}>Close</Button>
                </DialogContent>
            </Dialog>
        );
    }


    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl flex items-center space-x-2">
                                <FileText className="h-6 w-6 text-blue-600" />
                                <span>Bank Transfer Receipt</span>
                            </DialogTitle>
                            <DialogDescription className="mt-2">
                                Reference: {payment.referenceNumber}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Receipt Header */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                    <span className="text-lg font-semibold text-gray-900">Payment Verified</span>
                                </div>
                                <Badge className="bg-green-100 text-green-800 text-base px-3 py-1">
                                    Confirmed
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Reference Number</p>
                                    <div className="flex items-center space-x-2">
                                        <p className="font-mono font-bold text-lg">{receiptData.referenceNo}</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleCopy(receiptData.referenceNo, 'Reference number')}
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Date & Time</p>
                                    <p className="font-semibold text-lg">{receiptData.paymentDateTime}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transfer Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Sender Information */}
                        <Card className="border-2 border-blue-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center space-x-2 text-blue-900">
                                    <User className="h-5 w-5" />
                                    <span>From (Sender)</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-semibold text-gray-900">{receiptData.senderName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Bank</p>
                                    <p className="font-medium text-gray-900">{receiptData.senderBank}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Account Number</p>
                                    <div className="flex items-center space-x-2">
                                        <p className="font-mono font-medium text-gray-900">{receiptData.senderAccountNumber}</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleCopy(receiptData.senderAccountNumber, 'Sender account')}
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Receiver Information */}
                        <Card className="border-2 border-green-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center space-x-2 text-green-900">
                                    <User className="h-5 w-5" />
                                    <span>To (Receiver)</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-semibold text-gray-900">{receiptData.receiverName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Bank</p>
                                    <p className="font-medium text-gray-900">{receiptData.receiverBank}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Account Number</p>
                                    <div className="flex items-center space-x-2">
                                        <p className="font-mono font-medium text-gray-900">{receiptData.receiverAccountNumber}</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleCopy(receiptData.receiverAccountNumber, 'Receiver account')}
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Amount Breakdown */}
                    <Card className="border-2 border-gray-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center space-x-2">
                                <DollarSign className="h-5 w-5" />
                                <span>Amount Breakdown</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Transferred Amount</span>
                                    <span className="text-2xl font-bold text-green-600">
                                        {receiptData.transferredAmount}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Commission</span>
                                    <span className="font-medium">{receiptData.commission}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">VAT</span>
                                    <span className="font-medium">{receiptData.vat}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-lg">Total Amount</span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        {receiptData.totalAmount}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    {receiptData.narrative && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center space-x-2">
                                    <FileText className="h-5 w-5" />
                                    <span>Narrative/Description</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{receiptData.narrative}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Payment Metadata */}
                    <Card className="bg-gray-50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-700">Payment Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment ID</span>
                                <span className="font-mono text-xs">{payment.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Created</span>
                                <span>{new Date(payment.createdAt).toLocaleString()}</span>
                            </div>
                            {payment.paidAt && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Paid</span>
                                    <span className="text-green-700 font-medium">
                                        {new Date(payment.paidAt).toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Receipt File Info */}
                    {receiptPath && (
                        <Card className="border-dashed">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <FileText className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium text-gray-900">Receipt Bank File</p>
                                            <p className="text-sm text-gray-500">
                                                Stored: {receiptPath}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`${server_host}${receiptPath}`} target="_blank">
                                            <Eye className="h-4 w-4 mr-2" />
                                            View PDF
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}


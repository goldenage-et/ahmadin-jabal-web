'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type TBankAccount, type TOrderDetail, type TBankInfo } from '@repo/common';
import { Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { CopyButton } from './copy-button';
import { BankTransferForm } from './bank-transfer-form';

interface BankAccountSelectorProps {
    recommendedAccounts: TBankAccount[];
    otherAccounts: TBankAccount[];
    selectedBankName: string;
    order: TOrderDetail;
    orderId: string;
    selectedBank: TBankInfo;
}

export function BankAccountSelector({
    recommendedAccounts,
    otherAccounts,
    selectedBankName,
    order,
    orderId,
    selectedBank,
}: BankAccountSelectorProps) {
    const [selectedAccount, setSelectedAccount] = useState<TBankAccount | null>(
        recommendedAccounts.length > 0 ? recommendedAccounts[0] :
            otherAccounts.length > 0 ? otherAccounts[0] :
                null
    );

    return (
        <>
            {/* Account Selection */}
            <Card className="border-2 border-blue-200">
                <CardHeader className="bg-blue-50">
                    <CardTitle className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <span>Select Account to Transfer To</span>
                    </CardTitle>
                    <CardDescription>
                        Choose the account you want to transfer money to
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    {/* Recommended Accounts */}
                    {recommendedAccounts.length > 0 && (
                        <div>
                            <p className="text-sm text-green-700 font-medium mb-3 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Recommended for {selectedBankName} (Faster Verification)
                            </p>
                            <div className="space-y-3">
                                {recommendedAccounts.map((account) => (
                                    <Card
                                        key={account.id}
                                        className={`cursor-pointer transition-all border-2 ${selectedAccount?.id === account.id
                                            ? 'border-green-500 shadow-md bg-green-50'
                                            : 'border-green-200 hover:border-green-400 hover:shadow-md'
                                            }`}
                                        onClick={() => setSelectedAccount(account)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="font-semibold text-gray-900">
                                                            {account.bankName}
                                                        </span>
                                                        <Badge className="bg-green-100 text-green-800 text-xs">
                                                            Same Bank - Fast
                                                        </Badge>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="text-sm text-gray-600">
                                                            <span className="text-gray-500">Account Name: </span>
                                                            <span className="font-medium">{account.accountName}</span>
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            <span className="text-gray-500">Account Number: </span>
                                                            <span className="font-mono font-medium">{account.accountNumber}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {selectedAccount?.id === account.id && (
                                                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 ml-2" />
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Other Accounts */}
                    {otherAccounts.length > 0 && (
                        <div>
                            {recommendedAccounts.length > 0 && (
                                <>
                                    <Separator className="my-4" />
                                    <p className="text-sm text-gray-600 font-medium mb-3">
                                        Other Available Accounts
                                    </p>
                                </>
                            )}
                            <div className="space-y-3">
                                {otherAccounts.map((account) => (
                                    <Card
                                        key={account.id}
                                        className={`cursor-pointer transition-all border-2 ${selectedAccount?.id === account.id
                                            ? 'border-blue-500 shadow-md bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
                                            }`}
                                        onClick={() => setSelectedAccount(account)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900 mb-2">
                                                        {account.bankName}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="text-sm text-gray-600">
                                                            <span className="text-gray-500">Account Name: </span>
                                                            <span className="font-medium">{account.accountName}</span>
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            <span className="text-gray-500">Account Number: </span>
                                                            <span className="font-mono font-medium">{account.accountNumber}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {selectedAccount?.id === account.id && (
                                                    <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 ml-2" />
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {recommendedAccounts.length === 0 && otherAccounts.length === 0 && (
                        <Alert className="bg-amber-50 border-amber-200">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <AlertDescription className="text-amber-900">
                                No bank accounts available for this. Please contact support.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Selected Account Details */}
            {selectedAccount && (
                <Card className="border-2 border-green-200">
                    <CardHeader className="bg-green-50">
                        <CardTitle className="flex items-center space-x-2">
                            <Building2 className="h-5 w-5 text-green-600" />
                            <span>Transfer Details</span>
                        </CardTitle>
                        <CardDescription>
                            Transfer the exact amount to this account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-gray-500 uppercase tracking-wider">Bank Name</Label>
                                    <p className="font-semibold text-lg text-gray-900 mt-1">{selectedAccount.bankName}</p>
                                </div>

                                <div>
                                    <Label className="text-xs text-gray-500 uppercase tracking-wider">Account Name</Label>
                                    <p className="font-semibold text-gray-900 mt-1">{selectedAccount.accountName}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <Label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Account Number</Label>
                                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-green-300">
                                    <p className="font-mono text-2xl font-bold text-green-600">
                                        {selectedAccount.accountNumber}
                                    </p>
                                    <CopyButton text={selectedAccount.accountNumber} label="Account number" />
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <Label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Amount to Transfer</Label>
                                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                                    <div>
                                        <p className="font-mono text-3xl font-bold text-blue-600">
                                            ${order.total.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">{order.currency || 'ETB'}</p>
                                    </div>
                                    <CopyButton text={order.total.toFixed(2)} label="Amount" />
                                </div>
                            </div>
                        </div>

                        <Alert className="bg-amber-50 border-amber-200">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <AlertDescription className="text-amber-900">
                                <span className="font-semibold">Important:</span> Transfer the exact amount of ${order.total.toFixed(2)}.
                                Different amounts may cause verification delays.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            )}

            {/* Payment Completion Form - Only show if account is selected */}
            {selectedAccount && (
                <BankTransferForm
                    orderId={orderId}
                    bankCode={selectedBank.code}
                    bankName={selectedBank.name}
                    bankAccountId={selectedAccount.id}
                    referenceLabel={selectedBank.referenceLabel}
                    referencePlaceholder={selectedBank.referencePlaceholder}
                    orderTotal={order.total}
                />
            )}
        </>
    );
}



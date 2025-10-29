'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Building2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { EPaymentMethod, TBankAccount, TBankInfo, TOrderBasic } from '@repo/common';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import Image from 'next/image';

interface PaymentMethodSelectorProps {
    order: TOrderBasic;
    bankAccounts: TBankAccount[];
    banks: TBankInfo[];
}

export function PaymentMethodSelector({ order, bankAccounts, banks }: PaymentMethodSelectorProps) {
    const router = useRouter();
    const [selectedBank, setSelectedBank] = useState<string | null>(null);

    const handleOnlinePaymentSelection = (provider: string) => {
        router.push(`/checkout/${order.id}/payment/online/${provider}`);
    };

    const handleBankSelection = (bankCode: string) => {
        setSelectedBank(bankCode);
    };

    const handleProceedToPayment = () => {
        if (!selectedBank) {
            return;
        }
        router.push(`/checkout/${order.id}/payment/banks/${selectedBank}`);
    };

    // Get bank codes that the store has accounts in (for recommended badge)
    const storeBankCodes = bankAccounts?.map((account) => account.bankCode) ?? [];

    // Group banks by whether the store has an account in them (recommended) or not
    const recommendedBanks = banks.filter(bank =>
        storeBankCodes.includes(bank.code)
    );
    const otherBanks = banks.filter(bank =>
        !storeBankCodes.includes(bank.code)
    );

    return (
        <div className="space-y-6 mb-8">
            {/* Payment Method Selection */}


            {/* Bank Selection - Only show if bank transfer is selected */}
            {order.paymentMethod === EPaymentMethod.bankTransfer && (
                <>
                    <Separator />
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Select Your Bank</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Choose the bank you'll transfer money from
                        </p>
                        {banks && banks.length > 0 ? (
                            <div className="space-y-4">
                                {/* Recommended Banks */}
                                {recommendedBanks.length > 0 && (
                                    <div>
                                        <p className="text-sm text-green-700 font-medium mb-3 flex items-center">
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Recommended (Faster Verification)
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {recommendedBanks.map((bank) => (
                                                <Card
                                                    key={bank.code}
                                                    className={`cursor-pointer transition-all border-2 ${selectedBank === bank.code
                                                        ? 'border-green-500 shadow-md bg-green-50'
                                                        : 'border-green-200 hover:border-green-400 hover:shadow-md'
                                                        }`}
                                                    onClick={() => handleBankSelection(bank.code)}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-3">
                                                                {bank.logoUrl && (
                                                                    <div className="w-12 h-12 relative flex-shrink-0 bg-white rounded-lg p-1 border">
                                                                        {/* <Image
                                                                            src={bank.logoUrl}
                                                                            alt={`${bank.name} logo`}
                                                                            fill
                                                                            className="object-contain"
                                                                        /> */}
                                                                    </div>
                                                                )}
                                                                <div className="flex-1">
                                                                    <div className="flex items-center space-x-2 mb-1">
                                                                        <span className="font-semibold text-gray-900 text-sm">
                                                                            {bank.name}
                                                                        </span>
                                                                        <Badge className="bg-green-100 text-green-800 text-xs">
                                                                            Fast
                                                                        </Badge>
                                                                    </div>
                                                                    {bank.description && (
                                                                        <p className="text-xs text-gray-600 line-clamp-1">
                                                                            {bank.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {selectedBank === bank.code && (
                                                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 ml-2" />
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Other Banks */}
                                {otherBanks.length > 0 && (
                                    <div>
                                        {recommendedBanks.length > 0 && (
                                            <p className="text-sm text-gray-600 font-medium mb-3 mt-6">
                                                Other Available Banks
                                            </p>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {otherBanks.map((bank) => (
                                                <Card
                                                    key={bank.code}
                                                    className={`cursor-pointer transition-all border-2 ${selectedBank === bank.code
                                                        ? 'border-blue-500 shadow-md bg-blue-50'
                                                        : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
                                                        }`}
                                                    onClick={() => handleBankSelection(bank.code)}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-3">
                                                                {bank.logoUrl && (
                                                                    <div className="w-12 h-12 relative flex-shrink-0 bg-white rounded-lg p-1 border">
                                                                        {/* <Image
                                                                            src={bank.logoUrl}
                                                                            alt={`${bank.name} logo`}
                                                                            fill
                                                                            className="object-contain"
                                                                        /> */}
                                                                    </div>
                                                                )}
                                                                <div className="flex-1">
                                                                    <div className="font-semibold text-gray-900 text-sm mb-1">
                                                                        {bank.name}
                                                                    </div>
                                                                    {bank.description && (
                                                                        <p className="text-xs text-gray-600 line-clamp-1">
                                                                            {bank.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {selectedBank === bank.code && (
                                                                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 ml-2" />
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Card className="border-dashed">
                                <CardContent className="pt-6 text-center">
                                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 font-medium mb-1">No Banks Available</p>
                                    <p className="text-sm text-gray-500">
                                        Bank transfer is temporarily unavailable. Please try another payment method.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Proceed Button */}
                    {banks.length > 0 && (
                        <div className="flex justify-end pt-4">
                            <Button
                                size="lg"
                                onClick={handleProceedToPayment}
                                disabled={!selectedBank}
                                className="min-w-[200px]"
                            >
                                {selectedBank ? (
                                    <>
                                        Proceed to Transfer
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                ) : (
                                    'Select Your Bank'
                                )}
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Info Card for Bank Transfer */}
            {order.paymentMethod === EPaymentMethod.bankTransfer && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-900">
                                <p className="font-medium mb-1">How Bank Transfer Works</p>
                                <ol className="list-decimal list-inside space-y-1 text-blue-800">
                                    <li>Select your bank from the list above</li>
                                    <li>You'll see the store's account details to transfer to</li>
                                    <li>Complete the transfer using your bank's app or branch</li>
                                    <li>Enter your transfer reference number for verification</li>
                                    <li>We'll confirm your payment and process your order</li>
                                </ol>
                                <p className="mt-2 text-xs">
                                    💡 Tip: Banks marked as "Recommended" support faster automatic verification because the store has an account there
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

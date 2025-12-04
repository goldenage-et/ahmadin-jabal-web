'use client';

import { Button } from '@/components/ui/button';
import { EPaymentStatus, EPaymentMethod } from '@repo/common';
import { CheckCircle, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderActionsProps {
    orderId: string;
    paymentStatus: EPaymentStatus;
    paymentMethod: EPaymentMethod;
}

export function OrderActions({ orderId, paymentStatus, paymentMethod }: OrderActionsProps) {
    const router = useRouter();

    const handleProceedToPayment = () => {
        if (paymentStatus === EPaymentStatus.paid) {
            router.push(`/checkout/${orderId}/completed`);
        } else if (paymentMethod === EPaymentMethod.onDelivery) {
            router.push(`/checkout/${orderId}/completed`);
        } else {
            router.push(`/checkout/${orderId}/payment`);
        }
    };

    return (
        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.push('/my-orders')}>
                View All Orders
            </Button>

            {paymentStatus === EPaymentStatus.pending && (
                <Button onClick={handleProceedToPayment} size="lg" className="px-8">
                    {paymentMethod === EPaymentMethod.onDelivery ? (
                        <>
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Confirm Order
                        </>
                    ) : (
                        <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            Proceed to Payment
                        </>
                    )}
                </Button>
            )}

            {paymentStatus === EPaymentStatus.paid && (
                <Button onClick={() => router.push(`/checkout/${orderId}/completed`)} size="lg">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    View Confirmation
                </Button>
            )}
        </div>
    );
}



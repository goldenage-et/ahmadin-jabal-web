'use client';

import { Button } from '@/components/ui/button';
import { Package, Home } from 'lucide-react';
import { useRouter } from '@/i18n/routing';

export function OrderActions({ orderId }: { orderId: string }) {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
                size="lg"
                variant="outline"
                onClick={() => router.push(`/my-orders/${orderId}`)}
                className="w-full"
            >
                <Package className="mr-2 h-5 w-5" />
                Track My Orders
            </Button>
            <Button
                size="lg"
                onClick={() => router.push('/books')}
                className="w-full"
            >
                <Home className="mr-2 h-5 w-5" />
                Continue Shopping
            </Button>
        </div>
    );
}



'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Download, Share2, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface QuickActionsProps {
    orderNumber: string;
}

export function QuickActions({ orderNumber }: QuickActionsProps) {
    const router = useRouter();

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Order #${orderNumber}`,
                text: 'Check out my order!',
                url: window.location.href,
            }).catch((error) => console.log('Error sharing:', error));
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Order link copied to clipboard!');
        }
    };

    const handleEmail = () => {
        toast.info('Email confirmation will be sent shortly');
    };

    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                        variant="outline"
                        className="flex flex-col h-auto py-4 space-y-2"
                        onClick={() => router.push('/my-orders')}
                    >
                        <Package className="h-5 w-5" />
                        <span className="text-xs">My Orders</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="flex flex-col h-auto py-4 space-y-2"
                        onClick={handlePrint}
                    >
                        <Download className="h-5 w-5" />
                        <span className="text-xs">Print</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="flex flex-col h-auto py-4 space-y-2"
                        onClick={handleShare}
                    >
                        <Share2 className="h-5 w-5" />
                        <span className="text-xs">Share</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="flex flex-col h-auto py-4 space-y-2"
                        onClick={handleEmail}
                    >
                        <Mail className="h-5 w-5" />
                        <span className="text-xs">Email Receipt</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}



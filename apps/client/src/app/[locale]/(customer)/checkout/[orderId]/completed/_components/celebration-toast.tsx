'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function CelebrationToast() {
    useEffect(() => {
        // Show celebration toast when component mounts
        toast.success('🎉 Order confirmed! Thank you for your purchase!', {
            duration: 5000,
        });
    }, []);

    return null;
}



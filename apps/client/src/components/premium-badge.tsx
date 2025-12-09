'use client';

import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';
import { TAuthUser } from '@repo/common';
import { isPremiumUser } from '@/lib/premium';

interface PremiumBadgeProps {
    user: TAuthUser | null;
    className?: string;
}

export function PremiumBadge({ user, className }: PremiumBadgeProps) {
    if (!isPremiumUser(user)) {
        return null;
    }

    return (
        <Badge className={`bg-primary text-primary-foreground ${className || ''}`}>
            <Crown className="w-3 h-3 mr-1" />
            Premium
        </Badge>
    );
}



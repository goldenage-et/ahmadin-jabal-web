'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TAuthUser } from '@repo/common';
import { Lock, Crown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface PremiumContentPreviewProps {
    title: string;
    titleAm?: string | null;
    titleOr?: string | null;
    excerpt?: string | null;
    excerptAm?: string | null;
    excerptOr?: string | null;
    featuredImage?: string | null;
    user: TAuthUser | null;
    contentType?: 'blog' | 'publication' | 'media' | 'newsletter';
    contentId?: string;
    contentSlug?: string;
    className?: string;
}

export function PremiumContentPreview({
    title,
    titleAm,
    titleOr,
    excerpt,
    excerptAm,
    excerptOr,
    featuredImage,
    user,
    contentType = 'blog',
    contentId,
    contentSlug,
    className,
}: PremiumContentPreviewProps) {
    const params = useParams();
    const locale = params?.locale as string;

    // Determine which title/excerpt to show based on locale
    const displayTitle = locale === 'am' && titleAm ? titleAm : locale === 'om' && titleOr ? titleOr : title;
    const displayExcerpt = locale === 'am' && excerptAm ? excerptAm : locale === 'om' && excerptOr ? excerptOr : excerpt;

    const upgradeUrl = user 
        ? `/${locale}/profile?upgrade=premium` 
        : `/${locale}/auth/signin?callbackUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '/')}`;

    const contentUrl = contentSlug 
        ? `/${locale}/${contentType}s/${contentSlug}`
        : contentId 
        ? `/${locale}/${contentType}s/${contentId}`
        : '#';

    return (
        <Card className={className}>
            {featuredImage && (
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <Image
                        src={featuredImage}
                        alt={displayTitle}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="bg-yellow-500/90 text-white border-yellow-400">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                        </Badge>
                    </div>
                </div>
            )}
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2">{displayTitle}</CardTitle>
                    {!featuredImage && (
                        <Badge variant="outline" className="bg-yellow-500/90 text-white border-yellow-400 shrink-0">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                        </Badge>
                    )}
                </div>
                {displayExcerpt && (
                    <CardDescription className="line-clamp-3">
                        {displayExcerpt}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="h-4 w-4" />
                        <span>
                            {user 
                                ? 'Upgrade to Premium to access full content'
                                : 'Sign in and upgrade to Premium to access full content'}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild className="flex-1">
                            <Link href={upgradeUrl}>
                                {user ? 'Upgrade to Premium' : 'Sign In'}
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={contentUrl}>
                                View Preview
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


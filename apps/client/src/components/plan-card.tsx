'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TPlan } from '@repo/common';
import { CreditCard, Infinity, Check, Sparkles, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanCardProps {
    plan: TPlan;
    onSubscribe?: (planId: string) => void;
    isCurrentPlan?: boolean;
    showSubscribeButton?: boolean;
    isPopular?: boolean;
}

export function PlanCard({ plan, onSubscribe, isCurrentPlan, showSubscribeButton = true, isPopular = false }: PlanCardProps) {
    const formatPrice = () => {
        if (plan.price === 0) {
            return 'Free';
        }
        return `${plan.price.toFixed(2)}`;
    };

    const formatCurrency = () => {
        return plan.currency || 'ETB';
    };

    const formatDuration = () => {
        if (plan.isLifetime) {
            return 'Lifetime';
        }
        if (plan.durationDays) {
            const days = plan.durationDays;
            if (days >= 365) {
                const years = Math.floor(days / 365);
                return `${years} ${years === 1 ? 'year' : 'years'}`;
            }
            if (days >= 30) {
                const months = Math.floor(days / 30);
                return `${months} ${months === 1 ? 'month' : 'months'}`;
            }
            return `${days} ${days === 1 ? 'day' : 'days'}`;
        }
        return 'N/A';
    };

    const handleSubscribe = () => {
        if (onSubscribe) {
            onSubscribe(plan.id);
        }
    };

    return (
        <Card 
            className={cn(
                "group relative overflow-hidden transition-all duration-500",
                "border-2 hover:shadow-2xl hover:-translate-y-2",
                isCurrentPlan && "border-primary shadow-lg shadow-primary/20",
                isPopular && !isCurrentPlan && "border-primary/50 shadow-xl shadow-primary/10",
                !isCurrentPlan && !isPopular && "border-border hover:border-primary/30"
            )}
        >
            {/* Popular Badge */}
            {isPopular && !isCurrentPlan && (
                <div className="absolute top-0 right-0 z-10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary blur-xl opacity-50"></div>
                        <Badge className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 rounded-bl-lg rounded-tr-lg px-4 py-1.5 font-semibold shadow-lg">
                            <Sparkles className="w-3 h-3 mr-1.5" />
                            Most Popular
                        </Badge>
                    </div>
                </div>
            )}

            {/* Current Plan Badge */}
            {isCurrentPlan && (
                <div className="absolute top-0 right-0 z-10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary blur-xl opacity-50"></div>
                        <Badge className="relative bg-primary text-primary-foreground border-0 rounded-bl-lg rounded-tr-lg px-4 py-1.5 font-semibold shadow-lg">
                            <Crown className="w-3 h-3 mr-1.5" />
                            Active
                        </Badge>
                    </div>
                </div>
            )}

            {/* Gradient Background Effect */}
            {(isPopular || isCurrentPlan) && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            )}

            <CardHeader className="relative pb-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <CardTitle className="text-2xl md:text-3xl font-bold mb-2">{plan.name}</CardTitle>
                        {plan.description && (
                            <CardDescription className="text-base leading-relaxed">{plan.description}</CardDescription>
                        )}
                    </div>
                    {plan.isLifetime && (
                        <div className="relative ml-2">
                            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full"></div>
                            <Infinity className="relative h-6 w-6 text-primary" />
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="relative space-y-6 pt-2">
                {/* Pricing Section */}
                <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                        {plan.price === 0 ? (
                            <span className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                                Free
                            </span>
                        ) : (
                            <>
                                <span className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                                    {formatPrice()}
                                </span>
                                <span className="text-lg font-medium text-muted-foreground">{formatCurrency()}</span>
                            </>
                        )}
                    </div>
                    {!plan.isLifetime && plan.durationDays && (
                        <p className="text-sm text-muted-foreground font-medium">
                            per {formatDuration()}
                        </p>
                    )}
                </div>

                {/* Features Section */}
                {plan.features && Object.keys(plan.features).length > 0 && (
                    <div className="space-y-3 pt-2 border-t">
                        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">What's Included</h4>
                        <ul className="space-y-3">
                            {Object.entries(plan.features).map(([key, value]) => (
                                <li key={key} className="flex items-start gap-3">
                                    <div className="relative mt-0.5 flex-shrink-0">
                                        <div className="absolute inset-0 bg-primary/20 blur-sm rounded-full"></div>
                                        <Check className="relative h-5 w-5 text-primary" />
                                    </div>
                                    <span className="text-sm leading-relaxed">
                                        <span className="font-semibold text-foreground">{key}:</span>{' '}
                                        <span className="text-muted-foreground">{String(value)}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Subscribe Button */}
                {showSubscribeButton && (
                    <Button
                        className={cn(
                            "w-full mt-8 h-12 text-base font-semibold transition-all duration-300",
                            isCurrentPlan && "bg-primary/10 text-primary border-2 border-primary hover:bg-primary/20",
                            isPopular && !isCurrentPlan && "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl",
                            !isCurrentPlan && !isPopular && "shadow-md hover:shadow-lg"
                        )}
                        onClick={handleSubscribe}
                        disabled={isCurrentPlan || !plan.active}
                        variant={isCurrentPlan ? 'outline' : 'default'}
                    >
                        <CreditCard className="w-5 h-5 mr-2" />
                        {isCurrentPlan 
                            ? 'Current Plan' 
                            : plan.price === 0 
                                ? 'Get Started Free' 
                                : 'Subscribe Now'}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}






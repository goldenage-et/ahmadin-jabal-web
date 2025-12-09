'use client';

import { PlanCard } from '@/components/plan-card';
import { TPlan, TSubscriptionWithPlan } from '@repo/common';
import { subscribeToPlan } from '@/actions/subscription.action';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface SubscriptionsClientProps {
    plans: TPlan[];
    currentSubscription: TSubscriptionWithPlan | null;
}

export function SubscriptionsClient({ plans, currentSubscription }: SubscriptionsClientProps) {
    const router = useRouter();
    const { mutate, isLoading } = useApiMutation();
    const [error, setError] = useState<string | null>(null);

    // Sort plans by price (ascending - lowest to highest)
    const sortedPlans = [...plans].sort((a, b) => {
        return (a.price || 0) - (b.price || 0);
    });

    const handleSubscribe = async (planId: string) => {
        setError(null);

        // Check if user is already subscribed to this plan
        if (currentSubscription && currentSubscription.planId === planId) {
            setError('You are already subscribed to this plan');
            return;
        }

        // Find the selected plan
        const selectedPlan = plans.find(plan => plan.id === planId);

        // Check if plan is not free (price > 0)
        if (selectedPlan && selectedPlan.price > 0) {
            // For paid plans, create order and redirect to payment
            // Subscription will be created only after payment is confirmed
            mutate(
                () => subscribeToPlan(planId),
                {
                    onSuccess: async (response) => {
                        // Check if response contains orderId (paid plan flow)
                        if (response && typeof response === 'object' && 'orderId' in response) {
                            const orderResponse = response as { orderId: string; paymentId: string };
                            // Redirect to payment page
                            router.push(`/checkout/${orderResponse.orderId}/payment`);
                            return;
                        }

                        // If response is a subscription (shouldn't happen for paid plans, but handle it)
                        if (response && 'id' in response && 'planId' in response) {
                            // This shouldn't happen for paid plans, but if it does, redirect to subscription page
                            router.push(`/profile/subscription`);
                            return;
                        }

                        // Fallback: something went wrong
                        setError('Payment is required for this plan. Please contact support.');
                    },
                    onError: (err: any) => {
                        setError(err.message || 'Failed to subscribe. Please try again.');
                    },
                    errorMessage: 'Failed to subscribe',
                }
            );
        } else {
            // Free plan - proceed with subscription
            mutate(
                () => subscribeToPlan(planId),
                {
                    onSuccess: (subscription) => {
                        // Free subscription created successfully
                        router.push(`/profile/subscription`);
                    },
                    onError: (err: any) => {
                        setError(err.message || 'Failed to subscribe. Please try again.');
                    },
                    errorMessage: 'Failed to subscribe',
                }
            );
        }
    };

    return (
        <div className="space-y-8">
            {error && (
                <Alert variant="destructive" className="max-w-2xl mx-auto border-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {sortedPlans.map((plan, index) => (
                    <div
                        key={plan.id}
                        className="opacity-0"
                        style={{
                            animation: `fadeInUp 0.6s ease-out ${index * 100}ms forwards`,
                        }}
                    >
                        <PlanCard
                            plan={plan}
                            onSubscribe={handleSubscribe}
                            isCurrentPlan={currentSubscription?.planId === plan.id}
                            showSubscribeButton={true}
                            isPopular={index === Math.floor(sortedPlans.length / 2)} // Middle plan is popular
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}


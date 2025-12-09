import { getPlans } from '@/actions/plan.action';
import { getMySubscription } from '@/actions/subscription.action';
import { getAuth } from '@/actions/auth.action';
import { Card, CardContent } from '@/components/ui/card';
import { TPlan, TSubscriptionWithPlan, isErrorResponse } from '@repo/common';
import { CreditCard } from 'lucide-react';
import { SubscriptionsClient } from './subscriptions-client';

export default async function SubscriptionsPage() {
    const { user } = await getAuth();
    const plansResponse = await getPlans({ active: true });
    const subscriptionData = user ? await getMySubscription() : null;

    const plansData = (plansResponse && !isErrorResponse(plansResponse)) ? ('data' in plansResponse ? plansResponse.data : []) : [];
    const plans: TPlan[] = Array.isArray(plansData) ? plansData : [];
    const activePlans = plans.filter(plan => plan.active);
    const subscription: TSubscriptionWithPlan | null =
        subscriptionData && !isErrorResponse(subscriptionData) && subscriptionData
            ? subscriptionData
            : null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                {/* Hero Section */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                            <div className="relative bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2">
                                <span className="text-sm font-medium text-primary">Premium Access</span>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                        Choose Your Plan
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Unlock exclusive content and support Ustaz Ahmedin Jebel's mission to spread knowledge and wisdom
                    </p>
                </div>

                {activePlans.length === 0 ? (
                    <Card className="max-w-md mx-auto border-2">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-muted-foreground/10 blur-2xl rounded-full"></div>
                                <CreditCard className="relative w-16 h-16 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No plans available</h3>
                            <p className="text-muted-foreground text-center max-w-sm">
                                There are no subscription plans available at the moment. Please check back later.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <SubscriptionsClient
                        plans={activePlans}
                        currentSubscription={subscription}
                    />
                )}
            </div>
        </div>
    );
}



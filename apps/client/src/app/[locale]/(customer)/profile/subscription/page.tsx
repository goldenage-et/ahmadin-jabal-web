import { getMySubscription } from '@/actions/subscription.action';
import { getAuth } from '@/actions/auth.action';
import { TSubscriptionWithPlan, isErrorResponse } from '@repo/common';
import { redirect } from 'next/navigation';
import { MySubscriptionClient } from './my-subscription-client';

export default async function MySubscriptionPage() {
    const { user } = await getAuth();

    if (!user) {
        redirect('/auth/signin?callbackUrl=/profile/subscription');
    }

    const subscriptionData = await getMySubscription();
    console.log({ subscriptionData });
    const subscription: TSubscriptionWithPlan | null = (subscriptionData && !isErrorResponse(subscriptionData)) ? subscriptionData : null;
    console.log({ subscription });
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Subscription</h1>
                <p className="text-muted-foreground">Manage your subscription and view payment history</p>
            </div>

            <MySubscriptionClient subscription={subscription} />
        </div>
    );
}



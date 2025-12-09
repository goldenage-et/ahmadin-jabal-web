import { getPlans } from '@/actions/plan.action';
import { PlansClient } from './plans-client';
import { isErrorResponse } from '@repo/common';

export default async function PlansPage() {
    const plansResponse = await getPlans();
    const plans = (plansResponse && !isErrorResponse(plansResponse)) ? ('data' in plansResponse ? plansResponse.data : []) : [];
    const plansArray = Array.isArray(plans) ? plans : [];

    return <PlansClient initialPlans={plansArray} />;
}

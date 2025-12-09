'use client';

import { createPlan } from '@/actions/plan.action';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { TCreatePlan } from '@repo/common';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

// Available subscription plan features
const AVAILABLE_FEATURES = [
    { key: 'accessPremiumContent', label: 'Access Premium Content', description: 'Access to premium publications, blogs, and exclusive content' },
    { key: 'unlimitedDownloads', label: 'Unlimited Downloads', description: 'Download unlimited books, publications, and resources' },
    { key: 'adFree', label: 'Ad-Free Experience', description: 'Browse without advertisements' },
    { key: 'earlyAccess', label: 'Early Access', description: 'Get early access to new content and releases' },
    { key: 'exclusiveContent', label: 'Exclusive Content', description: 'Access to subscriber-only content and materials' },
    { key: 'prioritySupport', label: 'Priority Support', description: 'Priority customer support and assistance' },
    { key: 'communityAccess', label: 'Community Access', description: 'Access to exclusive community forums and discussions' },
    { key: 'liveStreams', label: 'Live Streams', description: 'Access to live streaming events and sessions' },
    { key: 'offlineAccess', label: 'Offline Access', description: 'Download content for offline viewing' },
    { key: 'multipleDevices', label: 'Multiple Devices', description: 'Use subscription on multiple devices simultaneously' },
] as const;

export default function NewPlanPage() {
    const params = useParams();
    const router = useRouter();
    const { mutate, isLoading } = useApiMutation();

    const [formData, setFormData] = useState<TCreatePlan>({
        name: '',
        description: '',
        price: 0,
        currency: 'ETB',
        durationDays: 30,
        isLifetime: false,
        features: {},
        active: true,
    });

    const [selectedFeatures, setSelectedFeatures] = useState<Record<string, boolean>>({});

    const handleFeatureToggle = (featureKey: string, checked: boolean) => {
        setSelectedFeatures(prev => ({
            ...prev,
            [featureKey]: checked,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            return;
        }

        // Validate price
        if (formData.price < 0) {
            return;
        }

        // Validate durationDays if not lifetime
        if (!formData.isLifetime && (!formData.durationDays || formData.durationDays <= 0)) {
            return;
        }

        // Build features object from selected checkboxes
        const features: Record<string, boolean> = {};
        Object.entries(selectedFeatures).forEach(([key, value]) => {
            if (value) {
                features[key] = true;
            }
        });

        const submitData: TCreatePlan = {
            ...formData,
            features: Object.keys(features).length > 0 ? features : undefined,
            durationDays: formData.isLifetime ? null : formData.durationDays,
        };

        mutate(
            () => createPlan(submitData),
            {
                onSuccess: () => {
                    router.push(`/admin/settings/plans`);
                },
                successMessage: 'Plan created successfully',
                errorMessage: 'Failed to create plan',
            }
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/admin/settings/plans`}>
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Create New Plan</h1>
                    <p className="text-muted-foreground">Define a new subscription plan</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                            Set the basic details for this plan
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Plan Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter plan name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value || undefined }))}
                                placeholder="Enter plan description"
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency *</Label>
                                <Input
                                    id="currency"
                                    value={formData.currency}
                                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                                    placeholder="ETB"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isLifetime"
                                checked={formData.isLifetime}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isLifetime: checked }))}
                            />
                            <Label htmlFor="isLifetime">Lifetime Plan</Label>
                        </div>
                        {!formData.isLifetime && (
                            <div className="space-y-2">
                                <Label htmlFor="durationDays">Duration (Days) *</Label>
                                <Input
                                    id="durationDays"
                                    type="number"
                                    min="1"
                                    value={formData.durationDays || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, durationDays: parseInt(e.target.value) || undefined }))}
                                    placeholder="30"
                                    required={!formData.isLifetime}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Number of days the subscription will last (e.g., 30 for monthly, 365 for yearly)
                                </p>
                            </div>
                        )}
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="active"
                                checked={formData.active}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                            />
                            <Label htmlFor="active">Active</Label>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Features</CardTitle>
                        <CardDescription>
                            Select the features included in this plan (optional)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {AVAILABLE_FEATURES.map((feature) => (
                                <div key={feature.key} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <Checkbox
                                        id={feature.key}
                                        checked={selectedFeatures[feature.key] || false}
                                        onCheckedChange={(checked) => handleFeatureToggle(feature.key, checked as boolean)}
                                        className="mt-1"
                                    />
                                    <div className="flex-1 space-y-1">
                                        <Label
                                            htmlFor={feature.key}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {feature.label}
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {Object.keys(selectedFeatures).filter(key => selectedFeatures[key]).length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No features selected. Select features above to include them in this plan.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Link href={`/admin/settings/plans`}>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isLoading}>
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? 'Creating...' : 'Create Plan'}
                    </Button>
                </div>
            </form>
        </div>
    );
}


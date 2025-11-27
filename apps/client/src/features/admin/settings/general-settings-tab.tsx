'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TAuthUser, TUpdateMe } from '@repo/common';
import { ZUpdateMe } from '@repo/common';
import { Building2, Mail, Phone, User, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateCurrentUser } from '@/features/user/actions/user.action';
import { useApiMutation } from '@/hooks/use-api-mutation';

interface GeneralSettingsTabProps {
    user: TAuthUser;
}

export function GeneralSettingsTab({ user }: GeneralSettingsTabProps) {
    const { isLoading, mutate } = useApiMutation();

    const form = useForm<TUpdateMe>({
        resolver: zodResolver(ZUpdateMe),
        defaultValues: {
            firstName: user.firstName || '',
            middleName: user.middleName || '',
            lastName: user.lastName || '',
            phone: user.phone || '',
            image: user.image || '',
        },
    });

    const onSubmit = async (values: TUpdateMe) => {
        mutate(
            async () => {
                return updateCurrentUser(values);
            },
            {
                onSuccess: () => {
                    toast.success('Settings updated successfully');
                    // Optionally refresh the page or update user context
                },
                onError: (error) => {
                    toast.error(error?.message || 'Failed to update settings');
                },
                successMessage: 'Settings updated successfully',
                errorMessage: 'Failed to update settings',
            },
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">General Settings</h2>
                <p className="text-muted-foreground">
                    Manage your profile information and basic settings
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Profile Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                <CardTitle>Profile Information</CardTitle>
                            </div>
                            <CardDescription>
                                Update your personal information and profile details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your first name"
                                                    {...field}
                                                    className="bg-background"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="middleName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Middle Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your middle name"
                                                    {...field}
                                                    className="bg-background"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your last name"
                                                {...field}
                                                className="bg-background"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email Address
                                    </div>
                                    <Input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="bg-muted"
                                        aria-label="Email address (read-only)"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Email cannot be changed from this page
                                    </p>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                Phone Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder="+251 9XX XXX XXX"
                                                    {...field}
                                                    value={field.value || ''}
                                                    className="bg-background"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Status */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                <CardTitle>Account Status</CardTitle>
                            </div>
                            <CardDescription>
                                View your account status and verification information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Email Verification
                                        </p>
                                        <p className="text-sm mt-1">
                                            {user.emailVerified ? (
                                                <span className="text-green-600 dark:text-green-400">
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="text-orange-600 dark:text-orange-400">
                                                    Not Verified
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Account Status
                                        </p>
                                        <p className="text-sm mt-1">
                                            {user.active ? (
                                                <span className="text-green-600 dark:text-green-400">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="text-red-600 dark:text-red-400">
                                                    Inactive
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {user.roles && user.roles.length > 0 && (
                                <div className="p-4 rounded-lg border bg-card">
                                    <p className="text-sm font-medium text-muted-foreground mb-2">
                                        Roles
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {user.roles.map((role) => (
                                            <span
                                                key={role.id}
                                                className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                                            >
                                                {role.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => form.reset()}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            <Save className="h-4 w-4 mr-2" />
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}


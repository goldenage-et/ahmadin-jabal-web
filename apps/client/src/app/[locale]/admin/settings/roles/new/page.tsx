'use client';

import { createRole } from '@/actions/role.action';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { EResources, TCreateRole } from '@repo/common';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const defaultPermissions: TCreateRole['permission'] = {
    [EResources.USER]: {
        create: false,
        update: false,
        viewOne: true,
        viewMany: true,
        delete: false,
        active: false,
    },
    [EResources.BOOK]: {
        create: false,
        update: false,
        viewOne: true,
        viewMany: true,
        delete: false,
        active: false,
        featured: false,
    },
    [EResources.ORDER]: {
        update: false,
        viewOne: true,
        viewMany: true,
        delete: false,
    },
    [EResources.PAYMENT]: {
        update: false,
        viewOne: true,
        viewMany: true,
    },
    [EResources.ROLE]: {
        create: false,
        assign: false,
        update: false,
        viewOne: true,
        viewMany: true,
        delete: false,
    },
    [EResources.SETTING]: {
        update: false,
        viewOne: true,
        viewMany: true,
    },
};

export default function NewRolePage() {
    const params = useParams();
    const router = useRouter();
    const { mutate, isLoading } = useApiMutation();

    const [formData, setFormData] = useState<TCreateRole>({
        name: '',
        active: true,
        permission: defaultPermissions,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            return;
        }

        mutate(
            () => createRole(formData),
            {
                onSuccess: () => {
                    router.push(`/admin/roles`);
                },
                successMessage: 'Role created successfully',
                errorMessage: 'Failed to create role',
            }
        );
    };

    const updatePermission = (resource: EResources, action: string, value: boolean) => {
        setFormData(prev => ({
            ...prev,
            permission: {
                ...prev.permission,
                [resource]: {
                    ...prev.permission[resource],
                    [action]: value,
                },
            },
        }));
    };

    const resourceLabels: Partial<Record<EResources, string>> = {
        [EResources.USER]: 'User',
        [EResources.BOOK]: 'Book',
        [EResources.ORDER]: 'Order',
        [EResources.PAYMENT]: 'Payment',
        [EResources.ROLE]: 'Role',
        [EResources.SETTING]: 'Setting',
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/admin/roles`}>
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Create New Role</h1>
                    <p className="text-muted-foreground">Define permissions for this role</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                            Set the basic details for this role
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Role Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter role name"
                                required
                            />
                        </div>
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
                        <CardTitle>Permissions</CardTitle>
                        <CardDescription>
                            Configure what this role can do in your store
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Object.entries(formData.permission).map(([resource, permissions]) => (
                            <div key={resource} className="space-y-3">
                                <h4 className="font-medium text-sm">
                                    {resourceLabels[resource as EResources]}
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {Object.entries(permissions).map(([action, allowed]) => (
                                        <div key={action} className="flex items-center space-x-2">
                                            <Switch
                                                id={`${resource}-${action}`}
                                                checked={allowed}
                                                onCheckedChange={(checked) =>
                                                    updatePermission(resource as EResources, action, checked)
                                                }
                                            />
                                            <Label
                                                htmlFor={`${resource}-${action}`}
                                                className="text-sm capitalize"
                                            >
                                                {action}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Link href={`/owner/roles`}>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isLoading}>
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? 'Creating...' : 'Create Role'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

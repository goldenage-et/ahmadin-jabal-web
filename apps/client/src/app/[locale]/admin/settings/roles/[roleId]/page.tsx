'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { TRole, TUpdateRole, EResources } from '@repo/common';
import { getRole, updateRole, deleteRole } from '@/actions/role.action';
import { useApiMutation } from '@/hooks/use-api-mutation';
import Link from 'next/link';

const resourceLabels: Partial<Record<EResources, string>> = {
    [EResources.USER]: 'User',
    [EResources.BOOK]: 'Book',
    [EResources.ORDER]: 'Order',
    [EResources.PAYMENT]: 'Payment',
    [EResources.ROLE]: 'Role',
    [EResources.SETTING]: 'Setting',
};

export default function RoleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const roleId = params.roleId as string;
    const { mutate, isLoading } = useApiMutation();

    const [role, setRole] = useState<TRole | null>(null);
    const [formData, setFormData] = useState<TUpdateRole>({
        name: '',
        active: true,
        permission: {} as TRole['permission'],
    });
    const [loading, setLoading] = useState(true);

    const fetchRole = async () => {
        try {
            setLoading(true);
            const response = await getRole(roleId);

            if (response.error) {
                router.push(`/admin/settings/roles`);
                return;
            }

            setRole(response);
            setFormData({
                name: response.name,
                active: response.active,
                permission: response.permission,
            });
        } catch (error) {
            router.push(`/admin/settings/roles`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name?.trim()) {
            return;
        }

        mutate(
            () => updateRole(roleId, formData),
            {
                onSuccess: (updatedRole) => {
                    setRole(updatedRole);
                },
                successMessage: 'Role updated successfully',
                errorMessage: 'Failed to update role',
            }
        );
    };

    const handleDelete = async () => {
        if (!role) return;

        if (!confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
            return;
        }

        mutate(
            () => deleteRole(roleId),
            {
                onSuccess: () => {
                    router.push(`/admin/settings/roles`);
                },
                successMessage: 'Role deleted successfully',
                errorMessage: 'Failed to delete role',
            }
        );
    };

    const updatePermission = (resource: EResources, action: string, value: boolean) => {
        setFormData(prev => {
            const currentPermission = prev.permission || {} as TRole['permission'];
            const currentResource = currentPermission[resource] || {};

            return {
                ...prev,
                permission: {
                    ...currentPermission,
                    [resource]: {
                        ...currentResource,
                        [action]: value,
                    },
                },
            };
        });
    };

    useEffect(() => {
        fetchRole();
    }, [roleId]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
                    <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-32 bg-muted rounded animate-pulse"></div>
                    <div className="h-64 bg-muted rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (!role) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={`/admin/settings/roles`}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Role Not Found</h1>
                        <p className="text-muted-foreground">The requested role could not be found</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/admin/settings/roles`}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Role</h1>
                        <p className="text-muted-foreground">Modify role permissions and settings</p>
                    </div>
                </div>
                {role.name !== 'owner' && (
                    <Button
                        variant="outline"
                        onClick={handleDelete}
                        className="text-destructive hover:text-destructive"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Role
                    </Button>
                )}
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
                                value={formData.name || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter role name"
                                required
                                disabled={role.name === 'owner'}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="active"
                                checked={formData.active ?? true}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                                disabled={role.name === 'owner'}
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
                        {formData.permission && Object.entries(formData.permission).map(([resource, permissions]) => (
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
                                                disabled={role.name === 'owner'}
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
                    <Link href={`/admin/settings/roles`}>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isLoading || role.name === 'owner'}>
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

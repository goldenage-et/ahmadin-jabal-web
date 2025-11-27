import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Settings
} from 'lucide-react';
import React, { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense
            fallback={
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-96" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-32 w-full" />
                        </CardContent>
                    </Card>
                </div>
            }
        >
            <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-3 shrink-0 border-b backdrop-blur supports-backdrop-filter:bg-background">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Settings className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
                                    <p className="text-muted-foreground">
                                        Manage your admin's configuration and preferences
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full p-6">
                    {children}
                </div>
            </div>
        </Suspense>
    )
}

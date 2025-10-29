'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Settings } from 'lucide-react';
import { settingTabs } from '@/layout/config/navigation';

export default async function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingTabs().map((tab) => (
          <Link key={tab.value} href={`/admin/settings/${tab.value}`}>
            <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    {tab.icon}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {tab.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {tab.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-8 p-4 bg-primary/40 rounded-lg">
        <div className="flex items-start space-x-3">
          <Settings className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-medium">Getting Started</h3>
            <p className="text-sm text-muted-foreground">
              Use the quick action cards above to navigate to different settings sections.
              Each section contains specific configuration options for your store.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

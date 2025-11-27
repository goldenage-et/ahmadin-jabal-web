'use client';

import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { TAuthUser } from '@repo/common';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { TopBar } from './components/top-bar';
import {
  createFooterRoutes,
  createHeaderRoutes,
  createMainRoutes
} from './config/navigation';
import { useSidebar } from './hooks/use-sidebar';
import { NavMain } from './nav-main';

export interface LayoutProps {
  children: ReactNode;
  className?: string;
  user: TAuthUser;
}

export function MainLayout({
  children,
  user,
  className,
}: LayoutProps) {
  const { open, collapsible, ref, toggleSidebar } = useSidebar();

  const headerRoutes = createHeaderRoutes();
  const mainRoutes = createMainRoutes();
  const footerRouts = createFooterRoutes();

  return (
    <div className={cn('flex h-screen', className)}>
      <SidebarProvider
        style={
          {
            '--sidebar-width': '16rem',
            '--sidebar-width-icon': '3.5rem',
          } as React.CSSProperties
        }
        open={open}
        onOpenChange={toggleSidebar}
        className='z-50'
      >
        <div className='relative' ref={ref}>
          <Sidebar collapsible={collapsible} className='z-50 bg-sidebar'>
            <SidebarHeader className='overflow-hidden'>
              <Link href='/admin/' className='block px-2 py-2'>
                <div className='flex items-center gap-2'>
                  <div className='w-8 h-8 aspect-square shrink-0 bg-purple-500 rounded-lg flex items-center justify-center'>
                    <span className='text-white font-bold text-lg'>A</span>
                  </div>
                  <span className='text-xl font-extrabold tracking-tight text-sidebar-foreground text-nowrap'>
                    ahmadin
                  </span>
                </div>
              </Link>
            </SidebarHeader>
            <Separator />
            <SidebarContent className='py-2 md:py-2 mt-2'>
              <SidebarGroup className='py-0'>
                <NavMain items={headerRoutes} />
              </SidebarGroup>
              <Separator />
              <SidebarGroup className='py-0'>
                <NavMain items={mainRoutes} />
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className='py-2 md:py-2 mt-2'>
              <SidebarGroup className='py-0'>
                <NavMain items={footerRouts} />
              </SidebarGroup>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>
        </div>

        <SidebarInset>
          <div className='w-full flex-1 flex flex-col overflow-hidden'>
            <TopBar
              user={user}
              onSidebarToggle={toggleSidebar}
            />

            <main className='w-full flex-1 overflow-y-auto'>{children}</main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

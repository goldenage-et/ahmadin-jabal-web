'use client';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { TAuthUser } from '@repo/common';
import { Home, Menu } from 'lucide-react';
import Link from 'next/link';
import { NavUser } from '../nav-user';

interface TopBarProps {
  user?: TAuthUser;
  onSidebarToggle?: () => void;
}

export function TopBar({ onSidebarToggle, user }: TopBarProps) {
  return (
    <header className='w-full bg-background border-b border-border shadow-sm'>
      <div className='flex items-center justify-between px-4 py-1'>
        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={onSidebarToggle}
            className='text-foreground hover:bg-accent'
          >
            <Menu className='h-4 w-4' />
          </Button>
          <Button asChild variant='ghost' size='sm' className='text-sm text-foreground hover:bg-accent'>
            <Link href='/'>
              <Home className='h-4 w-4' />
              Back to Home
            </Link>
          </Button>

          <div className='flex items-center space-x-4'>
            {user && (
              <div className='text-sm text-muted-foreground'>
                Well come back {user.firstName} {user.lastName}!
              </div>
            )}
          </div>
        </div>
        <div className='flex items-center gap-2 px-0'>
          <ThemeToggle />
          <NavUser user={user} noSidebar />
        </div>
      </div>
    </header>
  );
}

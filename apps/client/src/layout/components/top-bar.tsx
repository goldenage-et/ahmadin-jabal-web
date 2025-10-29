'use client';

import { Button } from '@/components/ui/button';
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
    <header className='w-full bg-white shadow-sm border-b'>
      <div className='flex items-center justify-between px-4 py-1'>
        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={onSidebarToggle}
          >
            <Menu className='h-4 w-4' />
          </Button>
          <Button asChild variant='ghost' size='sm' className='text-sm'>
            <Link href='/'>
              <Home className='h-4 w-4' />
              Back to Home
            </Link>
          </Button>

          <div className='flex items-center space-x-4'>
            {user && (
              <div className='text-sm text-gray-500'>
                Well come back {user.firstName} {user.lastName}!
              </div>
            )}
          </div>
        </div>
        <div className='px-0'>
          <NavUser user={user} noSidebar />
        </div>
      </div>
    </header>
  );
}

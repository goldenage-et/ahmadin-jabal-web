'use client';

import { logout } from '@/features/auth/actions/auth.action';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TAuthUser } from '@repo/common';
import { LogOutIcon, Settings2, ShoppingCart, UserIcon, ChevronDown } from 'lucide-react';
import type { ElementType } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function NavUser({
  user,
  noSidebar,
  className,
}: {
  user?: TAuthUser | null;
  noSidebar?: boolean;
  className?: string;
}) {
  const isMobile = useIsMobile();

  if (noSidebar) {
    return (
      <UserMenu
        user={user}
        side='bottom'
        TriggerComponent={'button'}
        className={cn(className)}
      />
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserMenu
          user={user}
          side={isMobile ? 'bottom' : 'right'}
          TriggerComponent={SidebarMenuButton}
          className={cn(className)}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export interface UserMenuProps {
  user?: TAuthUser | null;
  side?: 'bottom' | 'right';
  TriggerComponent?: ElementType;
  className?: string;
}

function UserMenu({ TriggerComponent, className, user, side }: UserMenuProps) {
  const router = useRouter();
  const { mutate, isLoading } = useApiMutation();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    mutate(logout);
  };

  const userInitials = user?.firstName?.[0] || user?.middleName?.[0] || 'U';
  const Component = TriggerComponent || 'button';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='h-9 p-0'>
        <Component
          size='lg'
          className={cn(
            'data-[state=open]:bg-green-50 data-[state=open]:dark:bg-green-950/20 data-[state=open]:border-green-200 data-[state=open]:dark:border-green-800',
            'ps-1 w-[calc(100%-0.5rem)] ms-1 pe-1 py-1',
            'flex items-center gap-2 rounded-full bg-linear-to-br from-green-500 to-green-600 border-2 border-white dark:border-gray-800',
            'shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95',
            'ring-2 ring-green-100 dark:ring-green-900/30',
            // Mobile responsive sizing
            'h-9 w-9 sm:h-10 sm:w-10',
            className,
          )}
        >
          <Avatar className={cn(
            'flex aspect-square items-center justify-center rounded-full bg-linear-to-br from-green-500 to-green-600 text-white p-0 shadow-sm ring-2 ring-white dark:ring-gray-800',
            'size-7 sm:size-8'
          )}>
            {user?.image ? (
              <Image
                width={200}
                height={200}
                src={user.image}
                alt={'profile image'}
                className='w-full h-full object-cover rounded-full'
              />
            ) : (
              <AvatarFallback className='rounded-full bg-linear-to-br from-green-500 to-green-600 text-white font-semibold text-xs sm:text-sm w-full h-full flex items-center justify-center'>
                {userInitials}
              </AvatarFallback>
            )}
          </Avatar>
        </Component>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn(
          'rounded-xl z-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-2xl',
          // Mobile responsive width and padding
          'w-[calc(100vw-2rem)] max-w-[280px] sm:min-w-[280px]',
          'p-2 sm:p-2',
          // Mobile positioning
          side === 'bottom' && 'mb-2',
        )}
        side={side}
        align={isMobile ? 'end' : 'end'}
        sideOffset={isMobile ? 4 : 8}
        alignOffset={isMobile ? -8 : 0}
      >
        <DropdownMenuLabel className='p-0 font-normal'>
          <div className={cn(
            'flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 sm:py-3',
            'bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
            'rounded-lg mb-2 border border-green-100 dark:border-green-900/30'
          )}>
            <Avatar className={cn(
              'flex aspect-square items-center justify-center rounded-full bg-linear-to-br from-green-500 to-green-600 text-white shadow-md ring-2 ring-green-200 dark:ring-green-800',
              'size-9 sm:size-11'
            )}>
              {user?.image ? (
                <Image
                  width={200}
                  height={200}
                  className='w-full h-full object-cover rounded-full'
                  src={user.image}
                  alt={'profile image'}
                />
              ) : (
                <AvatarFallback className='rounded-full bg-linear-to-br from-green-500 to-green-600 text-white font-semibold text-sm sm:text-base w-full h-full flex items-center justify-center'>
                  {userInitials}
                </AvatarFallback>
              )}
            </Avatar>
            <div className='grid flex-1 text-left leading-tight min-w-0'>
              <span className='truncate font-semibold text-gray-900 dark:text-white text-sm sm:text-base'>
                {user?.firstName} {user?.middleName}
              </span>
              <span className='truncate text-xs text-gray-600 dark:text-gray-400 mt-0.5'>
                {user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <div className='px-1 py-1'>
          <DropdownMenuLabel className='px-2 sm:px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
            Account
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push('/profile')}
            className={cn(
              'cursor-pointer rounded-lg my-1',
              'px-3 py-3 sm:py-2.5',
              'hover:bg-green-50 dark:hover:bg-green-950/20',
              'active:bg-green-100 dark:active:bg-green-950/30',
              'text-gray-700 dark:text-gray-300',
              'transition-colors',
              'focus:bg-green-50 dark:focus:bg-green-950/20',
              // Mobile: larger touch targets
              'min-h-[44px] sm:min-h-0',
              'flex items-center'
            )}
          >
            <UserIcon className='mr-3 h-4 w-4 sm:h-4 sm:w-4 text-green-600 dark:text-green-400 shrink-0' />
            <span className='font-medium text-sm sm:text-base'>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push('/my-orders')}
            className={cn(
              'cursor-pointer rounded-lg my-1',
              'px-3 py-3 sm:py-2.5',
              'hover:bg-green-50 dark:hover:bg-green-950/20',
              'active:bg-green-100 dark:active:bg-green-950/30',
              'text-gray-700 dark:text-gray-300',
              'transition-colors',
              'focus:bg-green-50 dark:focus:bg-green-950/20',
              // Mobile: larger touch targets
              'min-h-[44px] sm:min-h-0',
              'flex items-center'
            )}
          >
            <ShoppingCart className='mr-3 h-4 w-4 sm:h-4 sm:w-4 text-green-600 dark:text-green-400 shrink-0' />
            <span className='font-medium text-sm sm:text-base'>My Orders</span>
          </DropdownMenuItem>

          {user?.roles?.length && user.roles.length > 0 && (
            <>
              <DropdownMenuSeparator className='my-2 bg-gray-200 dark:bg-gray-700' />
              <DropdownMenuLabel className='px-2 sm:px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Administration
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => router.push('/admin')}
                className={cn(
                  'cursor-pointer rounded-lg my-1',
                  'px-3 py-3 sm:py-2.5',
                  'hover:bg-green-50 dark:hover:bg-green-950/20',
                  'active:bg-green-100 dark:active:bg-green-950/30',
                  'text-gray-700 dark:text-gray-300',
                  'transition-colors',
                  'focus:bg-green-50 dark:focus:bg-green-950/20',
                  // Mobile: larger touch targets
                  'min-h-[44px] sm:min-h-0',
                  'flex items-center'
                )}
              >
                <Settings2 className='mr-3 h-4 w-4 sm:h-4 sm:w-4 text-green-600 dark:text-green-400 shrink-0' />
                <span className='font-medium text-sm sm:text-base'>Go to Panel</span>
                <ChevronDown className='ml-auto h-4 w-4 text-gray-400 -rotate-90 shrink-0' />
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className='my-2 bg-gray-200 dark:bg-gray-700' />
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoading}
            className={cn(
              'cursor-pointer rounded-lg my-1',
              'px-3 py-3 sm:py-2.5',
              'hover:bg-red-50 dark:hover:bg-red-950/20',
              'active:bg-red-100 dark:active:bg-red-950/30',
              'text-red-600 dark:text-red-400',
              'transition-colors',
              'focus:bg-red-50 dark:focus:bg-red-950/20',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              // Mobile: larger touch targets
              'min-h-[44px] sm:min-h-0',
              'flex items-center'
            )}
          >
            <LogOutIcon className='mr-3 h-4 w-4 sm:h-4 sm:w-4 shrink-0' />
            <span className='font-medium text-sm sm:text-base'>{isLoading ? 'Logging out...' : 'Log Out'}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

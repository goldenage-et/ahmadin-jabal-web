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
import { LogOutIcon, Settings2, ShoppingCart, UserIcon } from 'lucide-react';
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
  TriggerComponent?: any;
  className?: string;
}

function UserMenu({ TriggerComponent, className, user, side }: UserMenuProps) {
  const router = useRouter();
  const { mutate, isLoading } = useApiMutation();

  const handleLogout = () => {
    mutate(logout);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='h-9 p-0'>
        <TriggerComponent
          size='lg'
          className={cn(
            'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ps-1 w-[calc(100%-0.5rem)] ms-1 pe-1 py-1',
            'flex items-center gap-2 h-10 w-10 rounded-full bg-accent border',
            className,
          )}
        >
          <Avatar className='flex aspect-square size-7 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground p-0'>
            {user?.image ? (
              <Image
                width={200}
                height={200}
                src={user.image}
                alt={'profile image'}
                className='w-full h-full object-cover'
              />
            ) : (
              <AvatarFallback className='rounded-sm bg-primary w-10'>
                {(user?.firstName?.[0] || user?.middleName?.[0]) ?? (
                  <UserIcon className='size-4' />
                )}
              </AvatarFallback>
            )}
          </Avatar>
        </TriggerComponent>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='min-w-56 rounded-xl z-[52]'
        side={side}
        align='end'
        sideOffset={4}
      >
        <DropdownMenuLabel className='p-0 font-normal'>
          <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
            <Avatar className='flex aspect-square size-9 mx-1 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground'>
              {user?.image ? (
                <Image
                  width={200}
                  height={200}
                  className='w-full h-full object-cover'
                  src={user.image}
                  alt={'profile image'}
                />
              ) : (
                <AvatarFallback className='rounded-md bg-primary'>
                  {(user?.firstName?.[0] || user?.middleName?.[0]) ?? (
                    <UserIcon className='size-4' />
                  )}
                </AvatarFallback>
              )}
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>
                {user?.firstName} {user?.middleName}
              </span>
              <span className='truncate text-xs'>{user?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className='bg-border' />
        <DropdownMenuLabel>Account</DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => router.push('/profile')}
          className='hover:cursor-pointer'
        >
          <UserIcon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/my-orders')}
          className='hover:cursor-pointer'
        >
          <ShoppingCart />
          My Orders
        </DropdownMenuItem>

        {user?.roles?.length && user.roles.length > 0 && (
          <>
            <DropdownMenuSeparator className='bg-border' />
            <DropdownMenuLabel>Administration</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => router.push('/admin')}
              className='hover:cursor-pointer'
            >
              <Settings2 />
              Go to Panel
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className='bg-border' />
        <DropdownMenuItem
          onClick={handleLogout}
          className='hover:cursor-pointer'
        >
          <LogOutIcon />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

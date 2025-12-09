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
import { Badge } from '@/components/ui/badge';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { isPremiumUser } from '@/lib/premium';
import { TAuthUser } from '@repo/common';
import { 
  LogOutIcon, 
  Settings2, 
  ShoppingCart, 
  UserIcon, 
  ChevronDown,
  Crown,
  Sparkles,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
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
  const isPremium = user ? isPremiumUser(user) : false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='h-9 p-0'>
        <Component
          size='lg'
          className={cn(
            'data-[state=open]:bg-primary/10 data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/20',
            'ps-1 w-[calc(100%-0.5rem)] ms-1 pe-1 py-1',
            'flex items-center gap-2 rounded-full border-2 border-transparent',
            'bg-gradient-to-br from-background to-background/80 backdrop-blur-sm',
            'shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95',
            'ring-2 ring-primary/10 hover:ring-primary/30',
            // Mobile responsive sizing
            'h-9 w-9 sm:h-10 sm:w-10',
            'group relative overflow-hidden',
            className,
          )}
        >
          {/* Animated background gradient */}
          <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          
          <Avatar className={cn(
            'flex aspect-square items-center justify-center rounded-full p-0 shadow-lg relative z-10',
            'size-7 sm:size-8',
            'ring-2 ring-background/50',
            // Premium border: animated gold gradient ring
            isPremium
              ? 'ring-4 ring-yellow-400/60 dark:ring-yellow-500/60 ring-offset-2 ring-offset-background animate-pulse'
              : 'ring-2 ring-primary/30'
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
              <AvatarFallback className='rounded-full bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-background font-semibold text-xs sm:text-sm w-full h-full flex items-center justify-center shadow-inner'>
                {userInitials}
              </AvatarFallback>
            )}
            {/* Premium badge overlay */}
            {isPremium && (
              <div className='absolute -top-1 -right-1 z-20'>
                <div className='relative'>
                  <div className='absolute inset-0 bg-yellow-400 blur-md opacity-60 animate-pulse'></div>
                  <Crown className='relative h-3 w-3 text-yellow-500 fill-yellow-500' />
                </div>
              </div>
            )}
          </Avatar>
        </Component>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn(
          'rounded-2xl z-52 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl',
          'overflow-hidden',
          // Mobile responsive width and padding
          'w-[calc(100vw-2rem)] max-w-[320px] sm:min-w-[320px]',
          'p-0',
          // Mobile positioning
          side === 'bottom' && 'mb-2',
        )}
        side={side}
        align={isMobile ? 'end' : 'end'}
        sideOffset={isMobile ? 4 : 8}
        alignOffset={isMobile ? -8 : 0}
      >
        {/* Profile Header Card with Gradient */}
        <div className={cn(
          'relative overflow-hidden',
          'bg-gradient-to-br from-primary via-primary/90 to-primary/80',
          'px-4 sm:px-5 py-5 sm:py-6'
        )}>
          {/* Animated background pattern */}
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]'></div>
          </div>
          
          <div className='relative z-10 flex items-start gap-3 sm:gap-4'>
            <div className='relative'>
              <Avatar className={cn(
                'flex aspect-square items-center justify-center rounded-2xl shadow-2xl',
                'size-14 sm:size-16',
                'ring-4 ring-background/50',
                // Premium border: animated gold gradient ring
                isPremium
                  ? 'ring-4 ring-yellow-400/80 dark:ring-yellow-500/80 ring-offset-2 ring-offset-primary animate-pulse'
                  : 'ring-2 ring-background/80'
              )}>
                {user?.image ? (
                  <Image
                    width={200}
                    height={200}
                    className='w-full h-full object-cover rounded-2xl'
                    src={user.image}
                    alt={'profile image'}
                  />
                ) : (
                  <AvatarFallback className='rounded-2xl bg-gradient-to-br from-background/20 to-background/10 text-background font-bold text-lg sm:text-xl w-full h-full flex items-center justify-center backdrop-blur-sm'>
                    {userInitials}
                  </AvatarFallback>
                )}
              </Avatar>
              {/* Premium badge */}
              {isPremium && (
                <div className='absolute -top-2 -right-2 z-20'>
                  <div className='relative'>
                    <div className='absolute inset-0 bg-yellow-400 blur-lg opacity-70 animate-pulse'></div>
                    <div className='relative bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full p-1.5 shadow-lg'>
                      <Crown className='h-4 w-4 text-white fill-white' />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className='flex-1 min-w-0 pt-1'>
              <div className='flex items-center gap-2 mb-1'>
                <h3 className='truncate font-bold text-background text-base sm:text-lg'>
                  {user?.firstName} {user?.middleName}
                </h3>
                {isPremium && (
                  <Badge className='bg-yellow-400/20 text-yellow-100 border-yellow-300/30 text-xs px-2 py-0.5'>
                    <Sparkles className='h-3 w-3 mr-1' />
                    Premium
                  </Badge>
                )}
              </div>
              <p className='truncate text-xs sm:text-sm text-background/80 mb-2'>
                {user?.email}
              </p>
              
              {/* Quick Stats */}
              <div className='flex items-center gap-3 mt-3 pt-3 border-t border-background/20'>
                <div className='flex items-center gap-1.5'>
                  <TrendingUp className='h-3.5 w-3.5 text-background/80' />
                  <span className='text-xs text-background/90 font-medium'>Active</span>
                </div>
                {isPremium && (
                  <div className='flex items-center gap-1.5'>
                    <Award className='h-3.5 w-3.5 text-yellow-200' />
                    <span className='text-xs text-yellow-100 font-medium'>Member</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='px-2 py-3 space-y-1'>
          <DropdownMenuLabel className='px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider'>
            Quick Access
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push('/profile')}
            className={cn(
              'cursor-pointer rounded-xl my-1 group/item',
              'px-4 py-3 sm:py-3',
              'hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5',
              'active:bg-primary/15',
              'text-foreground',
              'transition-all duration-200',
              'focus:bg-primary/10',
              // Mobile: larger touch targets
              'min-h-[48px] sm:min-h-[44px]',
              'flex items-center gap-3',
              'hover:translate-x-1'
            )}
          >
            <div className='p-2 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors'>
              <UserIcon className='h-4 w-4 text-primary shrink-0' />
            </div>
            <span className='font-semibold text-sm sm:text-base'>My Profile</span>
            <ChevronDown className='ml-auto h-4 w-4 text-muted-foreground -rotate-90 shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity' />
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push('/my-orders')}
            className={cn(
              'cursor-pointer rounded-xl my-1 group/item',
              'px-4 py-3 sm:py-3',
              'hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5',
              'active:bg-primary/15',
              'text-foreground',
              'transition-all duration-200',
              'focus:bg-primary/10',
              // Mobile: larger touch targets
              'min-h-[48px] sm:min-h-[44px]',
              'flex items-center gap-3',
              'hover:translate-x-1'
            )}
          >
            <div className='p-2 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors'>
              <ShoppingCart className='h-4 w-4 text-primary shrink-0' />
            </div>
            <span className='font-semibold text-sm sm:text-base'>My Orders</span>
            <ChevronDown className='ml-auto h-4 w-4 text-muted-foreground -rotate-90 shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity' />
          </DropdownMenuItem>

          {user?.roles?.length && user.roles.length > 0 && (
            <>
              <DropdownMenuSeparator className='my-3 bg-border/50' />
              <DropdownMenuLabel className='px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider'>
                Administration
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => router.push('/admin')}
                className={cn(
                  'cursor-pointer rounded-xl my-1 group/item',
                  'px-4 py-3 sm:py-3',
                  'hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5',
                  'active:bg-primary/15',
                  'text-foreground',
                  'transition-all duration-200',
                  'focus:bg-primary/10',
                  // Mobile: larger touch targets
                  'min-h-[48px] sm:min-h-[44px]',
                  'flex items-center gap-3',
                  'hover:translate-x-1'
                )}
              >
                <div className='p-2 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors'>
                  <Settings2 className='h-4 w-4 text-primary shrink-0' />
                </div>
                <span className='font-semibold text-sm sm:text-base'>Admin Panel</span>
                <Zap className='ml-auto h-4 w-4 text-yellow-500 shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity' />
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className='my-3 bg-border/50' />
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoading}
            className={cn(
              'cursor-pointer rounded-xl my-1 group/item',
              'px-4 py-3 sm:py-3',
              'hover:bg-gradient-to-r hover:from-destructive/10 hover:to-destructive/5',
              'active:bg-destructive/15',
              'text-foreground',
              'transition-all duration-200',
              'focus:bg-destructive/10',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              // Mobile: larger touch targets
              'min-h-[48px] sm:min-h-[44px]',
              'flex items-center gap-3',
              'hover:translate-x-1'
            )}
          >
            <div className='p-2 rounded-lg bg-destructive/10 group-hover/item:bg-destructive/20 transition-colors'>
              <LogOutIcon className='h-4 w-4 text-destructive shrink-0' />
            </div>
            <span className='font-semibold text-sm sm:text-base'>{isLoading ? 'Logging out...' : 'Sign Out'}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

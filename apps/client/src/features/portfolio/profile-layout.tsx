'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TAddress, TOrderBasic, TUserBasic } from '@repo/common';
import {
  Heart,
  ShoppingBag,
  Star,
  FileText,
  User,
  MapPin,
  MessageCircle,
  Settings,
  HelpCircle,
  BarChart3,
  UserPlus,
  Menu
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ProfileLayoutProps {
  user: TUserBasic;
  initialProfileData: {
    user: TUserBasic;
    totalOrders: number;
    totalSpent: number;
  };
  initialOrders: TOrderBasic[];
  initialAddresses: {
    data: TAddress[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  children: React.ReactNode;
}

export function ProfileLayout({
  user,
  initialProfileData,
  initialOrders,
  initialAddresses,
  children,
}: ProfileLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: User, href: '/profile' },
    { id: 'payment', label: 'Payment', icon: FileText, href: '/profile/payment' },
    { id: 'returns', label: 'Returns/refunds', icon: BarChart3, href: '/profile/returns' },
    { id: 'feedback', label: 'Feedback', icon: Star, href: '/profile/feedback' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/profile/settings' },
    { id: 'addresses', label: 'Shipping address', icon: MapPin, href: '/profile/addresses' },
    { id: 'messages', label: 'Message center', icon: MessageCircle, href: '/profile/messages' },
    { id: 'invite', label: 'Invite friends', icon: UserPlus, href: '/profile/invite' },
    { id: 'help', label: 'Help center', icon: HelpCircle, href: '/profile/help' },
    { id: 'reports', label: 'Manage reports', icon: FileText, href: '/profile/reports' },
  ];

  // Determine active section based on pathname
  const getActiveSection = () => {
    if (pathname === '/profile') return 'overview';
    const path = pathname.replace('/profile/', '');
    return path || 'overview';
  };

  const activeSection = getActiveSection();

  const SidebarContent = () => (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg'>Account</CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        <nav className='space-y-1'>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 text-left text-sm font-medium transition-colors ${activeSection === item.id
                  ? 'bg-red-50 text-red-700 border-r-2 border-red-500'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Icon className='h-4 w-4' />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 py-4 md:py-8'>
        {/* Mobile Header with Menu Button */}
        <div className='lg:hidden flex items-center justify-between mb-6'>
          <h1 className='text-xl font-semibold'>Account</h1>
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant='outline' size='sm'>
                <Menu className='h-4 w-4 mr-2' />
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-[280px] sm:w-[350px]'>
              <SheetHeader>
                <SheetTitle>Account Menu</SheetTitle>
              </SheetHeader>
              <div className='mt-6'>
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className='flex gap-4 md:gap-8'>
          {/* Desktop Sidebar - Sticky */}
          <div className='hidden lg:block w-64 shrink-0 sticky top-6 self-start max-h-[calc(100vh-8rem)] overflow-y-auto'>
            <SidebarContent />
          </div>

          {/* Main Content - Scrollable */}
          <div className='flex-1 min-w-0 overflow-y-auto'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

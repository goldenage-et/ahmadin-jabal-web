'use client';

import { AddressList } from '@/features/addresses';
import UserSetting from '@/features/user/components/user-setting';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TAddress, TOrderBasic, TUserBasic } from '@repo/common';
import {
  Heart,
  ShoppingBag,
  Star,
  Search,
  FileText,
  User,
  MapPin,
  MessageCircle,
  Settings,
  HelpCircle,
  BarChart3,
  UserPlus,
  Trash2,
  Menu
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface ProfileClientProps {
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
  initialTab: string;
}

export function ProfileClient({
  user,
  initialProfileData,
  initialOrders,
  initialAddresses,
  initialTab,
}: ProfileClientProps) {
  const [activeSection, setActiveSection] = useState(initialTab || 'orders');
  const [activeOrderTab, setActiveOrderTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'payment', label: 'Payment', icon: FileText },
    { id: 'returns', label: 'Returns/refunds', icon: FileText },
    { id: 'feedback', label: 'Feedback', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'addresses', label: 'Shipping address', icon: MapPin },
    { id: 'messages', label: 'Message center', icon: MessageCircle },
    { id: 'invite', label: 'Invite friends', icon: UserPlus },
    { id: 'help', label: 'Help center', icon: HelpCircle },
    { id: 'reports', label: 'Manage reports', icon: BarChart3 },
  ];

  const orderTabs = [
    { id: 'all', label: 'View all' },
    { id: 'to_pay', label: 'To pay' },
    { id: 'to_ship', label: 'To ship' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'processed', label: 'Processed' },
  ];

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileSidebarOpen(false); // Close mobile sidebar when section changes
  };

  const filteredOrders = initialOrders.filter(order => {
    const matchesSearch = searchTerm === '' ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeOrderTab === 'all' ||
      (activeOrderTab === 'to_pay' && order.paymentStatus === 'pending') ||
      (activeOrderTab === 'to_ship' && order.status === 'confirmed') ||
      (activeOrderTab === 'shipped' && order.status === 'shipped') ||
      (activeOrderTab === 'processed' && order.status === 'delivered');

    return matchesSearch && matchesTab;
  });

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className='space-y-6'>
            <div className='grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-medium'>Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{initialProfileData.totalOrders}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-medium'>Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{initialProfileData.totalSpent.toFixed(2)} ETB</div>
                </CardContent>
              </Card>
              {user.activeSubscription && (
                <Card>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-sm font-medium'>Subscription</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2'>
                      <div className='text-lg font-bold'>{user.activeSubscription.plan.name}</div>
                      <Link href='/profile/subscription'>
                        <Button variant='link' className='p-0 h-auto text-xs'>
                          Manage Subscription →
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className='space-y-6'>
            {/* Breadcrumb */}
            <div className='flex items-center space-x-2 text-sm text-gray-500'>
              <Link href='/' className='hover:text-gray-700'>Home</Link>
              <span>›</span>
              <Link href='/profile' className='hover:text-gray-700'>Account</Link>
              <span>›</span>
              <span className='text-gray-900 font-medium'>Orders</span>
            </div>

            {/* Order Tabs */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div className='flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto'>
                {orderTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveOrderTab(tab.id)}
                    className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeOrderTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className='flex items-center space-x-2'>
                <Button variant='outline' size='sm' className='text-xs sm:text-sm'>
                  <Trash2 className='h-4 w-4 mr-1 sm:mr-2' />
                  <span className='hidden sm:inline'>Deleted orders</span>
                  <span className='sm:hidden'>Deleted</span>
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div className='relative flex-1 max-w-md'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Order ID, book or store name'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10 pr-12'
                />
                <Button size='sm' className='absolute right-1 top-1/2 transform -translate-y-1/2'>
                  <Search className='h-4 w-4' />
                </Button>
              </div>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className='w-full sm:w-[180px]'>
                  <SelectValue placeholder='Time filter' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All / Last year</SelectItem>
                  <SelectItem value='month'>Last month</SelectItem>
                  <SelectItem value='3months'>Last 3 months</SelectItem>
                  <SelectItem value='6months'>Last 6 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
              <div className='space-y-4'>
                {filteredOrders.map((order: any) => (
                  <Card key={order.id} className='hover:shadow-md transition-shadow'>
                    <CardContent className='p-4 sm:p-6'>
                      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4'>
                        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4'>
                          <span className='font-semibold text-lg'>#{order.orderNumber}</span>
                          <div className='flex gap-2'>
                            <Badge className={getOrderStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                              {order.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                        <div className='text-left sm:text-right'>
                          <div className='font-semibold text-lg'>${order.total.toFixed(2)}</div>
                          <div className='text-sm text-gray-500'>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                        <div className='text-sm text-gray-600'>
                          {order.items?.length || 0} item(s)
                        </div>
                        <div className='flex flex-col sm:flex-row gap-2 sm:space-x-2'>
                          <Button variant='outline' size='sm' className='w-full sm:w-auto'>
                            Track Order
                          </Button>
                          <Button variant='outline' size='sm' className='w-full sm:w-auto'>
                            View Details
                          </Button>
                          {order.status === 'pending' && (
                            <Button variant='destructive' size='sm' className='w-full sm:w-auto'>
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                  <FileText className='h-12 w-12 text-gray-400' />
                </div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  No orders yet
                </h3>
                <p className='text-gray-600 mb-4'>
                  Please <Link href='/auth/login' className='text-blue-600 hover:underline'>switch account</Link> or{' '}
                  <Link href='/feedback' className='text-blue-600 hover:underline'>feedback</Link>
                </p>
              </div>
            )}
          </div>
        );

      case 'payment':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-gray-600'>Payment method management coming soon...</p>
            </CardContent>
          </Card>
        );

      case 'returns':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Returns & Refunds</CardTitle>
              <CardDescription>Manage your returns and refund requests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-gray-600'>Returns and refunds management coming soon...</p>
            </CardContent>
          </Card>
        );

      case 'feedback':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
              <CardDescription>Share your feedback about our platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-gray-600'>Feedback system coming soon...</p>
            </CardContent>
          </Card>
        );

      case 'addresses':
        return <AddressList addressesData={initialAddresses} />;

      case 'settings':
        return <UserSetting user={user} />;

      case 'messages':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Message Center</CardTitle>
              <CardDescription>Your messages and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-gray-600'>Message center coming soon...</p>
            </CardContent>
          </Card>
        );

      case 'invite':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Invite Friends</CardTitle>
              <CardDescription>Invite friends and earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-gray-600'>Invite friends feature coming soon...</p>
            </CardContent>
          </Card>
        );

      case 'help':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Help Center</CardTitle>
              <CardDescription>Get help and support</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-gray-600'>Help center coming soon...</p>
            </CardContent>
          </Card>
        );

      case 'reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Manage Reports</CardTitle>
              <CardDescription>Download your account reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-gray-600'>Report management coming soon...</p>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

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
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left text-sm font-medium transition-colors ${activeSection === item.id
                  ? 'bg-red-50 text-red-700 border-r-2 border-red-500'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Icon className='h-4 w-4' />
                <span>{item.label}</span>
              </button>
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
          {/* Desktop Sidebar */}
          <div className='hidden lg:block w-64 shrink-0'>
            <SidebarContent />
          </div>

          {/* Main Content */}
          <div className='flex-1 min-w-0'>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
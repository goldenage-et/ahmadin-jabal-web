'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getMyProfile, getMyOrders } from '@/actions/profile.action';
import { getAuth } from '@/actions/auth.action';
import { isPremiumUser } from '@/lib/premium';
import { useQuery } from '@tanstack/react-query';
import { 
  ShoppingBag, 
  DollarSign, 
  Heart, 
  TrendingUp, 
  Clock, 
  Crown,
  Sparkles,
  Award,
  Zap,
  BookOpen,
  CreditCard,
  ArrowRight,
  Package,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function OverviewContent() {
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: getMyProfile,
  });

  const { data: ordersData } = useQuery({
    queryKey: ['my-orders'],
    queryFn: getMyOrders,
  });

  const { data: authData } = useQuery({
    queryKey: ['auth'],
    queryFn: getAuth,
  });

  const user = authData?.user;
  const isPremium = isPremiumUser(user);
  const recentOrders = ordersData?.orders?.slice(0, 3) || [];
  const totalOrders = profileData?.totalOrders || 0;
  const totalSpent = profileData?.totalSpent || 0;
  const activeSubscription = user?.activeSubscription;

  // Calculate average order value
  const averageOrderValue = totalOrders > 0 ? (totalSpent / totalOrders).toFixed(2) : '0.00';

  // Get pending orders count
  const pendingOrders = ordersData?.orders?.filter(
    (order: any) => order.status === 'pending' || order.paymentStatus === 'pending'
  ).length || 0;

  return (
    <div className='space-y-6'>
      {/* Welcome Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-foreground mb-2'>
            Welcome back, {user?.firstName || 'User'}! 👋
          </h1>
          <p className='text-muted-foreground'>
            Here's an overview of your account activity
          </p>
        </div>
        {isPremium && (
          <Badge className='bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg'>
            <Crown className='h-4 w-4 mr-2' />
            Premium Member
          </Badge>
        )}
      </div>

      {/* Stats Grid */}
      <div className='grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        {/* Total Orders */}
        <Card className='group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          <CardHeader className='pb-3 relative z-10'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>Total Orders</CardTitle>
              <div className='p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                <ShoppingBag className='h-4 w-4 text-primary' />
              </div>
            </div>
          </CardHeader>
          <CardContent className='relative z-10'>
            <div className='text-3xl font-bold text-foreground mb-1'>{totalOrders}</div>
            <p className='text-xs text-muted-foreground'>All time orders</p>
          </CardContent>
        </Card>

        {/* Total Spent */}
        <Card className='group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          <CardHeader className='pb-3 relative z-10'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>Total Spent</CardTitle>
              <div className='p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                <DollarSign className='h-4 w-4 text-primary' />
              </div>
            </div>
          </CardHeader>
          <CardContent className='relative z-10'>
            <div className='text-3xl font-bold text-foreground mb-1'>{totalSpent.toFixed(2)} ETB</div>
            <p className='text-xs text-muted-foreground'>Lifetime spending</p>
          </CardContent>
        </Card>

        {/* Average Order Value */}
        <Card className='group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          <CardHeader className='pb-3 relative z-10'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>Avg. Order</CardTitle>
              <div className='p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                <TrendingUp className='h-4 w-4 text-primary' />
              </div>
            </div>
          </CardHeader>
          <CardContent className='relative z-10'>
            <div className='text-3xl font-bold text-foreground mb-1'>{averageOrderValue} ETB</div>
            <p className='text-xs text-muted-foreground'>Per order average</p>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card className='group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          <CardHeader className='pb-3 relative z-10'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>Pending</CardTitle>
              <div className='p-2 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors'>
                <Clock className='h-4 w-4 text-yellow-600' />
              </div>
            </div>
          </CardHeader>
          <CardContent className='relative z-10'>
            <div className='text-3xl font-bold text-foreground mb-1'>{pendingOrders}</div>
            <p className='text-xs text-muted-foreground'>Awaiting action</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Status Card */}
      {activeSubscription ? (
        <Card className='border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-primary/5 to-transparent relative overflow-hidden'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.1),transparent_50%)]'></div>
          <CardHeader className='relative z-10'>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-lg font-bold flex items-center gap-2'>
                  <Crown className='h-5 w-5 text-yellow-500' />
                  Active Subscription
                </CardTitle>
                <CardDescription className='mt-1'>
                  {activeSubscription.plan.name} • Premium Access
                </CardDescription>
              </div>
              <Badge className='bg-green-500 text-white border-0'>
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className='relative z-10'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground mb-2'>
                  Enjoy unlimited access to premium content
                </p>
                <Button asChild variant='outline' size='sm' className='mt-2'>
                  <Link href='/profile/subscription'>
                    Manage Subscription
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
              </div>
              <div className='hidden sm:block'>
                <div className='p-4 rounded-xl bg-primary/10 border border-primary/20'>
                  <Sparkles className='h-8 w-8 text-primary' />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className='border-2 border-dashed border-muted-foreground/30 bg-muted/30'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-lg font-bold'>Upgrade to Premium</CardTitle>
                <CardDescription className='mt-1'>
                  Unlock exclusive content and features
                </CardDescription>
              </div>
              <Crown className='h-6 w-6 text-muted-foreground' />
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className='w-full sm:w-auto'>
              <Link href='/subscriptions'>
                View Plans
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Premium Features Section */}
      {isPremium && (
        <Card className='border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent'>
          <CardHeader>
            <CardTitle className='text-lg font-bold flex items-center gap-2'>
              <Award className='h-5 w-5 text-yellow-600' />
              Premium Benefits
            </CardTitle>
            <CardDescription>
              Exclusive features available to premium members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              <div className='flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-yellow-500/20'>
                <div className='p-2 rounded-lg bg-yellow-500/10'>
                  <BookOpen className='h-5 w-5 text-yellow-600' />
                </div>
                <div>
                  <h4 className='font-semibold text-sm mb-1'>Unlimited Access</h4>
                  <p className='text-xs text-muted-foreground'>Access all premium content</p>
                </div>
              </div>
              <div className='flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-yellow-500/20'>
                <div className='p-2 rounded-lg bg-yellow-500/10'>
                  <Zap className='h-5 w-5 text-yellow-600' />
                </div>
                <div>
                  <h4 className='font-semibold text-sm mb-1'>Priority Support</h4>
                  <p className='text-xs text-muted-foreground'>Get faster responses</p>
                </div>
              </div>
              <div className='flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-yellow-500/20'>
                <div className='p-2 rounded-lg bg-yellow-500/10'>
                  <Star className='h-5 w-5 text-yellow-600' />
                </div>
                <div>
                  <h4 className='font-semibold text-sm mb-1'>Early Access</h4>
                  <p className='text-xs text-muted-foreground'>New content first</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg font-bold'>Recent Orders</CardTitle>
              <Button asChild variant='ghost' size='sm'>
                <Link href='/my-orders'>
                  View All
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {recentOrders.map((order: any) => (
                <Link
                  key={order.id}
                  href={`/my-orders`}
                  className='flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors group'
                >
                  <div className='flex items-center gap-3'>
                    <div className='p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                      <Package className='h-4 w-4 text-primary' />
                    </div>
                    <div>
                      <p className='font-semibold text-sm'>#{order.orderNumber}</p>
                      <p className='text-xs text-muted-foreground'>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='text-right'>
                      <p className='font-semibold text-sm'>{order.total?.toFixed(2)} ETB</p>
                      <Badge 
                        variant='outline' 
                        className={cn(
                          'text-xs',
                          order.status === 'delivered' && 'bg-green-100 text-green-800 border-green-300',
                          order.status === 'pending' && 'bg-yellow-100 text-yellow-800 border-yellow-300',
                          order.status === 'shipped' && 'bg-blue-100 text-blue-800 border-blue-300'
                        )}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <ArrowRight className='h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors' />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg font-bold'>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
            <Button asChild variant='outline' className='h-auto flex-col py-4 gap-2'>
              <Link href='/my-orders'>
                <ShoppingBag className='h-5 w-5' />
                <span className='text-xs font-medium'>My Orders</span>
              </Link>
            </Button>
            <Button asChild variant='outline' className='h-auto flex-col py-4 gap-2'>
              <Link href='/profile/addresses'>
                <Package className='h-5 w-5' />
                <span className='text-xs font-medium'>Addresses</span>
              </Link>
            </Button>
            <Button asChild variant='outline' className='h-auto flex-col py-4 gap-2'>
              <Link href='/profile/subscription'>
                <CreditCard className='h-5 w-5' />
                <span className='text-xs font-medium'>Subscription</span>
              </Link>
            </Button>
            <Button asChild variant='outline' className='h-auto flex-col py-4 gap-2'>
              <Link href='/profile/settings'>
                <Star className='h-5 w-5' />
                <span className='text-xs font-medium'>Settings</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  TBookAnalytics,
  TBookDetailAnalytics,
  TReviewAnalytics,
} from '@repo/common';
import {
  Activity,
  BarChart3,
  DollarSign,
  Download,
  Eye,
  Filter,
  Package,
  PieChart,
  RefreshCw,
  ShoppingCart,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

interface BookAnalyticsProps {
  bookAnalytics: TBookDetailAnalytics;
  className?: string;
}

export default function BookAnalytics({
  bookAnalytics,
  className,
}: BookAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    format = 'number',
    trend = 'neutral',
  }: {
    title: string;
    value: number;
    change?: number;
    icon: any;
    format?: 'number' | 'currency' | 'percentage';
    trend?: 'up' | 'down' | 'neutral';
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'currency':
          return formatCurrency(val);
        case 'percentage':
          return `${val.toFixed(1)}%`;
        default:
          return formatNumber(val);
      }
    };

    return (
      <Card className='border-0 shadow-sm hover:shadow-md transition-shadow'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div className='space-y-2'>
              <p className='text-sm font-medium text-muted-foreground'>
                {title}
              </p>
              <p className='text-2xl font-bold'>{formatValue(value)}</p>
              {change !== undefined && (
                <div
                  className={cn(
                    'flex items-center text-xs',
                    change > 0
                      ? 'text-green-600'
                      : change < 0
                        ? 'text-red-600'
                        : 'text-gray-600',
                  )}
                >
                  {change > 0 ? (
                    <TrendingUp className='h-3 w-3 mr-1' />
                  ) : change < 0 ? (
                    <TrendingDown className='h-3 w-3 mr-1' />
                  ) : null}
                  {Math.abs(change).toFixed(1)}% from last period
                </div>
              )}
            </div>
            <div
              className={cn(
                'p-3 rounded-full',
                trend === 'up'
                  ? 'bg-green-100'
                  : trend === 'down'
                    ? 'bg-red-100'
                    : 'bg-blue-100',
              )}
            >
              <Icon
                className={cn(
                  'h-6 w-6',
                  trend === 'up'
                    ? 'text-green-600'
                    : trend === 'down'
                      ? 'text-red-600'
                      : 'text-blue-600',
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const SimpleChart = ({
    data,
    type = 'bar',
  }: {
    data: any[];
    type?: 'bar' | 'line';
  }) => {
    const maxValue = Math.max(
      ...data.map((d) => d.sales || d.revenue || d.views),
    );

    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>Performance Trend</h3>
          <div className='flex items-center gap-2'>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='7d'>Last 7 days</SelectItem>
                <SelectItem value='30d'>Last 30 days</SelectItem>
                <SelectItem value='90d'>Last 90 days</SelectItem>
                <SelectItem value='1y'>Last year</SelectItem>
              </SelectContent>
            </Select>
            <button
              onClick={() => setIsLoading(true)}
              className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
            >
              <RefreshCw
                className={cn('h-4 w-4', isLoading && 'animate-spin')}
              />
            </button>
          </div>
        </div>

        <div className='h-64 flex items-end justify-between gap-2 p-4 bg-gray-50 rounded-lg'>
          {data.map((item, index) => {
            const height =
              ((item.sales || item.revenue || item.views) / maxValue) * 100;
            return (
              <div
                key={index}
                className='flex-1 flex flex-col items-center gap-2'
              >
                <div
                  className='w-full bg-linear-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-300 hover:from-blue-700 hover:to-blue-500'
                  style={{ height: `${height}%`, minHeight: '4px' }}
                />
                <div className='text-xs text-gray-600 text-center'>
                  {item.date
                    ? new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                    : item.month}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Book Analytics
          </h2>
          <p className='text-muted-foreground'>
            Detailed insights and performance metrics for your book
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
            <Filter className='h-4 w-4' />
          </button>
          <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
            <Download className='h-4 w-4' />
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <StatCard
          title='Total Sales'
          value={bookAnalytics.overview.totalSales}
          change={8.2}
          icon={ShoppingCart}
          trend='up'
        />
        <StatCard
          title='Total Revenue'
          value={bookAnalytics.overview.totalRevenue}
          change={15.3}
          icon={DollarSign}
          format='currency'
          trend='up'
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard
          title='Average Rating'
          value={bookAnalytics.overview.averageRating}
          change={0.2}
          icon={Star}
          trend='up'
        />
        <StatCard
          title='Total Reviews'
          value={bookAnalytics.overview.totalReviews}
          change={23.1}
          icon={Users}
          trend='up'
        />
        <StatCard
          title='Inventory Value'
          value={bookAnalytics.overview.inventoryValue}
          change={-5.4}
          icon={Package}
          format='currency'
          trend='down'
        />
        <StatCard
          title='Low Stock Items'
          value={bookAnalytics.overview.lowStockItems}
          change={-25.0}
          icon={Activity}
          trend='up'
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue='performance' className='space-y-4'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='performance'>Performance</TabsTrigger>
          <TabsTrigger value='trends'>Trends</TabsTrigger>
          <TabsTrigger value='breakdown'>Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value='performance' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <BarChart3 className='h-5 w-5' />
                Sales Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleChart data={bookAnalytics.salesData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='trends' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <TrendingUp className='h-5 w-5' />
                Monthly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleChart data={bookAnalytics.monthlyTrends} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='breakdown' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <PieChart className='h-5 w-5' />
                Category Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {bookAnalytics.categoryBreakdown.map((item, index) => (
                  <div key={index} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium'>{item.category}</span>
                      <span className='text-sm text-muted-foreground'>
                        {item.sales} sales ({item.percentage}%)
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2'>
                      <div
                        className='bg-linear-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300'
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

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
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { TAdminDashboardStats, TCategoryData, TRecentOrder, TRevenueTrendData } from '@repo/common';
import {
    DollarSign,
    EyeIcon,
    MoreHorizontal,
    Package,
    RefreshCw,
    ShoppingCart,
    Store,
    TrendingUp,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    XAxis,
    YAxis
} from 'recharts';

const chartConfig = {
    revenue: {
        label: 'Revenue',
        color: 'hsl(var(--chart-1))',
    },
    orders: {
        label: 'Orders',
        color: 'hsl(var(--chart-2))',
    },
};

export default function AdminDashboard({
    dashboardStats,
    revenueTrend,
    recentOrders,
    categoryData,
}: {
    dashboardStats: TAdminDashboardStats;
    revenueTrend: TRevenueTrendData[];
    recentOrders: TRecentOrder[];
    categoryData: TCategoryData[];
}) {

    const router = useRouter();
    const handleRefresh = () => {
        router.refresh();
    };

    return (
        <div className='min-h-screen bg-background p-6'>
            <div className='px-4 mx-auto space-y-6'>
                {/* Header */}
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-3xl font-bold text-foreground'>
                            Admin Dashboard
                        </h1>
                        <p className='text-muted-foreground mt-1'>
                            Store analytics and management overview
                        </p>
                    </div>
                    <div className='flex items-center space-x-3'>
                        <Button variant='outline' size='sm'>
                            <MoreHorizontal className='h-4 w-4 mr-2' />
                            More Actions
                        </Button>
                        <Button size='sm' onClick={handleRefresh}>
                            <RefreshCw className='h-4 w-4 mr-2' />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <Card className='border-l-4 border-l-green-500'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Total Revenue
                            </CardTitle>
                            <DollarSign className='h-4 w-4 text-green-500' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                ${dashboardStats.totalRevenue.toLocaleString()}
                            </div>
                            <div className='flex items-center text-xs text-muted-foreground'>
                                <TrendingUp className='h-3 w-3 text-green-500 mr-1' />
                                <span className='text-green-500'>
                                    +{dashboardStats.monthlyGrowth}%
                                </span>
                                <span className='ml-1'>from last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='border-l-4 border-l-purple-500'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Total Orders
                            </CardTitle>
                            <ShoppingCart className='h-4 w-4 text-purple-500' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                {dashboardStats.totalOrders.toLocaleString()}
                            </div>
                            <div className='flex items-center text-xs text-muted-foreground'>
                                <span>Avg: ${dashboardStats.avgOrderValue.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='border-l-4 border-l-orange-500'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Total Customers
                            </CardTitle>
                            <Users className='h-4 w-4 text-orange-500' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                {dashboardStats.totalCustomers.toLocaleString()}
                            </div>
                            <div className='flex items-center text-xs text-muted-foreground'>
                                <TrendingUp className='h-3 w-3 text-green-500 mr-1' />
                                <span className='text-green-500'>+8.2%</span>
                                <span className='ml-1'>from last month</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                            <Button
                                asChild
                                variant='outline'
                                className='h-20 flex flex-col items-center justify-center space-y-2'
                            >
                                <Link href={`/store/settings`}>
                                    <Store className='h-6 w-6' />
                                    <span>Manage Stores</span>
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant='outline'
                                className='h-20 flex flex-col items-center justify-center space-y-2'
                            >
                                <Link href={`/store/customers`}>
                                    <Users className='h-6 w-6' />
                                    <span>View Customers</span>
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant='outline'
                                className='h-20 flex flex-col items-center justify-center space-y-2'
                            >
                                <Link href={`/store/books`}>
                                    <Package className='h-6 w-6' />
                                    <span>Books</span>
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant='outline'
                                className='h-20 flex flex-col items-center justify-center space-y-2'
                            >
                                <Link href={`/store/orders`}>
                                    <ShoppingCart className='h-6 w-6' />
                                    <span>Order Management</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Charts Section */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    {/* Revenue Chart */}

                    <Card>
                        <CardHeader>
                            <CardTitle>Order Status Distribution</CardTitle>
                            <CardDescription>
                                Current distribution of order statuses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className='h-[300px] w-full'>
                                <BarChart
                                    data={[
                                        {
                                            status: 'Completed',
                                            count: Math.floor(dashboardStats.totalOrders * 0.7),
                                        },
                                        {
                                            status: 'Processing',
                                            count: Math.floor(dashboardStats.totalOrders * 0.15),
                                        },
                                        {
                                            status: 'Shipped',
                                            count: Math.floor(dashboardStats.totalOrders * 0.1),
                                        },
                                        {
                                            status: 'Pending',
                                            count: Math.floor(dashboardStats.totalOrders * 0.05),
                                        },
                                    ]}
                                    width={undefined}
                                    height={undefined}
                                >
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis dataKey='status' />
                                    <YAxis />
                                    <ChartTooltip
                                        content={<ChartTooltipContent payload={[]} label='' />}
                                    />
                                    <Bar dataKey='count' fill='hsl(var(--chart-1))' />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Category Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Store Categories</CardTitle>
                            <CardDescription>
                                Distribution of stores by category
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className='h-[300px] w-full'>
                                <PieChart width={undefined} height={undefined}>
                                    <Pie
                                        data={categoryData}
                                        cx='50%'
                                        cy='50%'
                                        outerRadius={80}
                                        dataKey='value'
                                        label={(props: { name?: string; percent?: number }) =>
                                            props.name && props.percent
                                                ? `${props.name} ${(props.percent * 100).toFixed(0)}%`
                                                : ''
                                        }
                                    >
                                        {categoryData.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip
                                        content={<ChartTooltipContent payload={[]} label='' />}
                                    />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue & Orders Trend</CardTitle>
                        <CardDescription>
                            Monthly revenue and order volume over the past year
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className='h-[300px] w-full'>
                            <AreaChart data={revenueTrend} width={undefined} height={undefined}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='month' />
                                <YAxis />
                                <ChartTooltip
                                    content={<ChartTooltipContent payload={[]} label='' />}
                                />
                                <Area
                                    type='monotone'
                                    dataKey='revenue'
                                    stroke='hsl(var(--chart-1))'
                                    fill='hsl(var(--chart-1))'
                                    fillOpacity={0.2}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                {/* Tables Section */}
                <div className='grid grid-cols-1 gap-6'>
                    {/* Recent Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>Latest orders across all stores</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className='font-medium'>{order.orderNumber}</TableCell>
                                            <TableCell>{order.customer}</TableCell>
                                            <TableCell>${order.amount}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        order.status === 'completed'
                                                            ? 'default'
                                                            : order.status === 'processing'
                                                                ? 'secondary'
                                                                : order.status === 'shipped'
                                                                    ? 'outline'
                                                                    : 'destructive'
                                                    }
                                                >
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{new Date(order.date).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Button asChild variant='outline' size='sm'>
                                                    <Link href={`/store/orders/${order.id}`}>
                                                        <EyeIcon className='h-4 w-4 mr-2' />
                                                        View
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                </div>


            </div>
        </div>
    );
}

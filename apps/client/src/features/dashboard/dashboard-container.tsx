'use client';

import { useQueryClient } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, BarChart3, Package } from 'lucide-react';
import { TAdminDashboardStats } from '@repo/common';

type TDashboardContainerProps = {
  stats: TAdminDashboardStats;
};

export function DashboardContainer({ stats }: TDashboardContainerProps) {
  const queryClient = useQueryClient();

  const activities = [
    { id: 1, message: 'System maintenance completed', time: '10m ago' },
    { id: 2, message: 'New vendor application submitted', time: '1h ago' },
    { id: 3, message: 'Database backup succeeded', time: '3h ago' },
    { id: 4, message: 'Payment gateway latency increased', time: '5h ago' },
  ];

  const orders = [
    { id: '#SPK781', customer: 'Priceton Gray', date: 'Mar 18, 2024', amount: '$2,145.90', status: 'Paid' },
    { id: '#SPK782', customer: 'Elsa Urena', date: 'Mar 17, 2024', amount: '$2,145.90', status: 'Unpaid' },
    { id: '#SPK783', customer: 'Gloria', date: 'Mar 16, 2024', amount: '$2,145.90', status: 'Paid' },
    { id: '#SPK784', customer: 'Priya', date: 'Mar 15, 2024', amount: '$2,145.90', status: 'Pending' },
    { id: '#SPK785', customer: 'Adam Smith', date: 'Mar 14, 2024', amount: '$2,145.90', status: 'Unpaid' },
  ];

  const topCustomers = [
    {
      id: 1,
      name: 'Dianne Russell',
      phone: '017******58',
      orders: 60,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 2,
      name: 'Wade Warren',
      phone: '017******58',
      orders: 35,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 3,
      name: 'Albert Flores',
      phone: '017******58',
      orders: 55,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 4,
      name: 'Bessie Cooper',
      phone: '017******58',
      orders: 60,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 5,
      name: 'Arlene McCoy',
      phone: '017******58',
      orders: 55,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 6,
      name: 'Arlene McCoy',
      phone: '017******58',
      orders: 50,
      avatar: '/api/placeholder/40/40'
    }
  ];

  const topSellingBooks = [
    {
      id: 1,
      name: 'Chair with Cushion',
      category: 'Furniture',
      price: '$124',
      sales: '260 Sales',
      image: '/api/placeholder/60/60'
    },
    {
      id: 2,
      name: 'Hand Bag',
      category: 'Accessories',
      price: '$564',
      sales: '181 Sales',
      image: '/api/placeholder/60/60'
    },
    {
      id: 3,
      name: 'Sneakers',
      category: 'Sports',
      price: '$964',
      sales: '134 Sales',
      image: '/api/placeholder/60/60'
    }
  ];

  const statsData = [
    {
      label: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      change: 'Registered users',
      trend: 'up',
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: `$${stats.avgOrderValue.toFixed(0)} avg`,
      trend: 'up',
      icon: Package,
      color: 'bg-orange-500'
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Breadcrumbs and Title */}
      <div className='flex items-center space-x-2 text-sm text-gray-500 mb-2'>
        <span>Dashboards</span>
        <span>→</span>
        <span className='text-gray-900 font-medium'>Ecommerce</span>
      </div>
      <h1 className='text-3xl font-bold text-gray-900 mb-6'>Ecommerce</h1>

      {/* KPI Cards */}
      <section>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {statsData.map((s) => (
            <div
              key={s.label}
              className='rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow'
            >
              <div className='flex items-center justify-between mb-4'>
                <div className={`p-3 rounded-lg ${s.color}`}>
                  <s.icon className='h-6 w-6 text-white' />
                </div>
                <div className={`flex items-center text-sm font-medium ${s.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {s.trend === 'up' ? <TrendingUp className='h-4 w-4 mr-1' /> : <TrendingDown className='h-4 w-4 mr-1' />}
                  {s.change}
                </div>
              </div>
              <p className='text-sm text-gray-600 mb-1'>{s.label}</p>
              <p className='text-2xl font-bold text-gray-900'>{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sales Report Chart */}
      <section>
        <div className='rounded-xl border bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold'>Sales Report</h3>
            <div className='flex space-x-2'>
              <button className='px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md'>Today</button>
              <button className='px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md'>Weekly</button>
              <button className='px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md'>Yearly</button>
            </div>
          </div>
          <div className='h-64 flex items-center justify-center bg-gray-50 rounded-lg'>
            <div className='text-center'>
              <BarChart3 className='h-12 w-12 text-gray-400 mx-auto mb-2' />
              <p className='text-gray-500'>Sales Chart Placeholder</p>
              <p className='text-sm text-gray-400'>Line and bar chart showing sales, expenses, and profit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Top Customers + Top Selling Books */}
      <section className='grid gap-6 lg:grid-cols-3'>
        {/* Top Customers */}
        <div className='lg:col-span-1'>
          <div className='rounded-xl border bg-white p-6 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-800'>Top Customers</h3>
              <a href='#' className='text-blue-600 hover:text-blue-700 text-sm font-medium'>View All &gt;</a>
            </div>
            <div className='space-y-4'>
              {topCustomers.map((customer) => (
                <div key={customer.id} className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        className='w-full h-full object-cover'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) {
                            fallback.classList.remove('hidden');
                            fallback.classList.add('flex');
                          }
                        }}
                      />
                      <div className='hidden w-full h-full bg-linear-to-br from-blue-400 to-purple-500 items-center justify-center text-white font-semibold text-sm'>
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div>
                      <p className='font-medium text-gray-800'>{customer.name}</p>
                      <p className='text-sm text-gray-500'>{customer.phone}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-medium text-gray-600'>Orders: {customer.orders}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Books */}
        <div className='lg:col-span-2'>
          <div className='rounded-xl border bg-white p-6 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold'>Top-Selling Books</h3>
              <button className='text-blue-600 hover:text-blue-700 text-sm font-medium'>View All</button>
            </div>
            <div className='space-y-4'>
              {topSellingBooks.map((book) => (
                <div key={book.id} className='flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors'>
                  <div className='w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center'>
                    <Package className='h-6 w-6 text-gray-500' />
                  </div>
                  <div className='flex-1'>
                    <h4 className='font-medium text-gray-900'>{book.name}</h4>
                    <p className='text-sm text-gray-500'>{book.category}</p>
                  </div>
                  <div className='text-right'>
                    <p className='font-semibold text-gray-900'>{book.price}</p>
                    <p className='text-sm text-gray-500'>{book.sales}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Recent Orders + System Health */}
      <section className='grid gap-6 lg:grid-cols-2'>
        <div className='rounded-xl border bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-800'>Recent Orders</h3>
            <button className='bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-medium transition-colors'>View All</button>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead>
                <tr className='text-left text-gray-600 border-b font-medium'>
                  <th className='px-2 py-3'>Order ID</th>
                  <th className='px-2 py-3'>Customer</th>
                  <th className='px-2 py-3'>Date</th>
                  <th className='px-2 py-3'>Amount</th>
                  <th className='px-2 py-3'>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className='border-b hover:bg-gray-50'>
                    <td className='px-2 py-3 font-medium text-blue-600'>{o.id}</td>
                    <td className='px-2 py-3 text-gray-800'>{o.customer}</td>
                    <td className='px-2 py-3 text-gray-600'>{o.date}</td>
                    <td className='px-2 py-3 text-gray-800'>{o.amount}</td>
                    <td className='px-2 py-3'>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${o.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : o.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='rounded-xl border bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-800'>Total Orders</h3>
            <button className='bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1'>
              View All
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </button>
          </div>

          {/* KPIs Section */}
          <div className='grid grid-cols-2 gap-4 mb-6'>
            <div>
              <p className='text-sm text-gray-600 mb-1'>Total Orders</p>
              <p className='text-2xl font-bold text-blue-600'>{stats.totalOrders.toLocaleString()}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600 mb-1'>Monthly Growth</p>
              <p className={`text-2xl font-bold ${stats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.monthlyGrowth > 0 ? '+' : ''}{stats.monthlyGrowth.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Circular Chart */}
          <div className='flex justify-center'>
            <div className='relative w-32 h-32'>
              {/* Calculate completion rate - assuming most orders are delivered */}
              {(() => {
                const completionRate = stats.totalOrders > 0 ? Math.min(95, Math.max(70, (stats.totalOrders / 1000) * 10)) : 85;
                const circumference = 2 * Math.PI * 40;
                const strokeDasharray = `${circumference * (completionRate / 100)} ${circumference}`;

                return (
                  <>
                    {/* Circular Progress Background */}
                    <svg className='w-32 h-32 transform -rotate-90' viewBox='0 0 100 100'>
                      {/* Background circle */}
                      <circle
                        cx='50'
                        cy='50'
                        r='40'
                        stroke='#e5e7eb'
                        strokeWidth='8'
                        fill='none'
                      />
                      {/* Progress circle */}
                      <circle
                        cx='50'
                        cy='50'
                        r='40'
                        stroke='#3b82f6'
                        strokeWidth='8'
                        fill='none'
                        strokeDasharray={strokeDasharray}
                        strokeLinecap='round'
                      />
                    </svg>
                    {/* Center text */}
                    <div className='absolute inset-0 flex flex-col items-center justify-center'>
                      <span className='text-2xl font-bold text-blue-600'>{Math.round(completionRate)}%</span>
                      <span className='text-sm text-gray-600'>Complete</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

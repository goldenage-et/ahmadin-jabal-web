'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
import { EOrderStatus, EPaymentStatus, TOrderQueryFilter } from '@repo/common';

interface OrdersFiltersProps {
  currentFilters: TOrderQueryFilter;
}

export function OrdersFilters({ currentFilters }: OrdersFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState({
    search: currentFilters.search || '',
    status: currentFilters.status || '',
    paymentStatus: currentFilters.paymentStatus || '',
    sortBy: currentFilters.sortBy || 'createdAt',
    sortOrder: currentFilters.sortOrder || 'desc',
  });

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    const params = new URLSearchParams(searchParams);

    // Update URL parameters
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change
    params.delete('page');

    startTransition(() => {
      router.push(`/admin/orders?${params.toString()}`);
    });
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    updateFilters({ [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Filter className='h-5 w-5' />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div>
            <label className='text-sm font-medium text-gray-700 mb-2 block'>
              Search
            </label>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search by order number...'
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className='pl-10'
                disabled={isPending}
              />
            </div>
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700 mb-2 block'>
              Status
            </label>
            <Select
              value={filters.status}
              onValueChange={(value) => {
                if (value === 'all') {
                  handleFilterChange('status', '');
                } else {
                  handleFilterChange('status', value);
                }
              }}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder='All statuses' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All statuses</SelectItem>
                {Object.values(EOrderStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700 mb-2 block'>
              Payment Status
            </label>
            <Select
              value={filters.paymentStatus}
              onValueChange={(value) => {
                if (value === 'all') {
                  handleFilterChange('paymentStatus', '');
                } else {
                  handleFilterChange('paymentStatus', value);
                }
              }}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder='All payment statuses' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All payment statuses</SelectItem>
                {Object.values(EPaymentStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700 mb-2 block'>
              Sort By
            </label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='createdAt'>Created Date</SelectItem>
                <SelectItem value='updatedAt'>Updated Date</SelectItem>
                <SelectItem value='total'>Total Amount</SelectItem>
                <SelectItem value='status'>Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className='text-sm font-medium text-gray-700 mb-2 block'>
              Sort Order
            </label>
            <Select
              value={filters.sortOrder}
              onValueChange={(value) => {
                handleFilterChange('sortOrder', value);
              }}
              disabled={isPending}
            >
              <SelectTrigger className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='desc'>Descending</SelectItem>
                <SelectItem value='asc'>Ascending</SelectItem>
              </SelectContent>
            </Select>
            {isPending && (
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900'></div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddressCard } from './address-card';
import { AddressForm } from './address-form';
import { getAddresses } from '@/actions/address.action';
import { TAddressQueryFilter, TAddress } from '@repo/common';
import { Plus, Search } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AddressListProps {
  addressesData?: {
    data: TAddress[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function AddressList({ addressesData }: AddressListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TAddressQueryFilter>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters((prev) => ({
      ...prev,
      search: value || undefined,
      page: 1, // Reset to first page when searching
    }));
  };

  if (error) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <p className='text-destructive'>Error loading addresses</p>
          <p className='text-sm text-muted-foreground'>
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Shipping Addresses</CardTitle>
            <CardDescription className='text-muted-foreground'>
              Manage your saved addresses for shipping and billing
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className='h-4 w-4 mr-2' />
            Add Address
          </Button>
        </div>
        {/* Search */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search addresses...'
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className='pl-9'
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* Address List */}
          {isLoading ? (
            <div className='flex items-center justify-center p-8'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
                <p className='text-muted-foreground'>Loading addresses...</p>
              </div>
            </div>
          ) : addressesData?.data && addressesData.data.length > 0 ? (
            <div className='grid gap-4 md:grid-cols-2'>
              {addressesData.data.map((address) => (
                <AddressCard key={address.id} address={address} />
              ))}
            </div>
          ) : (
            <div className='flex items-center justify-center p-8'>
              <div className='text-center'>
                <p className='text-muted-foreground mb-4'>No addresses found</p>
                {searchTerm ? (
                  <Button variant='outline' onClick={() => handleSearch('')}>
                    Clear search
                  </Button>
                ) : (
                  <Button onClick={() => setShowAddForm(true)}>
                    <Plus className='h-4 w-4 mr-2' />
                    Add your first address
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Pagination */}
          {addressesData && addressesData.totalPages > 1 && (
            <div className='flex items-center justify-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={filters.page <= 1}
              >
                Previous
              </Button>
              <span className='text-sm text-muted-foreground'>
                Page {addressesData.page} of {addressesData.totalPages}
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={filters.page >= addressesData.totalPages}
              >
                Next
              </Button>
            </div>
          )}

          {/* Add Address Form */}
          <AddressForm
            open={showAddForm}
            onOpenChange={setShowAddForm}
            address={null}
            mode='create'
          />
        </div>
      </CardContent>
    </Card>
  );
}

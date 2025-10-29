'use client';

import { AddressList } from '@/features/addresses';
import { useQuery } from '@tanstack/react-query';
import { getAddresses } from '@/actions/address.action';

export function AddressesContent() {
  const { data: addressesData } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => getAddresses({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }),
  });

  if (!addressesData) {
    return <div>Loading...</div>;
  }

  const safeAddresses = addressesData.error
    ? {
      data: [],
      total: 0,
      page: 0,
      limit: 0,
      totalPages: 0,
    }
    : addressesData;

  return (
    <div className='space-y-6'>
      <div className='flex items-center space-x-2 text-sm text-gray-500'>
        <a href='/' className='hover:text-gray-700'>Home</a>
        <span>›</span>
        <a href='/profile' className='hover:text-gray-700'>Account</a>
        <span>›</span>
        <span className='text-gray-900 font-medium'>Shipping address</span>
      </div>

      <AddressList addressesData={safeAddresses} />
    </div>
  );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMyProfile, getMyWishlist } from '@/actions/profile.action';
import { useQuery } from '@tanstack/react-query';

export function OverviewContent() {
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: getMyProfile,
  });

  const { data: wishlist = [] } = useQuery({
    queryKey: ['wishlist'],
    queryFn: getMyWishlist,
  });

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium'>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{profileData?.totalOrders || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium'>Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>${profileData?.totalSpent?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium'>Wishlist Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{wishlist.length}</div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}

'use client';

import { TStoreDetail } from '@repo/common';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Package, TrendingUp } from 'lucide-react';

interface StoreStatsProps {
  store: TStoreDetail;
}

export function StoreStats({ store }: StoreStatsProps) {
  // Mock data for demonstration - in real app, this would come from API
  const stats = {
    totalBooks: 156,
    totalSales: 2847,
    rating: 4.8,
    totalReviews: 1243,
    followers: 50,
    positiveReviews: 99.3,
  };

  return (
    <div className='bg-white border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
          <Card className='text-center'>
            <CardContent className='p-4'>
              <Package className='w-6 h-6 mx-auto mb-2 text-blue-600' />
              <div className='text-2xl font-bold text-gray-900'>
                {stats.totalBooks}
              </div>
              <div className='text-sm text-gray-600'>Books</div>
            </CardContent>
          </Card>

          <Card className='text-center'>
            <CardContent className='p-4'>
              <TrendingUp className='w-6 h-6 mx-auto mb-2 text-green-600' />
              <div className='text-2xl font-bold text-gray-900'>
                {stats.totalSales.toLocaleString()}
              </div>
              <div className='text-sm text-gray-600'>Sales</div>
            </CardContent>
          </Card>

          <Card className='text-center'>
            <CardContent className='p-4'>
              <Star className='w-6 h-6 mx-auto mb-2 text-yellow-500' />
              <div className='text-2xl font-bold text-gray-900'>
                {stats.rating}
              </div>
              <div className='text-sm text-gray-600'>Rating</div>
            </CardContent>
          </Card>

          <Card className='text-center'>
            <CardContent className='p-4'>
              <Users className='w-6 h-6 mx-auto mb-2 text-purple-600' />
              <div className='text-2xl font-bold text-gray-900'>
                {stats.totalReviews.toLocaleString()}
              </div>
              <div className='text-sm text-gray-600'>Reviews</div>
            </CardContent>
          </Card>

          <Card className='text-center'>
            <CardContent className='p-4'>
              <Users className='w-6 h-6 mx-auto mb-2 text-indigo-600' />
              <div className='text-2xl font-bold text-gray-900'>
                {stats.followers}
              </div>
              <div className='text-sm text-gray-600'>Followers</div>
            </CardContent>
          </Card>

          <Card className='text-center'>
            <CardContent className='p-4'>
              <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
                {stats.positiveReviews}% Positive
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

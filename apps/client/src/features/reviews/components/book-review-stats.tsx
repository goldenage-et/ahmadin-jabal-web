'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    oneStar: number;
    twoStar: number;
    threeStar: number;
    fourStar: number;
    fiveStar: number;
  };
  verifiedReviews: number;
  pendingReviews: number;
}

interface BookReviewStatsProps {
  stats: ReviewStats;
  isLoading?: boolean;
}

export function BookReviewStats({
  stats,
  isLoading = false,
}: BookReviewStatsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='animate-pulse'>
            <div className='flex items-center space-x-4 mb-4'>
              <div className='h-8 w-8 bg-gray-200 rounded'></div>
              <div className='space-y-2'>
                <div className='h-6 bg-gray-200 rounded w-16'></div>
                <div className='h-4 bg-gray-200 rounded w-24'></div>
              </div>
            </div>
            <div className='space-y-3'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='flex items-center space-x-3'>
                  <div className='h-4 w-4 bg-gray-200 rounded'></div>
                  <div className='flex-1 h-2 bg-gray-200 rounded'></div>
                  <div className='h-4 w-8 bg-gray-200 rounded'></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const starSize = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    }[size];

    return (
      <div className='flex items-center space-x-1'>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              star <= Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : star === Math.ceil(rating) && rating % 1 !== 0
                  ? 'fill-yellow-200 text-yellow-400'
                  : 'text-gray-300',
            )}
          />
        ))}
      </div>
    );
  };

  const getRatingPercentage = (count: number) => {
    return stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
  };

  const ratingBars = [
    { stars: 5, count: stats.ratingDistribution.fiveStar, label: '5 stars' },
    { stars: 4, count: stats.ratingDistribution.fourStar, label: '4 stars' },
    { stars: 3, count: stats.ratingDistribution.threeStar, label: '3 stars' },
    { stars: 2, count: stats.ratingDistribution.twoStar, label: '2 stars' },
    { stars: 1, count: stats.ratingDistribution.oneStar, label: '1 star' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Overall Rating */}
        <div className='flex items-center space-x-4'>
          <div className='text-3xl font-bold'>
            {stats.averageRating.toFixed(1)}
          </div>
          <div className='space-y-1'>
            {renderStars(stats.averageRating, 'lg')}
            <p className='text-sm text-gray-600'>
              Based on {stats.totalReviews} review
              {stats.totalReviews !== 1 ? 's' : ''}
            </p>
            {stats.verifiedReviews > 0 && (
              <p className='text-xs text-green-600'>
                {stats.verifiedReviews} verified purchase
                {stats.verifiedReviews !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className='space-y-3'>
          {ratingBars.map(({ stars, count, label }) => {
            const percentage = getRatingPercentage(count);
            return (
              <div key={stars} className='flex items-center space-x-3'>
                <div className='flex items-center space-x-1 w-16'>
                  <span className='text-sm font-medium'>{stars}</span>
                  <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                </div>
                <div className='flex-1'>
                  <Progress value={percentage} className='h-2' />
                </div>
                <div className='w-8 text-sm text-gray-600 text-right'>
                  {count}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Stats */}
        {(stats.verifiedReviews > 0 || stats.pendingReviews > 0) && (
          <div className='pt-4 border-t space-y-2'>
            {stats.verifiedReviews > 0 && (
              <div className='flex justify-between text-sm'>
                <span className='text-green-600'>Verified Reviews</span>
                <span>{stats.verifiedReviews}</span>
              </div>
            )}
            {stats.pendingReviews > 0 && (
              <div className='flex justify-between text-sm'>
                <span className='text-yellow-600'>Pending Review</span>
                <span>{stats.pendingReviews}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

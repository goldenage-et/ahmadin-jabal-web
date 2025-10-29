'use client';

import { useState, useEffect } from 'react';
import { TStoreDetail, TUserBasic } from '@repo/common';
import { StoreLayout } from '../components/store-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Star,
  MessageCircle,
  ThumbsUp,
  Flag,
  Image,
  Video,
  ChevronDown,
} from 'lucide-react';
import { getStoreReviews } from '@/app/_actions/store.action';

interface StoreFeedbackClientProps {
  store: TStoreDetail;
  user?: TUserBasic | null;
  reviews: { reviews: any[]; total: number; page: number; limit: number };
}

export function StoreFeedbackClient({
  store,
  user,
  reviews,
}: StoreFeedbackClientProps) {
  const [activeTab, setActiveTab] = useState('feedback');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [filteredReviews, setFilteredReviews] = useState(reviews.reviews);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize filtered reviews when component mounts
  useEffect(() => {
    setFilteredReviews(reviews.reviews);
  }, [reviews.reviews]);

  // Calculate stats from real data
  const totalReviews = reviews.total;
  const allReviews = reviews.reviews;

  // Calculate rating distribution
  const ratingCounts = allReviews.reduce(
    (acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );

  const positiveReviews = (ratingCounts[5] || 0) + (ratingCounts[4] || 0);
  const neutralReviews = ratingCounts[3] || 0;
  const negativeReviews = (ratingCounts[2] || 0) + (ratingCounts[1] || 0);
  const positivePercentage =
    totalReviews > 0
      ? ((positiveReviews / totalReviews) * 100).toFixed(1)
      : '0.0';

  // Calculate average store rating
  const averageRating =
    totalReviews > 0
      ? (
          allReviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        ).toFixed(1)
      : '0.0';

  // Filter function
  const handleFilterChange = async (rating: number | 'all') => {
    setIsLoading(true);
    setActiveFilter(rating.toString());

    try {
      if (rating === 'all') {
        setFilteredReviews(allReviews);
      } else {
        const response = await getStoreReviews(store.id, {
          page: 1,
          limit: 20,
          rating: rating as number,
        });

        if (!('error' in response)) {
          setFilteredReviews((response as any).reviews);
        }
      }
    } catch (error) {
      console.error('Error filtering reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${rating > i ? 'text-black' : 'text-gray-300'}`}
        fill={rating > i ? 'currentColor' : 'none'}
      />
    ));
  };

  return (
    <StoreLayout
      store={store}
      user={user}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
        {/* Page Header */}
        <div className='mb-4 sm:mb-6'>
          <h1 className='text-xl sm:text-2xl font-bold text-gray-900 mb-2'>
            Customer reviews
          </h1>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
          {/* Left Panel - Store Credibility */}
          <div className='lg:col-span-1 order-2 lg:order-1'>
            <div className='bg-white rounded-lg border p-4 sm:p-6'>
              {/* Store Info */}
              <div className='mb-6'>
                <h2 className='text-lg font-bold text-gray-900 mb-1'>
                  {store.name}
                </h2>
                <div className='flex items-center gap-1'>
                  <span className='text-sm text-gray-600'>
                    🇨🇳 China | From Jul 07, 2024
                  </span>
                </div>
              </div>

              {/* Store Credibility Section */}
              <div className='mb-6'>
                <h3 className='text-lg font-bold text-gray-900 mb-4'>
                  Store Credibility
                </h3>

                {/* Store Rating */}
                <div className='flex items-start gap-4 mb-4'>
                  <div>
                    <div className='text-3xl font-bold text-gray-900 mb-1'>
                      {averageRating}
                    </div>
                    <div className='text-sm text-gray-600 mb-2'>
                      store rating
                    </div>
                    <Badge className='bg-orange-100 text-orange-800 text-xs'>
                      Top
                    </Badge>
                  </div>

                  {/* Rating Categories */}
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-600'>
                        Items as description
                      </span>
                      <span className='text-sm font-medium text-gray-900'>
                        4.9
                      </span>
                      <Badge className='bg-orange-100 text-orange-800 text-xs'>
                        Top
                      </Badge>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-600'>
                        Communication
                      </span>
                      <span className='text-sm font-medium text-gray-900'>
                        4.9
                      </span>
                      <Badge className='bg-orange-100 text-orange-800 text-xs'>
                        Top
                      </Badge>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-600'>
                        Shipping speed
                      </span>
                      <span className='text-sm font-medium text-gray-900'>
                        4.9
                      </span>
                      <Badge className='bg-orange-100 text-orange-800 text-xs'>
                        Top
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Reviews Summary */}
              <div>
                <h3 className='text-lg font-bold text-gray-900 mb-4'>
                  Customer reviews ({totalReviews})
                </h3>

                <div className='flex items-start gap-4 mb-4'>
                  <div>
                    <div className='text-3xl font-bold text-gray-900 mb-1'>
                      {averageRating}
                    </div>
                    <div className='text-sm text-gray-600 mb-2'> rating</div>
                    <Badge className='bg-orange-100 text-orange-800 text-xs'>
                      Top
                    </Badge>
                  </div>

                  {/* Review Breakdown */}
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='h-2 bg-gray-800 rounded'
                        style={{
                          width: `${totalReviews > 0 ? (positiveReviews / totalReviews) * 100 : 0}%`,
                        }}
                      ></div>
                      <span className='text-sm text-gray-600'>
                        Positive {positiveReviews}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div
                        className='h-2 bg-gray-300 rounded'
                        style={{
                          width: `${totalReviews > 0 ? (neutralReviews / totalReviews) * 100 : 0}%`,
                        }}
                      ></div>
                      <span className='text-sm text-gray-600'>
                        Neutral {neutralReviews}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div
                        className='h-2 bg-gray-300 rounded'
                        style={{
                          width: `${totalReviews > 0 ? (negativeReviews / totalReviews) * 100 : 0}%`,
                        }}
                      ></div>
                      <span className='text-sm text-gray-600'>
                        Negative {negativeReviews}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Reviews */}
          <div className='lg:col-span-3 order-1 lg:order-2'>
            <div className='bg-white rounded-lg border'>
              {/* Reviews Header */}
              <div className='p-4 sm:p-6 border-b'>
                <h3 className='text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4'>
                  Customer reviews ({totalReviews})
                </h3>

                {/* Filters */}
                <div className='flex flex-wrap items-center gap-1 sm:gap-2 mb-3 sm:mb-4'>
                  <Button
                    variant={activeFilter === 'all' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setActiveFilter('all')}
                    className={`text-xs sm:text-sm ${activeFilter === 'all' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                  >
                    All ({totalReviews + 1})
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex items-center gap-1 text-xs sm:text-sm'
                  >
                    <Image className='h-3 w-3 sm:h-4 sm:w-4' />
                    (63)
                  </Button>

                  <Button
                    variant={activeFilter === 'all' ? 'default' : 'outline'}
                    size='sm'
                    className='text-xs sm:text-sm'
                    onClick={() => handleFilterChange('all')}
                    disabled={isLoading}
                  >
                    All
                  </Button>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Button
                      key={rating}
                      variant={
                        activeFilter === rating.toString()
                          ? 'default'
                          : 'outline'
                      }
                      size='sm'
                      className='text-xs sm:text-sm'
                      onClick={() => handleFilterChange(rating)}
                      disabled={isLoading}
                    >
                      {rating} ★
                    </Button>
                  ))}
                </div>

                {/* Sort Options */}
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs sm:text-sm text-gray-600'>
                      Sort by
                    </span>
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex items-center gap-1 text-xs sm:text-sm'
                    >
                      {sortBy === 'default' ? 'Default' : 'Newest'}
                      <ChevronDown className='h-3 w-3 sm:h-4 sm:w-4' />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className='p-4 sm:p-6'>
                {isLoading ? (
                  <div className='text-center py-8'>
                    <p className='text-gray-500'>Loading reviews...</p>
                  </div>
                ) : filteredReviews.length > 0 ? (
                  <div className='space-y-4 sm:space-y-6'>
                    {filteredReviews.map((review) => (
                      <div
                        key={review.id}
                        className='border-b pb-4 sm:pb-6 last:border-b-0'
                      >
                        {/* Star Rating */}
                        <div className='flex items-center gap-1 mb-2'>
                          {renderStars(review.rating)}
                        </div>

                        {/* Book Details & Date */}
                        <div className='text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3'>
                          {review.bookName},{' '}
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>

                        {/* Review Text */}
                        <div className='text-sm sm:text-base text-gray-900 leading-relaxed'>
                          {review.comment ||
                            review.title ||
                            'No comment provided'}
                        </div>

                        {/* Review Images */}
                        {review.images && review.images.length > 0 && (
                          <div className='flex gap-2 mt-3'>
                            {review.images
                              .slice(0, 3)
                              .map((image: string, index: number) => (
                                <div
                                  key={index}
                                  className='w-16 h-16 bg-gray-100 rounded border'
                                >
                                  <img
                                    src={image}
                                    alt={`Review image ${index + 1}`}
                                    className='w-full h-full object-cover rounded'
                                  />
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <p className='text-gray-500'>
                      No reviews found for this store.
                    </p>
                  </div>
                )}

                {/* Load More */}
                {filteredReviews.length > 0 && (
                  <div className='text-center mt-4 sm:mt-6'>
                    <Button variant='outline' size='sm' className='sm:size-lg'>
                      Load More Reviews
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}

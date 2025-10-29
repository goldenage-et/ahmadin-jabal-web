'use client';

import { useState, useEffect } from 'react';
import { TStoreDetail, TUserBasic } from '@repo/common';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Heart, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  followStore,
  getFollowerCount,
  getFollowingStatus,
  getStoreReviews,
} from '@/app/_actions/store.action';
import { useRouter } from 'next/navigation';

interface StoreHeaderProps {
  store: TStoreDetail;
  user?: TUserBasic | null;
}

export function StoreHeader({ store, user }: StoreHeaderProps) {
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [averageRating, setAverageRating] = useState<string>('0.0');
  const router = useRouter();

  const storeInitials = (store?.name || 'Store')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Load follower count and following status on component mount
  useEffect(() => {
    const loadStoreData = async () => {
      try {
        // Load follower count
        const followerResponse = await getFollowerCount(store.id);
        if (!('error' in followerResponse)) {
          setFollowerCount(
            (followerResponse as { followerCount: number }).followerCount,
          );
        }

        // Load average rating
        const reviewsResponse = await getStoreReviews(store.id, {
          page: 1,
          limit: 100,
        });
        if (!('error' in reviewsResponse)) {
          const reviews = (reviewsResponse as any).reviews;
          if (reviews && reviews.length > 0) {
            const totalRating = reviews.reduce(
              (sum: number, review: any) => sum + review.rating,
              0,
            );
            const avgRating = (totalRating / reviews.length).toFixed(1);
            setAverageRating(avgRating);
          }
        }

        // Load following status (only if user is authenticated)
        if (user) {
          try {
            const followingResponse = await getFollowingStatus(store.id);
            if (!('error' in followingResponse)) {
              setIsFollowing(
                (followingResponse as { isFollowing: boolean }).isFollowing,
              );
            }
          } catch (error) {
            console.error('Error loading following status:', error);
          }
        }
      } catch (error) {
        console.error('Error loading store data:', error);
      }
    };

    loadStoreData();
  }, [store.id, user]);

  const handleFollow = async () => {
    if (isLoading) return;

    // Check if user is authenticated
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    setIsLoading(true);
    try {
      const response = await followStore(store.id);
      if (!('error' in response)) {
        const followData = response as {
          isFollowing: boolean;
          followerCount: number;
        };
        setIsFollowing(followData.isFollowing);
        setFollowerCount(followData.followerCount);
      }
    } catch (error) {
      console.error('Error following/unfollowing store:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-white border-b'>
      {/* Top Bar */}
      <div className='bg-gray-800 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between py-3 space-y-4 lg:space-y-0'>
            {/* Store Info */}
            <div className='flex items-center space-x-3 sm:space-x-4'>
              <Avatar className='h-10 w-10 sm:h-12 sm:w-12'>
                <AvatarImage
                  src={store?.logo || ''}
                  alt={store?.name || 'Store'}
                />
                <AvatarFallback className='bg-primary text-primary-foreground text-xs sm:text-sm'>
                  {storeInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className='text-base sm:text-lg font-semibold'>
                  {store?.name || 'Store'}
                </h1>
                <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-300'>
                  <span>{averageRating} rating</span>
                  <span>{followerCount} followers</span>
                </div>
              </div>
            </div>

            {/* Search Bar - Hidden on mobile, shown on larger screens */}
            <div className='hidden md:flex flex-1 max-w-md mx-4 lg:mx-8'>
              <div className='relative w-full'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  placeholder='Search in this store'
                  className='pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex items-center space-x-2 sm:space-x-3'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleFollow}
                disabled={isLoading}
                className={`text-xs sm:text-sm px-2 sm:px-3 ${
                  isFollowing
                    ? 'bg-white text-gray-800 hover:bg-gray-100'
                    : 'bg-transparent border-white text-white hover:bg-white hover:text-gray-800'
                }`}
              >
                {isLoading ? '...' : isFollowing ? 'UNFOLLOW' : '+ FOLLOW'}
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='bg-white text-gray-800 hover:bg-gray-100 text-xs sm:text-sm px-2 sm:px-3'
              >
                Contact Now
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className='md:hidden mt-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                placeholder='Search in this store'
                className='pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { useApiMutation, UseApiMutationRef } from '@/hooks/use-api-mutation';
import {
  EReviewStatus,
  TBookReviewBasic,
  TReviewAnalytics,
} from '@repo/common';
import {
  CheckCircle2,
  Download,
  Filter,
  Flag,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Star,
  ThumbsUp,
  User,
  XCircle,
} from 'lucide-react';
import { useRef, useState } from 'react';
import {
  bulkModerateBookReviews,
  moderateBookReview,
  respondToBookReview,
} from '../../reviews/actions/review.action';

export default function ReviewManagement({
  bookId,
  reviews,
  reviewAnalytics,
}: {
  bookId: string;
  reviews: TBookReviewBasic[];
  reviewAnalytics: TReviewAnalytics;
}) {
  const bulkModerateReviewsMutation = useRef<UseApiMutationRef>(null);
  const moderateReviewMutation = useRef<UseApiMutationRef>(null);
  const { mutate } = useApiMutation();
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);

  const [reviewFilters, setReviewFilters] = useState({
    status: 'all' as string,
    rating: 'all' as string,
    verified: 'all' as string,
  });

  const handleBulkModerateReviews = async (
    reviewIds: string[],
    status: EReviewStatus,
  ) => {
    await mutate(
      () => bulkModerateBookReviews(reviewIds, status),
      {
        successMessage: 'Reviews moderated successfully',
        errorMessage: 'Failed to moderate reviews',
      },
      bulkModerateReviewsMutation,
    );
  };

  const handleModerateReview = async (
    reviewId: string,
    status: EReviewStatus,
  ) => {
    await mutate(
      () => moderateBookReview(reviewId, status),
      {
        successMessage: 'Review moderated successfully',
        errorMessage: 'Failed to moderate review',
      },
      moderateReviewMutation,
    );
  };

  const handleSelectAllReviews = () => {
    setSelectedReviews(reviews.map((review) => review.id));
  };

  const handleSelectReview = (reviewId: string) => {
    setSelectedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId],
    );
  };

  const handleFilterChange = (newFilters: any) => {
    setReviewFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <Card className='border-0 shadow-lg'>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-xl font-semibold'>
              Review Management
            </CardTitle>
            <p className='text-sm text-slate-600'>
              Manage and moderate customer reviews
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm'>
              <Filter className='h-4 w-4 mr-2' />
              Filter
            </Button>
            <Button variant='outline' size='sm'>
              <Download className='h-4 w-4 mr-2' />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Review Filters */}
          <div className='flex flex-wrap items-center gap-4 p-4 bg-slate-50 rounded-lg'>
            <div className='flex items-center gap-2'>
              <Label className='text-sm font-medium'>Filter by:</Label>
              <div className='flex gap-2'>
                <Button
                  variant={
                    reviewFilters.rating === 'all' ? 'default' : 'outline'
                  }
                  size='sm'
                  onClick={() => handleFilterChange({ rating: 'all' })}
                >
                  All Reviews
                </Button>
                <Button
                  variant={reviewFilters.rating === '5' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => handleFilterChange({ rating: '5' })}
                >
                  5 Stars
                </Button>
                <Button
                  variant={reviewFilters.rating === '4' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => handleFilterChange({ rating: '4' })}
                >
                  4 Stars
                </Button>
                <Button
                  variant={reviewFilters.rating === '3' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => handleFilterChange({ rating: '3' })}
                >
                  3 Stars
                </Button>
                <Button
                  variant={reviewFilters.rating === '2' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => handleFilterChange({ rating: '2' })}
                >
                  2 Stars
                </Button>
                <Button
                  variant={reviewFilters.rating === '1' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => handleFilterChange({ rating: '1' })}
                >
                  1 Star
                </Button>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Label className='text-sm font-medium'>Status:</Label>
              <div className='flex gap-2'>
                <Button
                  variant={
                    reviewFilters.status === 'all' ? 'default' : 'outline'
                  }
                  size='sm'
                  onClick={() => handleFilterChange({ status: 'all' })}
                >
                  All
                </Button>
                <Button
                  variant={
                    reviewFilters.status === 'approved' ? 'default' : 'outline'
                  }
                  size='sm'
                  onClick={() => handleFilterChange({ status: 'approved' })}
                >
                  Approved
                </Button>
                <Button
                  variant={
                    reviewFilters.status === 'pending' ? 'default' : 'outline'
                  }
                  size='sm'
                  onClick={() => handleFilterChange({ status: 'pending' })}
                >
                  Pending
                </Button>
                <Button
                  variant={
                    reviewFilters.status === 'rejected' ? 'default' : 'outline'
                  }
                  size='sm'
                  onClick={() => handleFilterChange({ status: 'rejected' })}
                >
                  Rejected
                </Button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedReviews.length > 0 && (
            <div className='flex items-center gap-2 p-3 bg-blue-50 rounded-lg'>
              <span className='text-sm font-medium text-blue-700'>
                {selectedReviews.length} review(s) selected
              </span>
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() =>
                    handleBulkModerateReviews(
                      selectedReviews,
                      EReviewStatus.approved,
                    )
                  }
                  disabled={bulkModerateReviewsMutation.current?.isLoading}
                >
                  {bulkModerateReviewsMutation.current?.isLoading ? (
                    <Loader2 className='h-4 w-4 mr-1 spin-infinite' />
                  ) : (
                    <CheckCircle2 className='h-4 w-4 mr-1' />
                  )}
                  Approve
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() =>
                    handleBulkModerateReviews(
                      selectedReviews,
                      EReviewStatus.rejected,
                    )
                  }
                  disabled={bulkModerateReviewsMutation.current?.isLoading}
                >
                  {bulkModerateReviewsMutation.current?.isLoading ? (
                    <Loader2 className='h-4 w-4 mr-1 spin-infinite' />
                  ) : (
                    <XCircle className='h-4 w-4 mr-1' />
                  )}
                  Reject
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() =>
                    handleBulkModerateReviews(
                      selectedReviews,
                      EReviewStatus.hidden,
                    )
                  }
                  disabled={bulkModerateReviewsMutation.current?.isLoading}
                >
                  {bulkModerateReviewsMutation.current?.isLoading ? (
                    <Loader2 className='h-4 w-4 mr-1 spin-infinite' />
                  ) : (
                    <Flag className='h-4 w-4 mr-1' />
                  )}
                  Hide
                </Button>
              </div>
            </div>
          )}

          {/* Select All Header */}
          {reviews.length > 0 && (
            <div className='flex items-center gap-2 p-3 bg-slate-50 rounded-lg'>
              <Checkbox
                checked={selectedReviews.length === reviews.length}
                onCheckedChange={handleSelectAllReviews}
              />
              <span className='text-sm font-medium text-slate-700'>
                Select all reviews
              </span>
            </div>
          )}

          {/* Review List */}
          <div className='space-y-4'>
            {reviews.length === 0 ? (
              <div className='text-center py-8'>
                <MessageSquare className='h-12 w-12 text-slate-400 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-slate-600 mb-2'>
                  No reviews found
                </h3>
                <p className='text-slate-500'>
                  No reviews match your current filters.
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className='border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors'
                >
                  <div className='flex items-start justify-between mb-3'>
                    <div className='flex items-center space-x-3'>
                      <Checkbox
                        checked={selectedReviews.includes(review.id)}
                        onCheckedChange={() => handleSelectReview(review.id)}
                      />
                      <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                        <User className='h-5 w-5 text-blue-600' />
                      </div>
                      <div>
                        <p className='font-medium'>
                          {review.user?.firstName} {review.user?.lastName}
                        </p>
                        <div className='flex items-center space-x-2'>
                          <div className='flex items-center'>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className='text-sm text-slate-500'>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                          {review.verified && (
                            <Badge
                              variant='secondary'
                              className='text-xs bg-green-100 text-green-800'
                            >
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Badge
                        className={
                          review.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : review.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : review.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {review.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='sm'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() =>
                              handleModerateReview(
                                review.id,
                                EReviewStatus.approved,
                              )
                            }
                          >
                            <CheckCircle2 className='h-4 w-4 mr-2' />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleModerateReview(
                                review.id,
                                EReviewStatus.rejected,
                              )
                            }
                          >
                            <XCircle className='h-4 w-4 mr-2' />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleModerateReview(
                                review.id,
                                EReviewStatus.hidden,
                              )
                            }
                          >
                            <Flag className='h-4 w-4 mr-2' />
                            Hide
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className='space-y-3'>
                    {review.title && (
                      <h4 className='font-medium'>{review.title}</h4>
                    )}
                    {review.comment && (
                      <p className='text-slate-600'>{review.comment}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className='flex items-center justify-between pt-4 border-t'>
            <p className='text-sm text-slate-600'>
              Showing {reviews.length} of {reviewAnalytics?.totalReviews || 0}{' '}
              reviews
            </p>
            <div className='flex items-center gap-2'>
              <Button variant='outline' size='sm' disabled>
                Previous
              </Button>
              <Button variant='outline' size='sm'>
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

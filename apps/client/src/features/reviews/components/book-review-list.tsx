'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { cn } from '@/lib/utils';
import {
  EReviewReportReason,
  TBookReviewBasic,
  TUpdateBookReview,
} from '@repo/common';
import { Flag, MoreHorizontal, Star, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import {
  deleteBookReview,
  markBookReviewHelpful,
  reportBookReview,
  updateBookReview,
} from '../actions/review.action';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from '@/components/ui/dialog';
import { BookReviewForm } from './book-review-form';

interface BookReviewListProps {
  reviews: TBookReviewBasic[];
  currentUserId?: string | null;
  isLoading?: boolean;
  bookId: string;
}

export function BookReviewList({
  reviews,
  currentUserId,
  bookId,
  isLoading = false,
}: BookReviewListProps) {
  const [helpfulVotes, setHelpfulVotes] = useState<Set<string>>(new Set());
  const [editReview, setEditReview] = useState<TBookReviewBasic | null>(
    null,
  );

  // Handle marking review as helpful
  const { mutate: markHelpfulMutation, isLoading: isMarkingHelpful } =
    useApiMutation();
  const { mutate: reportReviewMutation, isLoading: isReportingReview } =
    useApiMutation();
  const { mutate: deleteReviewMutation, isLoading: isDeletingReview } =
    useApiMutation();
  const { mutate: editReviewMutation, isLoading: isEditingReview } =
    useApiMutation();

  const handleMarkHelpful = async (reviewId: string) => {
    await markHelpfulMutation(
      () =>
        markBookReviewHelpful({
          reviewId,
          helpful: true,
        }),
      {
        successMessage: 'Marked as helpful',
        errorMessage: 'Failed to mark as helpful',
      },
    );
  };
  // Handle reporting a review
  const handleDeleteReview = async (reviewId: string) => {
    await deleteReviewMutation(() => deleteBookReview(reviewId), {
      successMessage: 'Review deleted',
      errorMessage: 'Failed to delete review',
    });
  };

  const handleReportReview = async (reviewId: string) => {
    await reportReviewMutation(
      () =>
        reportBookReview({
          reviewId,
          reason: EReviewReportReason.inappropriate,
          description: 'This review contains inappropriate content',
        }),
      {
        successMessage: 'Review reported',
        errorMessage: 'Failed to report review',
      },
    );
  };

  const handleEditReview = async (
    reviewId: string,
    data: TUpdateBookReview,
  ) => {
    await editReviewMutation(
      () =>
        updateBookReview(reviewId, {
          title: data.title,
          comment: data.comment,
          rating: data.rating,
          images: [],
        }),
      {
        successMessage: 'Review edited',
        errorMessage: 'Failed to edit review',
      },
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'md') => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

    return (
      <div className='flex items-center space-x-1'>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300',
            )}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className='animate-pulse'>
            <CardContent className='p-6'>
              <div className='space-y-3'>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-gray-200 rounded-full'></div>
                  <div className='space-y-2'>
                    <div className='h-4 bg-gray-200 rounded w-32'></div>
                    <div className='h-3 bg-gray-200 rounded w-24'></div>
                  </div>
                </div>
                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                <div className='h-4 bg-gray-200 rounded w-1/2'></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className='p-8 text-center'>
          <p className='text-gray-500'>
            No reviews yet. Be the first to review this book!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-4'>
      {reviews.map((review) => (
        <Card key={review.id} className='hover:shadow-md transition-shadow'>
          <CardContent className='p-6'>
            <div className='space-y-4'>
              {/* Header */}
              <div className='flex items-start justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center'>
                    {review.user.image ? (
                      <img
                        src={review.user.image}
                        alt={`${review.user.firstName} ${review.user.lastName}`}
                        className='w-10 h-10 rounded-full object-cover'
                      />
                    ) : (
                      <span className='text-sm font-medium text-gray-600'>
                        {review.user.firstName[0]}
                        {review.user.lastName?.[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className='flex items-center space-x-2'>
                      <p className='font-medium'>
                        {review.user.firstName} {review.user.lastName}
                      </p>
                      {review.verified && (
                        <Badge variant='secondary' className='text-xs'>
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <div className='flex items-center space-x-2 text-sm text-gray-500'>
                      {renderStars(review.rating, 'sm')}
                      <span>•</span>
                      <span>{formatDate(review.createdAt.toString())}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='sm'>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    {currentUserId === review.user.id && (
                      <>
                        <DropdownMenuItem onClick={() => setEditReview(review)}>
                          Edit Review
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteReview(review.id)}
                          className='text-red-600'
                        >
                          Delete Review
                        </DropdownMenuItem>
                      </>
                    )}
                    {currentUserId !== review.user.id && (
                      <DropdownMenuItem
                        onClick={() => handleReportReview(review.id)}
                      >
                        <Flag className='h-4 w-4 mr-2' />
                        Report
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Title */}
              {review.title && (
                <h4 className='font-medium text-lg'>{review.title}</h4>
              )}

              {/* Comment */}
              {review.comment && (
                <p className='text-gray-700 whitespace-pre-wrap'>
                  {review.comment}
                </p>
              )}

              {/* Images */}
              {review.images && review.images.length > 0 && (
                <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className='w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity'
                      onClick={() => window.open(image, '_blank')}
                    />
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className='flex items-center justify-between pt-2 border-t'>
                <div className='flex items-center space-x-4'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleMarkHelpful(review.id)}
                    className={cn(
                      'flex items-center space-x-1',
                      helpfulVotes.has(review.id) && 'text-blue-600',
                    )}
                  >
                    <ThumbsUp className='h-4 w-4' />
                    <span>Helpful ({review.helpful})</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {editReview && (
        <Dialog open={!!editReview} onOpenChange={() => setEditReview(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Review</DialogTitle>
              <DialogDescription>
                Edit the review for {editReview.title}
              </DialogDescription>
            </DialogHeader>
            <BookReviewForm
              review={editReview}
              bookId={bookId}
              onSubmit={(data) => setEditReview(null)}
              onCancel={() => setEditReview(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

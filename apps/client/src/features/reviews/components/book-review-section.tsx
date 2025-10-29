'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TBookReviewBasic, TReviewAnalytics } from '@repo/common';
import { useState } from 'react';
import { BookReviewForm } from './book-review-form';
import { BookReviewList } from './book-review-list';
import { BookReviewStats } from './book-review-stats';

interface BookReviewSectionProps {
  bookId: string;
  userId?: string | null;
  reviews: TBookReviewBasic[];
  analytics: TReviewAnalytics | null;
}

export function BookReviewSection({
  bookId,
  userId,
  reviews,
  analytics,
}: BookReviewSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  return (
    <div className='space-y-6'>
      {/* Review Stats */}
      {analytics && <BookReviewStats stats={analytics} />}

      {/* Review Form */}
      {userId && (
        <Card>
          <CardContent className='p-6'>
            <div className='text-center'>
              <h3 className='text-lg font-semibold mb-2'>
                Share Your Experience
              </h3>
              <p className='text-gray-600 mb-4'>
                Help other customers by writing a review
              </p>
              <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                <DialogTrigger asChild>
                  <Button onClick={() => setShowReviewForm(true)}>
                    Write a Review
                  </Button>
                </DialogTrigger>
                <DialogContent className='max-w-2xl'>
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                      Help other customers by writing a review
                    </DialogDescription>
                  </DialogHeader>
                  <BookReviewForm
                    bookId={bookId}
                    onSubmit={() => setShowReviewForm(false)}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Tabs defaultValue='all' className='w-full'>
        <TabsList className='flex w-full'>
          <TabsTrigger value='all' className='flex-1'>
            All Reviews
          </TabsTrigger>
          <TabsTrigger value='5' className='flex-1'>
            5 Stars
          </TabsTrigger>
          <TabsTrigger value='4' className='flex-1'>
            4 Stars
          </TabsTrigger>
          <TabsTrigger value='3' className='flex-1'>
            3 Stars
          </TabsTrigger>
        </TabsList>

        <TabsContent value='all' className='mt-6'>
          <BookReviewList
            reviews={reviews}
            currentUserId={userId}
            bookId={bookId}
          />
        </TabsContent>

        <TabsContent value='5' className='mt-6'>
          <BookReviewList
            reviews={reviews.filter((review) => review.rating === 5)}
            currentUserId={userId}
            bookId={bookId}
          />
        </TabsContent>

        <TabsContent value='4' className='mt-6'>
          <BookReviewList
            reviews={reviews.filter((review) => review.rating === 4)}
            currentUserId={userId}
            bookId={bookId}
          />
        </TabsContent>

        <TabsContent value='3' className='mt-6'>
          <BookReviewList
            reviews={reviews.filter((review) => review.rating === 3)}
            currentUserId={userId}
            bookId={bookId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TCreateBookReview,
  TUpdateBookReview,
  TBookReview,
  ZCreateBookReview,
  ZUpdateBookReview,
  TBookReviewBasic,
} from '@repo/common';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  createBookReview,
  updateBookReview,
} from '../actions/review.action';
import RatingInput from '@/components/rating-input';

type BookReviewFormMode = 'create' | 'edit';

interface BookReviewFormProps {
  bookId: string;
  onSubmit: (data: TBookReview) => void;
  onCancel: () => void;
  review?: TBookReviewBasic | null;
}

export function BookReviewForm({
  bookId,
  onSubmit,
  onCancel,
  review,
}: BookReviewFormProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const { mutate: createReview, isLoading: isCreatingReview } =
    useApiMutation();
  const { mutate: editReview, isLoading: isEditingReview } = useApiMutation();

  // Choose schema and default values based on mode
  const schema = review ? ZUpdateBookReview : ZCreateBookReview;
  const defaultValues: TCreateBookReview | TUpdateBookReview = review
    ? {
        ...review,
        bookId: bookId,
        orderId: review.orderId || undefined,
        images: review.images || [],
        title: review.title || undefined,
        comment: review.comment || undefined,
      }
    : {
        bookId,
        rating: 0,
        title: '',
        comment: '',
        images: [],
        orderId: undefined,
      };

  const form = useForm<TCreateBookReview | TUpdateBookReview>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  // Sync imageFiles state with form images value (for edit mode)
  useEffect(() => {
    if (review && review.images) {
      setImageFiles(review.images);
    }
  }, [review]);

  // Handle image upload and convert to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImageFiles((prev) => [...prev, event.target!.result as string]);
            // Update form value
            form.setValue('images', [
              ...(form.getValues('images') || []),
              event.target!.result as string,
            ]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
    // Reset input value so same file can be uploaded again if needed
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    const newImages = (form.getValues('images') || []).filter(
      (_, i) => i !== index,
    );
    form.setValue('images', newImages);
  };

  const handleFormSubmit = (
    values: TCreateBookReview | TUpdateBookReview,
  ) => {
    if (review && review.id) {
      editReview(
        () => updateBookReview(review.id, values as TUpdateBookReview),
        {
          successMessage: 'Review updated successfully',
          errorMessage: 'Failed to update review',
          onSuccess: (data) => {
            onSubmit(data);
          },
        },
      );
    } else {
      createReview(() => createBookReview(values as TCreateBookReview), {
        successMessage: 'Review created successfully',
        errorMessage: 'Failed to create review',
        onSuccess: (data) => {
          onSubmit(data);
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className='space-y-6'
      >
        {/* Rating */}
        <FormField
          control={form.control}
          name='rating'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating *</FormLabel>
              <RatingInput
                onChange={field.onChange}
                setHoveredRating={setHoveredRating}
                hoveredRating={hoveredRating}
                value={field.value || 0}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title */}
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title (Optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id='title'
                  placeholder='Summarize your experience'
                  maxLength={255}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Comment */}
        <FormField
          control={form.control}
          name='comment'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id='comment'
                  placeholder='Share your thoughts about this book...'
                  rows={4}
                  maxLength={2000}
                />
              </FormControl>
              <div className='text-sm text-gray-500 text-right'>
                {form.watch('comment')?.length || 0}/2000 characters
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Images */}
        <FormField
          control={form.control}
          name='images'
          render={() => (
            <FormItem>
              <FormLabel>Photos (Optional)</FormLabel>
              <>
                <Input
                  id='images'
                  type='file'
                  accept='image/*'
                  multiple
                  onChange={handleImageUpload}
                  className='cursor-pointer'
                />
                {imageFiles.length > 0 && (
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-2 mt-2'>
                    {imageFiles.map((image, index) => (
                      <div key={index} className='relative'>
                        <img
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className='w-full h-24 object-cover rounded-md'
                        />
                        <button
                          type='button'
                          onClick={() => removeImage(index)}
                          className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600'
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className='flex justify-end space-x-3'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isEditingReview || isCreatingReview}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={
              form.watch('rating') === 0 ||
              isEditingReview ||
              isCreatingReview ||
              form.formState.isSubmitting
            }
          >
            {isCreatingReview || isEditingReview || form.formState.isSubmitting
              ? review
                ? 'Saving...'
                : 'Submitting...'
              : review
                ? 'Save Changes'
                : 'Submit Review'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StoreReviewFormProps {
  storeId: string;
  onSubmit: (data: {
    rating: number;
    title?: string;
    comment?: string;
    images?: string[];
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function StoreReviewForm({
  storeId,
  onSubmit,
  onCancel,
  isLoading = false,
}: StoreReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      return;
    }
    onSubmit({
      rating,
      title: title.trim() || undefined,
      comment: comment.trim() || undefined,
      images: images.length > 0 ? images : undefined,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: string[] = [];

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            setImages((prev) => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle>Write a Store Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Rating */}
          <div className='space-y-2'>
            <Label htmlFor='rating'>Rating *</Label>
            <div className='flex items-center space-x-1'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type='button'
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className='p-1'
                >
                  <Star
                    className={cn(
                      'h-6 w-6 transition-colors',
                      hoveredRating >= star || rating >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300',
                    )}
                  />
                </button>
              ))}
              <span className='ml-2 text-sm text-gray-600'>
                {rating > 0 && `${rating} star${rating !== 1 ? 's' : ''}`}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className='space-y-2'>
            <Label htmlFor='title'>Title (Optional)</Label>
            <Input
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Summarize your experience with this store'
              maxLength={255}
            />
          </div>

          {/* Comment */}
          <div className='space-y-2'>
            <Label htmlFor='comment'>Review</Label>
            <Textarea
              id='comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Share your thoughts about this store, customer service, shipping, etc...'
              rows={4}
              maxLength={2000}
            />
            <div className='text-sm text-gray-500 text-right'>
              {comment.length}/2000 characters
            </div>
          </div>

          {/* Images */}
          <div className='space-y-2'>
            <Label htmlFor='images'>Photos (Optional)</Label>
            <Input
              id='images'
              type='file'
              accept='image/*'
              multiple
              onChange={handleImageUpload}
              className='cursor-pointer'
            />
            {images.length > 0 && (
              <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                {images.map((image, index) => (
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
          </div>

          {/* Actions */}
          <div className='flex justify-end space-x-3'>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={rating === 0 || isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

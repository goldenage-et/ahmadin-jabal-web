import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type RatingInputProps = {
  onChange: (rating: number) => void;
  setHoveredRating: (rating: number) => void;
  hoveredRating: number;
  value: number;
};
export default function RatingInput({
  onChange,
  setHoveredRating,
  hoveredRating,
  value,
}: RatingInputProps) {
  return (
    <div className='flex items-center space-x-1'>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type='button'
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          className='p-1'
        >
          <Star
            className={cn(
              'h-6 w-6 transition-colors',
              hoveredRating >= star || Number(value || '0') >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300',
            )}
          />
        </button>
      ))}
      <span className='ml-2 text-sm text-gray-600'>
        {value && Number(value) > 0 && `${value} star${value !== 1 ? 's' : ''}`}
      </span>
    </div>
  );
}

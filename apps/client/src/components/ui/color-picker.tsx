'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, Palette } from 'lucide-react';
import { useState } from 'react';

// Predefined color palette
const COLOR_PALETTE = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E9',
  '#F8C471',
  '#82E0AA',
  '#F1948A',
  '#85C1E9',
  '#D7BDE2',
  '#A9DFBF',
  '#F9E79F',
  '#D5DBDB',
  '#AED6F1',
  '#A3E4D7',
  '#FADBD8',
  '#D1F2EB',
  '#FCF3CF',
  '#E8DAEF',
  '#D5DBDB',
  '#A9DFBF',
  '#F9E79F',
  '#D5DBDB',
  '#AED6F1',
  '#A3E4D7',
  '#FADBD8',
  '#D1F2EB',
  '#FCF3CF',
  '#E8DAEF',
  '#D5DBDB',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FF00FF',
  '#00FFFF',
  '#FFA500',
  '#800080',
  '#008000',
  '#000080',
  '#800000',
  '#808000',
  '#008080',
  '#C0C0C0',
  '#808080',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FFB6C1',
  '#FFA07A',
  '#FF7F50',
  '#FF6347',
  '#FF4500',
  '#FF8C00',
  '#FFA500',
  '#FFD700',
  '#FFFF00',
  '#ADFF2F',
  '#7FFF00',
  '#00FF00',
  '#00FF7F',
  '#00FFFF',
  '#00CED1',
  '#1E90FF',
  '#0000FF',
  '#8A2BE2',
  '#9400D3',
  '#FF1493',
  '#FF69B4',
  '#FFB6C1',
];

interface ColorPickerProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ColorPicker({
  value,
  onValueChange,
  placeholder = 'Select a color...',
  className,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          <div className='flex items-center gap-2'>
            {value ? (
              <>
                <div
                  className='w-4 h-4 rounded border border-gray-300'
                  style={{ backgroundColor: value }}
                />
                <span className='text-sm font-mono'>{value.toUpperCase()}</span>
              </>
            ) : (
              <span className='text-muted-foreground'>{placeholder}</span>
            )}
          </div>
          <Palette className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80 p-4' align='start'>
        <div className='space-y-4'>
          <div className='text-sm font-medium'>Choose a color</div>

          {/* Color Grid */}
          <div className='grid grid-cols-10 gap-2'>
            {COLOR_PALETTE.map((color) => (
              <button
                key={color}
                className={cn(
                  'w-8 h-8 rounded border-2 transition-all hover:scale-110',
                  value === color
                    ? 'border-gray-900 ring-2 ring-gray-300'
                    : 'border-gray-200',
                )}
                style={{ backgroundColor: color }}
                onClick={() => {
                  onValueChange(color);
                  setOpen(false);
                }}
                title={color}
              >
                {value === color && (
                  <Check className='w-4 h-4 text-white drop-shadow-sm' />
                )}
              </button>
            ))}
          </div>

          {/* Custom Color Input */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Custom Color</label>
            <div className='flex gap-2'>
              <input
                type='color'
                value={value || '#000000'}
                onChange={(e) => onValueChange(e.target.value)}
                className='w-12 h-8 rounded border border-gray-300 cursor-pointer'
              />
              <input
                type='text'
                value={value || ''}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder='#000000'
                className='flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md font-mono'
              />
            </div>
          </div>

          {/* Clear Button */}
          {value && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                onValueChange('');
                setOpen(false);
              }}
              className='w-full'
            >
              Clear Color
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

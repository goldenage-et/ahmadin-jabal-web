'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateImageFile, getImageUrl } from '@/lib/file-upload';

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onUpload?: (file: File) => Promise<string>;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function FileUpload({
  value,
  onChange,
  onUpload,
  disabled = false,
  className,
  placeholder = 'Upload an image...',
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);

      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return;
      }

      if (!onUpload) {
        // If no upload function provided, just use the file name as URL
        onChange(file.name);
        return;
      }

      try {
        setIsUploading(true);
        const url = await onUpload(file);
        onChange(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload, onChange],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const imageUrl = value ? getImageUrl(value) : null;

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer',
          'hover:border-primary/50 focus:border-primary',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-destructive',
          imageUrl && 'border-solid',
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          className='hidden'
          disabled={disabled}
        />

        {imageUrl ? (
          <div className='space-y-2'>
            <div className='relative'>
              <img
                src={imageUrl}
                alt='Preview'
                className='w-full h-32 object-cover rounded-md'
                onError={() => setError('Failed to load image')}
              />
              {!disabled && (
                <Button
                  type='button'
                  variant='destructive'
                  size='sm'
                  className='absolute top-2 right-2 h-6 w-6 p-0'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                >
                  <X className='h-3 w-3' />
                </Button>
              )}
            </div>
            <p className='text-sm text-muted-foreground text-center'>
              Click to change image
            </p>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-8'>
            {isUploading ? (
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
            ) : (
              <Upload className='h-8 w-8 text-muted-foreground mb-2' />
            )}
            <p className='text-sm text-muted-foreground text-center'>
              {isUploading ? 'Uploading...' : placeholder}
            </p>
            <p className='text-xs text-muted-foreground text-center mt-1'>
              Drag and drop or click to select
            </p>
          </div>
        )}
      </div>

      {error && <p className='text-sm text-destructive'>{error}</p>}
    </div>
  );
}

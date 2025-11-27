'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { TBookImage } from '@repo/common';
import {
  CheckCircle,
  Copy,
  Download,
  Edit,
  Eye,
  Image as ImageIcon,
  Star,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import MediaManager from '@/components/media-manager';

interface ImageManagerProps {
  images: TBookImage[];
  onImagesChange: (images: TBookImage[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
  className?: string;
  isEditing?: boolean;
}

export default function ImageManager({
  images,
  onImagesChange,
  className,
  isEditing,
}: ImageManagerProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<TBookImage | null>(null);

  const removeImage = (imageId: string) => {
    onImagesChange(images.filter((img) => img.id !== imageId));
    setSelectedImages(selectedImages.filter((id) => id !== imageId));
  };

  const setMainImage = (imageId: string) => {
    onImagesChange(
      images.map((img) => ({
        ...img,
        isMain: img.id === imageId,
      })),
    );
  };

  const updateImageAlt = (imageId: string, alt: string) => {
    onImagesChange(
      images.map((img) => (img.id === imageId ? { ...img, alt } : img)),
    );
  };

  const handleSelectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map((img) => img.id));
    }
  };

  const bulkDelete = () => {
    onImagesChange(images.filter((img) => !selectedImages.includes(img.id)));
    setSelectedImages([]);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {isEditing && (
        <MediaManager
          onUploaded={(newImages) => {
            const filteredImages = [...images, ...newImages].filter(
              (img, idx, arr) => arr.findIndex((i) => i.id === img.id) === idx,
            );
            onImagesChange(filteredImages);
          }}
        />
      )}
      {/* Bulk Actions */}
      {isEditing && selectedImages.length > 0 && (
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <p className='text-sm text-muted-foreground'>
                {selectedImages.length} image(s) selected
              </p>
              <div className='flex gap-2'>
                <Button variant='outline' size='sm'>
                  <Download className='h-4 w-4 mr-2' />
                  Download
                </Button>
                <Button variant='outline' size='sm'>
                  <Copy className='h-4 w-4 mr-2' />
                  Duplicate
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='text-red-600'
                  onClick={bulkDelete}
                >
                  <Trash2 className='h-4 w-4 mr-2' />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center gap-2'>
                <ImageIcon className='h-5 w-5' />
                Book Images ({images.length})
              </CardTitle>
              {isEditing && (
                <div className='flex items-center gap-2'>
                  <Button variant='outline' size='sm' onClick={handleSelectAll}>
                    {selectedImages.length === images.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
              {images.map((image, index) => (
                <div
                  key={image.id + index}
                  className={cn(
                    'relative group border-2 rounded-lg overflow-hidden transition-all duration-200',
                    image.isMain
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300',
                    selectedImages.includes(image.id) &&
                    'border-blue-500 ring-2 ring-blue-200',
                  )}
                >
                  {/* Image */}
                  <div className='aspect-square bg-gray-100 relative'>
                    <Image
                      src={image.url}
                      alt={image.alt || image.url}
                      width={1000}
                      height={1000}
                      className='w-full object-cover aspect-square'
                    />
                    {/* Main Image Badge */}
                    {image.isMain && (
                      <div className='absolute top-2 left-2'>
                        <div className='bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1'>
                          <Star className='h-3 w-3' />
                          Main
                        </div>
                      </div>
                    )}

                    {/* Selection Checkbox */}
                    {isEditing && (
                      <div className='absolute top-2 right-2'>
                        <div
                          className={cn(
                            'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                            selectedImages.includes(image.id)
                              ? 'bg-blue-600 border-blue-600'
                              : 'bg-white/90 border-white/90 group-hover:bg-white',
                          )}
                        >
                          {selectedImages.includes(image.id) && (
                            <CheckCircle className='h-3 w-3 text-white' />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Hover Actions */}
                    {isEditing && (
                      <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                        <Button
                          size='sm'
                          variant='secondary'
                          onClick={() => setPreviewImage(image)}
                        >
                          <Eye className='h-3 w-3' />
                        </Button>
                        <Button
                          size='sm'
                          variant='secondary'
                          onClick={() => setMainImage(image.id)}
                          disabled={image.isMain}
                        >
                          <Star className='h-3 w-3' />
                        </Button>
                        <Button
                          size='sm'
                          variant='secondary'
                          onClick={() => removeImage(image.id)}
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Image Info */}
                  <div className='p-2 space-y-1'>
                    {image.alt && (
                      <div
                        className='text-xs text-gray-600 truncate'
                        title={image.alt}
                      >
                        Alt: {image.alt}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className='max-w-4xl'>
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
            <DialogDescription>{previewImage?.url}</DialogDescription>
          </DialogHeader>
          {previewImage && (
            <div className='space-y-4'>
              <div className='relative'>
                <Image
                  src={previewImage.url}
                  alt={previewImage.alt || previewImage.url}
                  width={1000}
                  height={1000}
                  className='w-full h-96 object-contain bg-gray-100 rounded-lg'
                />
              </div>
              <div className='space-y-3'>
                <div>
                  <Label htmlFor='alt-text'>Alt Text</Label>
                  <Input
                    id='alt-text'
                    value={previewImage.alt || ''}
                    onChange={(e) =>
                      updateImageAlt(previewImage.id, e.target.value)
                    }
                    placeholder='Describe this image for accessibility'
                  />
                </div>
                <div className='flex gap-2'>
                  {isEditing && (
                    <Button
                      onClick={() => setMainImage(previewImage.id)}
                      disabled={previewImage.isMain}
                      variant='outline'
                    >
                      <Star className='h-4 w-4 mr-2' />
                      Set as Main
                    </Button>
                  )}
                  <Button variant='outline'>
                    <Download className='h-4 w-4 mr-2' />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

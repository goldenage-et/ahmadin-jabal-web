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
import { TCategoryImage } from '@repo/common';
import {
  AlertCircle,
  CheckCircle,
  Download,
  Edit,
  Eye,
  Image as ImageIcon,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { v4 as generateId } from 'uuid';
import useCategoryUploader, {
  CategoryUploadedFile,
} from '@/hooks/use-category-uploader';
import { EFileType } from '@repo/common';
import { getImageUrl } from '@/lib/file-upload';

interface CategoryImageManagerProps {
  image: TCategoryImage | null;
  onImageChange: (image: TCategoryImage | null) => void;
  className?: string;
  isEditing?: boolean;
}

export default function CategoryImageManager({
  image,
  onImageChange,
  className,
  isEditing = true,
}: CategoryImageManagerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<TCategoryImage | null>(null);
  const [altText, setAltText] = useState(image?.alt || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { file, uploadCategoryImage, abortUpload, removeFile, setFileData } =
    useCategoryUploader();

  const accept = 'image/*';

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      handleFile(selectedFile);
    }
  };

  // Handle file selection from input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      handleFile(selectedFile);
    }
  };

  // Process file
  const handleFile = (selectedFile: File) => {
    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const newFile: CategoryUploadedFile = {
      id: generateId(),
      originalname: selectedFile.name,
      filename: selectedFile.name,
      size: selectedFile.size,
      file: selectedFile,
      progress: 0,
      status: 'idle',
      url: URL.createObjectURL(selectedFile),
      type: EFileType.image,
    };

    setFileData(newFile);
  };

  const uploadFile = async () => {
    if (!file || file.status === 'success') {
      return;
    }

    await uploadCategoryImage(file);
  };

  // Auto-upload when file is selected
  useEffect(() => {
    if (file && file.status === 'idle') {
      uploadFile();
    }
  }, [file]);

  // Handle successful upload
  const handleUploadSuccess = () => {
    if (file && file.status === 'success' && file.path) {
      const newImage: TCategoryImage = {
        id: file.id,
        url: file.path, // This is just the filename, getImageUrl will construct the full URL
        alt: altText,
      };
      onImageChange(newImage);
    }
  };

  // Update alt text
  const updateAltText = (newAlt: string) => {
    setAltText(newAlt);
    if (image) {
      onImageChange({
        ...image,
        alt: newAlt,
      });
    }
  };

  // Remove current image
  const removeCurrentImage = () => {
    onImageChange(null);
    setAltText('');
  };

  // Remove uploaded file
  const removeUploadedFile = () => {
    removeFile();
  };

  // Handle upload completion
  if (file && file.status === 'success' && !image) {
    handleUploadSuccess();
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      {!image && (
        <div
          className={`border-2 py-8 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className='flex flex-col items-center justify-center gap-4'>
            <div className='bg-primary/10 p-4 rounded-full'>
              <Upload className='size-8 text-primary' />
            </div>
            <div>
              <h3 className='text-lg font-semibold text-primary'>
                Upload Category Image
              </h3>
              <p className='text-sm text-muted-foreground'>
                Click to select or drag and drop • Auto-uploads
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                Supports {accept} • Max 5MB
              </p>
            </div>
            <input
              id='category-image-upload'
              type='file'
              ref={fileInputRef}
              onChange={handleFileSelect}
              className='hidden'
              accept={accept}
            />
          </div>
        </div>
      )}

      {/* File Upload Progress */}
      {file && !image && (
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded overflow-hidden bg-gray-100'>
                {file.url && (
                  <Image
                    src={file.url}
                    alt={file.originalname}
                    width={48}
                    height={48}
                    className='w-full h-full object-cover'
                  />
                )}
              </div>

              <div className='grow min-w-0'>
                <p className='font-medium truncate'>{file.originalname}</p>
                <p className='text-xs text-muted-foreground'>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              {file.status === 'uploading' && (
                <div className='flex items-center gap-2'>
                  <div className='text-xs'>{file.progress}%</div>
                  <progress
                    value={file.progress}
                    max={100}
                    className='w-20 bg-accent/60 h-2 rounded'
                  />
                  <Button size='sm' variant='outline' onClick={abortUpload}>
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              )}

              {file.status === 'success' && (
                <CheckCircle className='w-5 h-5 text-green-500' />
              )}

              {file.status === 'error' && (
                <div className='flex items-center gap-2'>
                  <AlertCircle className='w-5 h-5 text-red-500' />
                  <span className='text-xs text-red-500'>{file.error}</span>
                </div>
              )}

              <Button size='sm' variant='outline' onClick={removeUploadedFile}>
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Image Display */}
      {image && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ImageIcon className='h-5 w-5' />
              Category Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='relative group border-2 rounded-lg overflow-hidden'>
                <div className='aspect-video bg-gray-100 relative'>
                  <Image
                    src={getImageUrl(image.url)}
                    alt={image.alt || 'Category image'}
                    width={400}
                    height={225}
                    className='w-full h-full object-cover'
                  />

                  {/* Hover Actions */}
                  {isEditing && (
                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                      <Button
                        size='sm'
                        variant='secondary'
                        onClick={() => setPreviewImage(image)}
                      >
                        <Eye className='h-4 w-4' />
                      </Button>
                      <Button
                        size='sm'
                        variant='secondary'
                        onClick={removeCurrentImage}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Alt Text Input */}
              {isEditing && (
                <div className='space-y-2'>
                  <Label htmlFor='alt-text'>Alt Text</Label>
                  <Input
                    id='alt-text'
                    value={altText}
                    onChange={(e) => updateAltText(e.target.value)}
                    placeholder='Describe this image for accessibility'
                  />
                </div>
              )}
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
                  src={getImageUrl(previewImage.url)}
                  alt={previewImage.alt || previewImage.url}
                  width={800}
                  height={600}
                  className='w-full h-96 object-contain bg-gray-100 rounded-lg'
                />
              </div>
              <div className='space-y-3'>
                <div>
                  <Label htmlFor='preview-alt-text'>Alt Text</Label>
                  <Input
                    id='preview-alt-text'
                    value={previewImage.alt || ''}
                    onChange={(e) => updateAltText(e.target.value)}
                    placeholder='Describe this image for accessibility'
                  />
                </div>
                <div className='flex gap-2'>
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

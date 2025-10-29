'use client';

import { Button } from '@/components/ui/button';
import { server_host } from '@/config/host.config.mjs';
import useUploader, { UploadedFile } from '@/hooks/use-uploader';
import { EFileType } from '@repo/common';
import { AlertCircle, CheckCircle, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as generateId } from 'uuid';
import { formatFileSize, getFileIcon, getFileType } from './utils';
import { getImageUrl } from '@/lib/file-upload';

interface SingleFileUploaderProps {
  storeId: string;
  onUploaded: (file: UploadedFile & { url: string }) => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
  placeholder?: string;
  description?: string;
  existingImage?: any; // For edit mode - existing image data
}

export default function SingleFileUploader({
  storeId,
  onUploaded,
  accept = 'image/*',
  maxSize,
  className = '',
  placeholder = 'Click to Upload / Drag & Drop',
  description = 'Supports images',
  existingImage,
}: SingleFileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hasExistingImage, setHasExistingImage] = useState(!!existingImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { files, setFiles, abortUpload, removeFile, uploadSingleFile } =
    useUploader();

  // Only keep the latest file
  const currentFile = files[files.length - 1];

  // Update existing image state when prop changes
  useEffect(() => {
    setHasExistingImage(!!existingImage);
  }, [existingImage]);

  useEffect(() => {
    if (currentFile?.status === 'success') {
      onUploaded({ ...currentFile, url: `${server_host}${currentFile.path}` });
    }
  }, [currentFile, onUploaded]);

  // Process single file
  const handleFile = useCallback((file: File) => {
    // Check file size
    if (maxSize && file.size > maxSize) {
      alert(`File size must be less than ${formatFileSize(maxSize)}`);
      return;
    }

    const fileType = getFileType(file);
    const newFile: UploadedFile = {
      id: generateId(),
      originalname: file.name,
      storeId: storeId,
      filename: file.name,
      size: file.size,
      file,
      progress: 0,
      status: 'idle' as const,
      url: fileType === EFileType.image ? URL.createObjectURL(file) : null,
      type: fileType,
    };

    // Replace all files with just this one
    setFiles([newFile]);
  }, [maxSize, storeId, setFiles]);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  }, [handleFile]);

  // Handle file selection from input
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  }, [handleFile]);

  const uploadFile = async () => {
    if (!currentFile || currentFile.status === 'success') {
      return;
    }

    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === currentFile.id
          ? {
              ...file,
              status: 'uploading',
              progress: 0,
            }
          : file,
      ),
    );

    await uploadSingleFile(storeId, currentFile);
  };

  const removeCurrentFile = () => {
    if (currentFile) {
      removeFile(currentFile.id);
    }
  };

  const removeExistingImage = () => {
    setHasExistingImage(false);
    onUploaded(null as any); // Clear the image
  };

  const abortCurrentUpload = () => {
    if (currentFile) {
      abortUpload(currentFile.id);
    }
  };

  const getStatusIcon = () => {
    if (!currentFile) return null;

    switch (currentFile.status) {
      case 'success':
        return <CheckCircle className='w-6 h-6 text-green-500' />;
      case 'error':
        return <AlertCircle className='w-6 h-6 text-red-500' />;
      case 'uploading':
        return (
          <button
            onClick={abortCurrentUpload}
            className='w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors'
            title='Abort upload'
          >
            <X className='w-4 h-4' />
          </button>
        );
      default:
        return null;
    }
  };

  const getProgressPercentage = () => {
    return currentFile?.progress || 0;
  };

  return (
    <div className={`space-y-4 w-full ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors relative overflow-hidden
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          ${currentFile ? 'min-h-[120px]' : 'min-h-[100px]'}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => {
          if (!currentFile) {
            fileInputRef.current?.click();
          }
        }}
      >
        {/* Circular Progress Overlay */}
        {currentFile?.status === 'uploading' && (
          <div className='absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
            <div className='relative w-16 h-16'>
              <svg
                className='w-16 h-16 transform -rotate-90'
                viewBox='0 0 36 36'
              >
                <path
                  className='text-gray-200'
                  stroke='currentColor'
                  strokeWidth='3'
                  fill='none'
                  d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                />
                <path
                  className='text-primary'
                  stroke='currentColor'
                  strokeWidth='3'
                  fill='none'
                  strokeDasharray={`${getProgressPercentage()}, 100`}
                  d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                />
              </svg>
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-sm font-medium text-primary'>
                  {getProgressPercentage()}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Existing Image Preview */}
        {hasExistingImage && !currentFile && existingImage && (
          <div className='flex flex-col items-center space-y-3'>
            <div className='w-16 h-16 rounded-lg overflow-hidden border'>
              <Image
                src={getImageUrl(
                  existingImage.url || existingImage.path || existingImage,
                )}
                alt='Existing category image'
                width={64}
                height={64}
                className='w-full h-full object-cover'
              />
            </div>

            <div className='text-center'>
              <p className='font-medium text-sm text-muted-foreground'>
                Current Image
              </p>
            </div>

            <div className='flex items-center space-x-2'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => fileInputRef.current?.click()}
                className='h-8 px-3'
              >
                <Upload className='w-4 h-4 mr-1' />
                Replace
              </Button>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={removeExistingImage}
                className='h-8 px-3'
              >
                <Trash2 className='w-4 h-4 mr-1' />
                Remove
              </Button>
            </div>
          </div>
        )}

        {/* File Preview */}
        {currentFile && currentFile.status !== 'uploading' && (
          <div className='flex flex-col items-center space-y-3'>
            {currentFile.type === EFileType.image && currentFile.url ? (
              <div className='w-16 h-16 rounded-lg overflow-hidden border'>
                <Image
                  src={currentFile.url}
                  alt={currentFile.originalname}
                  width={64}
                  height={64}
                  className='w-full h-full object-cover'
                />
              </div>
            ) : (
              <div className='w-16 h-16 flex items-center justify-center bg-muted rounded-lg'>
                {getFileIcon(currentFile.type)}
              </div>
            )}

            <div className='text-center'>
              <p className='font-medium text-sm truncate max-w-[200px]'>
                {currentFile.originalname}
              </p>
              <p className='text-xs text-muted-foreground'>
                {formatFileSize(currentFile.size)}
              </p>
            </div>

            <div className='flex items-center space-x-2'>
              {getStatusIcon()}
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={removeCurrentFile}
                className='h-8 px-3'
              >
                <Trash2 className='w-4 h-4 mr-1' />
                Remove
              </Button>
            </div>
          </div>
        )}

        {/* Upload Area */}
        {!currentFile && !hasExistingImage && (
          <div className='flex flex-col items-center justify-center space-y-2'>
            <div className='bg-primary/10 p-4 rounded-full'>
              <Upload className='size-8 text-primary' />
            </div>
            <h3 className='text-md font-semibold text-primary'>
              {placeholder}
            </h3>
            <p className='text-sm text-muted-foreground'>{description}</p>
            <input
              type='file'
              ref={fileInputRef}
              onChange={handleFileSelect}
              className='hidden'
              accept={accept}
            />
          </div>
        )}

        {/* Upload Button for existing file */}
        {currentFile && currentFile.status === 'idle' && (
          <div className='flex flex-col items-center space-y-3'>
            <Button type='button' onClick={uploadFile} className='px-6'>
              <Upload className='w-4 h-4 mr-2' />
              Upload File
            </Button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {currentFile?.status === 'error' && (
        <div className='text-sm text-red-600 text-center'>
          {currentFile.error || 'Error uploading file'}
        </div>
      )}
    </div>
  );
}

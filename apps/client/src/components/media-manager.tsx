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

export default function MediaManager({
  onUploaded,
}: {
  onUploaded: (files: (UploadedFile & { url: string })[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { files, setFiles, abortUpload, removeFile, uploadSingleFile } =
    useUploader();

  const accept = 'image/*';

  useEffect(() => {
    if (files.some((file) => file.status === 'success')) {
      onUploaded(
        files
          .filter((file) => file.status === 'success')
          .map((file) => ({ ...file, url: `${server_host}${file.path}` })),
      );
    }
  }, [files]);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  // Handle file selection from input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  // Process files
  const handleFiles = (selectedFiles: File[]) => {
    const newFiles = selectedFiles.map((file): UploadedFile => {
      const fileType = getFileType(file);
      return {
        id: generateId(),
        originalname: file.name,
        filename: file.name,
        size: file.size,
        file,
        progress: 0,
        status: 'idle' as const,
        url: fileType === EFileType.image ? URL.createObjectURL(file) : null,
        type: fileType,
      };
    });

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const uploadFiles = async () => {
    const pendingFiles = files.filter((file) => file.status !== 'success');

    if (pendingFiles.length === 0) {
      return;
    }

    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.status !== 'success'
          ? {
            ...file,
            status: 'uploading',
            progress: 0,
          }
          : file,
      ),
    );
    await Promise.all(
      pendingFiles.map((file) => uploadSingleFile(file)),
    );
  };

  return (
    <div className='space-y-6 w-full h-fit'>
      <div
        className={`border-2 py-4 border-dashed rounded-lg p-2 text-center cursor-pointer transition-colors h-full
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={'flex flex-col items-center justify-center gap-2 '}>
          <div className='bg-primary/10 p-4 rounded-full'>
            <Upload className='size-8 text-primary' />
          </div>
          <h3 className='text-md font-semibold text-primary'>
            Click to Upload / Drag & Drop
          </h3>
          <p className='text-sm text-muted-foreground'>Supports {accept}</p>
          <input
            id='image-upload'
            type='file'
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            className='hidden'
            accept={accept}
          />
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className=''>
          <div className='flex justify-between items-center p-1'>
            <h3 className='font-medium'>
              {files.length} file{files.length !== 1 && 's'}
            </h3>
            <Button
              type='button'
              size={'sm'}
              onClick={uploadFiles}
              disabled={files.every((f) => f.status === 'success')}
              className='px-4 py-2 rounded disabled:opacity-50 border'
            >
              Upload All
            </Button>
          </div>
          <div className='space-y-2 p-1'>
            {files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                removeFile={removeFile}
                abortUpload={abortUpload}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface FileItemProps {
  file: UploadedFile;
  removeFile: (id: string) => void;
  abortUpload: (id: string) => void;
}

export const FileItem = ({ file, removeFile, abortUpload }: FileItemProps) => {
  return (
    <div
      key={file.id}
      className={`flex items-center p-3 border rounded-lg transition-colors
        ${file.status === 'success'
          ? 'hover:bg-primary/5'
          : 'hover:bg-background1'
        }`}
    >
      <div className='mr-3'>
        {file.type === EFileType.image && file.url ? (
          <div className='w-10 h-10 rounded overflow-hidden'>
            <Image
              src={file.url || '/placeholder.svg'}
              alt={file.originalname}
              width={40}
              height={40}
              className='w-full h-full object-cover'
            />
          </div>
        ) : (
          getFileIcon(file.type)
        )}
      </div>

      <div className='grow min-w-0'>
        <div className='flex items-center'>
          <p className='font-medium truncate'>{file.originalname}</p>
        </div>
        <div className='flex items-center text-xs text-muted-foreground text-nowrap'>
          <span>{formatFileSize(file.size)}</span>
          <span className='mx-2'>•</span>
          <span>{file.file?.type || 'Unknown type'}</span>
        </div>
      </div>

      {file.status === 'uploading' && (
        <div className='flex items-center w-1/2 ms-4 gap-2'>
          <div className='text-xs text-center mt-1'>{file.progress}%</div>
          <progress
            value={file.progress}
            max={100}
            className='w-full bg-accent/60 h-2 rounded'
          />
          {file.status === 'uploading' && (
            <button className='size-8' onClick={() => abortUpload(file.id)}>
              <X />
            </button>
          )}
        </div>
      )}

      {file.status === 'success' && (
        <CheckCircle className='w-5 h-5 text-green-500 mr-4' />
      )}

      {file.status === 'error' && (
        <div className='flex items-center mr-4 group relative'>
          <AlertCircle className='w-5 h-5 text-red-500' />
          <div className='absolute -top-6 right-1/2 translate-x-1/2 bg-red-50 text-red-700 text-xs rounded px-2 py-1 shadow border border-red-200 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap'>
            {file.error || 'Error uploading file'}
          </div>
        </div>
      )}

      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation();
          removeFile(file.id);
        }}
        className='ml-2 size-8 flex items-center justify-center rounded hover:bg-accent transition-colors'
        aria-label='Remove file'
      >
        <Trash2 className='h-4 w-4' />
      </button>
    </div>
  );
};

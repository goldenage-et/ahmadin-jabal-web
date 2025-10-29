import { EFileType, TFileMetadata } from '@repo/common';
import { File, FileText, Film, ImageIcon, Music } from 'lucide-react';

export type UploadedFile = TFileMetadata & {
  _id: string;
  file?: File | null;
  progress?: number;
  status?: 'idle' | 'uploading' | 'success' | 'error' | 'cancelled';
  url?: string | null;
  error?: string;
};

// Helper functions
export const generateId = () => Math.random().toString(36).substring(2, 9);

export const getFileType = (file: File): EFileType => {
  if (file.type.startsWith('image/')) return EFileType.image;
  if (file.type.startsWith('video/')) return EFileType.video;
  if (file.type.startsWith('audio/')) return EFileType.audio;
  if (
    file.type.includes(EFileType.pdf) ||
    file.type.includes('doc') ||
    file.type.includes('sheet') ||
    file.type.includes('presentation')
  )
    return EFileType.pdf;
  return EFileType.row;
};

export const getFileIcon = (fileType: EFileType) => {
  switch (fileType) {
    case EFileType.image:
      return <ImageIcon className='w-6 h-6 text-blue-500' />;
    case EFileType.video:
      return <Film className='w-6 h-6 text-purple-500' />;
    case EFileType.audio:
      return <Music className='w-6 h-6 text-green-500' />;
    case EFileType.pdf:
      return <FileText className='w-6 h-6 text-yellow-500' />;
    case EFileType.audio:
      return <Music className='w-6 h-6 text-red-500' />;
    default:
      return <File className='w-6 h-6 text-gray-500' />;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  );
};

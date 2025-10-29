import { server_host } from '@/config/host.config.mjs';
import { EFileType, TFileMetadata } from '@repo/common';
import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';

export type CategoryUploadedFile = TFileMetadata & {
  id: string;
  file?: File | null;
  path?: string | null;
  progress?: number;
  status?: 'idle' | 'uploading' | 'success' | 'error' | 'cancelled';
  url?: string | null;
  size: number;
  error?: string;
};

export default function useCategoryUploader() {
  const router = useRouter();
  const [file, setFile] = useState<CategoryUploadedFile | null>(null);
  const [isTransitionStarted, startTransition] = useTransition();
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const uploadCategoryImage = async (fileToUpload: CategoryUploadedFile) => {
    try {
      const formData = new FormData();
      if (fileToUpload.file) {
        formData.append('file', fileToUpload.file, fileToUpload.originalname);
      } else {
        throw new Error('No file to upload');
      }

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhrRef.current = xhr;
      xhr.open('POST', `${server_host}/files/categories/upload`, true);

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setFile((prevFile) =>
            prevFile ? { ...prevFile, progress, status: 'uploading' } : null,
          );
        }
      };

      // Handle successful upload
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status <= 299) {
          try {
            const response: { path: string } = JSON.parse(xhr.response);
            setFile((prevFile) =>
              prevFile
                ? {
                    ...prevFile,
                    path: response.path,
                    status: 'success',
                    progress: 100,
                  }
                : null,
            );
            startTransition(router.refresh);
          } catch (parseError) {
            setFile((prevFile) =>
              prevFile
                ? {
                    ...prevFile,
                    status: 'error',
                    error: 'Invalid response format',
                  }
                : null,
            );
          }
        } else {
          setFile((prevFile) =>
            prevFile
              ? {
                  ...prevFile,
                  status: 'error',
                  error: `Upload failed: ${xhr.status} ${xhr.statusText}`,
                }
              : null,
          );
        }
      };

      // Handle errors
      xhr.onerror = () => {
        setFile((prevFile) =>
          prevFile
            ? {
                ...prevFile,
                status: 'error',
                error: 'Network error during upload',
              }
            : null,
        );
      };

      xhr.onabort = () => {
        setFile((prevFile) =>
          prevFile
            ? {
                ...prevFile,
                status: 'cancelled',
                error: 'Upload aborted',
              }
            : null,
        );
      };

      xhr.send(formData);
    } catch (error) {
      console.error('Upload error:', error);
      setFile((prevFile) =>
        prevFile
          ? {
              ...prevFile,
              status: 'error',
              error:
                error instanceof Error
                  ? error.message
                  : 'An unknown error occurred',
            }
          : null,
      );
    }
  };

  const abortUpload = () => {
    const xhr = xhrRef.current;
    if (xhr) {
      xhr.abort();
      xhrRef.current = null;

      setFile((prevFile) =>
        prevFile
          ? {
              ...prevFile,
              status: 'error',
              error: 'Upload aborted',
            }
          : null,
      );
    }
  };

  const removeFile = () => {
    const xhr = xhrRef.current;
    if (xhr) {
      xhr.abort();
      xhrRef.current = null;
    }

    setFile((prevFile) => {
      if (prevFile?.url && prevFile.type === EFileType.image) {
        URL.revokeObjectURL(prevFile.url);
      }
      return null;
    });
  };

  const setFileData = (fileData: CategoryUploadedFile | null) => {
    setFile(fileData);
  };

  return {
    file,
    uploadCategoryImage,
    abortUpload,
    removeFile,
    setFileData,
  };
}

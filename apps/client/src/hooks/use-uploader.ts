import { server_host } from '@/config/host.config.mjs';
import { EFileType, TFetcherResponse, TFileMetadata } from '@repo/common';
import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';

export type UploadedFile = TFileMetadata & {
  id: string;
  file?: File | null;
  path?: string | null;
  progress?: number;
  status?: 'idle' | 'uploading' | 'success' | 'error' | 'cancelled';
  url?: string | null;
  size: number;
  error?: string;
};

export default function useUploader() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isTransitionStarted, startTransition] = useTransition();
  const xhrMap = useRef<Map<string, XMLHttpRequest>>(new Map());

  const uploadPublicFile = async (
    file: File,
  ): Promise<TFetcherResponse<{ path: string }>> => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    const response = await fetch(`${server_host}/files/public/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    const result = await response.json();
    return result;
  };

  const uploadPrivateFile = async (
    study: string,
    file: File,
  ): Promise<TFetcherResponse<{ path: string }>> => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    const response = await fetch(`${server_host}/files/${study}/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    const result = await response.json();
    return result;
  };

  const uploadSingleFile = async (file: UploadedFile) => {
    try {
      const formData = new FormData();
      if (file.file) formData.append('file', file.file, file.originalname);

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhrMap.current.set(file.id, xhr);
      xhr.open('POST', `${server_host}/files/upload`, true);

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setFiles((prevFiles) =>
            prevFiles.map((f) => (f.id === file.id ? { ...f, progress } : f)),
          );
        }
      };

      // Handle successful upload
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status <= 299) {
          const response: { path: string } = JSON.parse(xhr.response);
          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.id === file.id
                ? {
                  ...f,
                  path: response.path,
                  status: 'success',
                  progress: 100,
                }
                : f,
            ),
          );
          startTransition(router.refresh);
        } else {
          console.log(xhr);
        }
      };

      // Handle errors
      xhr.onerror = () => {
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.id === file.id
              ? { ...f, status: 'error', error: 'Upload failed' }
              : f,
          ),
        );
      };

      xhr.onabort = () => {
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.id === file.id
              ? { ...f, status: 'cancelled', error: 'Upload aborted' }
              : f,
          ),
        );
      };

      xhr.send(formData);
    } catch (error) {
      console.error('Upload error:', error);
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === file.id
            ? {
              ...f,
              status: 'error',
              error:
                error instanceof Error
                  ? error.message
                  : 'An unknown error occurred',
            }
            : f,
        ),
      );
    }
  };

  const abortUpload = (id: string) => {
    const xhr = xhrMap.current.get(id);
    if (xhr) {
      xhr.abort();
      xhrMap.current.delete(id);

      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === id ? { ...f, status: 'error', error: 'Upload aborted' } : f,
        ),
      );
    }
  };

  const removeFile = (id: string) => {
    const xhr = xhrMap.current.get(id);
    if (xhr) {
      xhr.abort();
      xhrMap.current.delete(id);

      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === id ? { ...f, status: 'error', error: 'Upload aborted' } : f,
        ),
      );
    }
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find((file) => file.id === id);
      if (fileToRemove?.url && fileToRemove.type === EFileType.image) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prevFiles.filter((file) => file.id !== id);
    });
  };

  return { uploadPublicFile, uploadPrivateFile, uploadSingleFile, abortUpload, files, setFiles, removeFile };
}

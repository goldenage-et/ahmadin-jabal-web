import { server_host } from '@/config/host.config.mjs';

export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export interface FileUploadOptions {
  onProgress?: (progress: number) => void;
  onError?: (error: string) => void;
}

export async function uploadFile(
  file: File,
  options?: FileUploadOptions,
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // For client-side fetch, credentials: 'include' automatically sends cookies
    // No need to manually set Cookie header (that's only needed for server-side requests)
    const response = await fetch(`${server_host}/files/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Upload failed',
      }));
      throw new Error(errorData.message || 'Upload failed');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Upload failed';
    options?.onError?.(errorMessage);
    throw new Error(errorMessage);
  }
}

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, and WebP images are allowed',
    };
  }

  return { valid: true };
}

export function getImageUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';

  // If it's already a full URL, return as is
  if (url.startsWith('http')) {
    return url;
  }

  // If it's a category image filename, construct the full URL
  if (url.includes('categories/')) {
    return `${server_host}/files/categories/${url.split('/').pop()}`;
  }

  // If it's a MinIO URL, construct the full URL
  if (url.startsWith('/uploads/')) {
    return `${server_host}${url}`;
  }

  // Default case - assume it's a category image filename
  return `${server_host}/files/categories/${url}`;
}

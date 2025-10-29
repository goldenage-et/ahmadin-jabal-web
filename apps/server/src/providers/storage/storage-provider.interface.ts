import type { ReadStream } from 'fs';

export interface FileUploadResult {
  filename: string;
  size: number;
  mimetype: string;
}

export interface IStorageProvider {
  upload(
    file: Express.Multer.File,
    filename: string,
    contentType: string,
  ): Promise<FileUploadResult>;

  getFileStream(
    filename: string,
    offset: number,
    length: number,
  ): Promise<ReadStream>;
  getFileStatic(filename: string): Promise<ReadStream>;
  deleteFile(filename: string): Promise<boolean>;
  getPresignedUrl(filename: string): Promise<{ url: string | null }>;
  getPublicUrl(filename: string): Promise<{ url: string | null }>;
  getFileStat(filename: string): Promise<{
    size: number;
    etag?: string;
    lastModified?: Date;
  }>;
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, promises as fs, type ReadStream } from 'fs';
import * as path from 'path';
import {
  FileUploadResult,
  IStorageProvider,
} from './storage-provider.interface';

@Injectable()
export class DiskStorageProvider implements IStorageProvider, OnModuleInit {
  private readonly uploadDir: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>(
      'DISK_STORAGE_PATH',
      'uploads',
    );
  }

  async onModuleInit() {
    await this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch (error) {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async upload(
    file: Express.Multer.File,
    filename: string,
    contentType: string,
  ): Promise<FileUploadResult> {
    const filePath = path.join(this.uploadDir, filename);

    await fs.writeFile(filePath, file.buffer);

    return {
      filename: filePath,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async getFileStream(
    filename: string,
    offset: number,
    length: number,
  ): Promise<ReadStream> {
    const filePath = path.join(this.uploadDir, filename);
    const start = offset;
    const end = offset + length;
    return createReadStream(filePath, { start, end });
  }

  async getFileStatic(filename: string): Promise<ReadStream> {
    const filePath = path.join(this.uploadDir, filename);
    return createReadStream(filePath);
  }

  async getFileStat(filename: string) {
    const filePath = path.join(this.uploadDir, filename);
    const stat = fs.stat(filePath);
    return stat;
  }

  async deleteFile(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, filename);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getPresignedUrl(filename: string): Promise<{ url: string | null }> {
    const baseUrl = this.configService.get<string>('DISK_STORAGE_BASE_URL');
    if (!baseUrl) return { url: null };
    return { url: `${baseUrl}/${filename}` };
  }

  async getPublicUrl(filename: string): Promise<{ url: string | null }> {
    const baseUrl = this.configService.get<string>('DISK_STORAGE_BASE_URL');
    if (!baseUrl) return { url: null };
    return { url: `${baseUrl}/${filename}` };
  }
}

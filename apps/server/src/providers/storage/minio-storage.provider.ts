import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReadStream } from 'fs';
import * as Minio from 'minio';
import {
  FileUploadResult,
  IStorageProvider,
} from './storage-provider.interface';

@Injectable()
export class MinioStorageProvider implements IStorageProvider, OnModuleInit {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.bucketName = this.configService.get<string>('MINIO_BUCKET_NAME', '');
    let useSSL = this.configService.get<boolean>('MINIO_USE_SSL', false);
    if (typeof useSSL === 'string') {
      useSSL = useSSL === 'true';
    }
    try {
      this.minioClient = new Minio.Client({
        endPoint: this.configService.get<string>('MINIO_ENDPOINT', ''),
        port: this.configService.get<number>('MINIO_PORT', 9000),
        useSSL: useSSL,
        accessKey: this.configService.get<string>('MINIO_ACCESS_KEY', ''),
        secretKey: this.configService.get<string>('MINIO_SECRET_KEY', ''),
      });
      await this.checkAndCreateBucket();
      console.log('Minio Client Initialized:', this.minioClient ? 'Yes' : 'No');
    } catch (error) {
      console.error('Minio Error: ', error);
    }
  }

  private async checkAndCreateBucket() {
    try {
      if (!this.bucketName) {
        throw new Error('Bucket name is not defined');
      }
      const bucketExists = await this.minioClient.bucketExists(this.bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(this.bucketName);
        console.log(`Bucket ${this.bucketName} created`);
      } else {
        console.log(`Bucket ${this.bucketName} exists.`);
      }
    } catch (error) {
      console.error('Create Bucket Error:', error);
    }
  }

  async upload(
    file: Express.Multer.File,
    filename: string,
    contentType: string,
  ): Promise<FileUploadResult> {
    await this.minioClient.putObject(
      this.bucketName,
      filename,
      file.buffer,
      file.size,
      {
        'Content-Type': contentType,
      },
    );

    return {
      filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async getFileStream(
    filename: string,
    offset: number,
    length: number,
  ): Promise<ReadStream> {
    const stream = await this.minioClient.getPartialObject(
      this.bucketName,
      filename,
      offset,
      length,
    );
    return stream as ReadStream;
  }

  async getFileStatic(filename: string): Promise<ReadStream> {
    const stream = await this.minioClient.getObject(this.bucketName, filename);
    return stream as ReadStream;
  }

  async getFileStat(filename: string) {
    const stat = await this.minioClient.statObject(this.bucketName, filename);
    return stat;
  }
  async deleteFile(filename: string): Promise<boolean> {
    try {
      await this.minioClient.removeObject(this.bucketName, filename);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getPresignedUrl(filename: string): Promise<{ url: string } | null> {
    try {
      const url = await this.minioClient.presignedGetObject(
        this.bucketName,
        filename,
        3600,
      );
      return { url };
    } catch (error) {
      return { url: null };
    }
  }

  async getPublicUrl(filename: string): Promise<{ url: string } | null> {
    try {
      const url = await this.minioClient.presignedGetObject(
        this.bucketName,
        filename,
        undefined,
      );
      return { url };
    } catch (error) {
      return { url: null };
    }
  }
}

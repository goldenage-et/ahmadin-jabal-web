import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiskStorageProvider } from './disk-storage.provider';
import { MinioStorageProvider } from './minio-storage.provider';
import { IStorageProvider } from './storage-provider.interface';
import { EStorageType } from '@repo/common';

@Injectable()
export class StorageProviderFactory {
  constructor(
    private configService: ConfigService,
    private diskStorageProvider: DiskStorageProvider,
    private minioStorageProvider: MinioStorageProvider,
  ) {}

  createStorageProvider(): IStorageProvider {
    const storageType = this.configService.get<string>(
      'FILE_STORAGE_TYPE',
      EStorageType.DISK,
    );
    console.log(`Using '${storageType}' File Storage`);

    switch (storageType) {
      case EStorageType.MINIO:
        return this.minioStorageProvider;
      case EStorageType.DISK:
      default:
        return this.diskStorageProvider;
    }
  }
}

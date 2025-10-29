import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiskStorageProvider } from './disk-storage.provider';
import { MinioStorageProvider } from './minio-storage.provider';
import { StorageProviderFactory } from './storage-provider.factory';
import { STORAGE_PROVIDER } from '@/constants/constants';

@Module({
  providers: [
    ConfigService,
    DiskStorageProvider,
    MinioStorageProvider,
    StorageProviderFactory,
    {
      provide: STORAGE_PROVIDER,
      useFactory: (factory: StorageProviderFactory) => {
        return factory.createStorageProvider();
      },
      inject: [StorageProviderFactory],
    },
  ],
  exports: [STORAGE_PROVIDER],
})
export class StorageModule { }

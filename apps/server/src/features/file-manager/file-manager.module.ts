import { PrismaModule } from '@/database/module/prisma.module';
import { StorageModule } from '@/providers/storage/storage.module';
import { Module } from '@nestjs/common';
import { FileManagerController } from './file-manager.controller';
import { FileMetadataService } from './file-metadata.service';

@Module({
  imports: [StorageModule, PrismaModule],
  controllers: [FileManagerController],
  providers: [FileMetadataService],
  exports: [],
})
export class FileManagerModule { }

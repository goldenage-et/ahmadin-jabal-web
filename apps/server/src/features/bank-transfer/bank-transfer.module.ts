import { Module } from '@nestjs/common';
import { BankTransferController } from './bank-transfer.controller';
import { BankTransferService } from './bank-transfer.service';
import { FileMetadataService } from '../file-manager/file-metadata.service';
import { StorageModule } from '@/providers/storage/storage.module';
import { BankProvider } from '@/providers/bank/bank.provider';

@Module({
    imports: [StorageModule],
    controllers: [BankTransferController],
    providers: [BankTransferService, BankProvider, FileMetadataService],
    exports: [BankTransferService],
})
export class BankTransferModule { }


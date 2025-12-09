import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { BankTransferModule } from '../bank-transfer/bank-transfer.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
    imports: [BankTransferModule, SubscriptionsModule],
    controllers: [PaymentsController],
    providers: [PaymentsService],
    exports: [PaymentsService],
})
export class PaymentsModule { }


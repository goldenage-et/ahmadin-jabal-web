import { Module } from '@nestjs/common';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
    imports: [SubscriptionsModule],
    controllers: [PublicationsController],
    providers: [PublicationsService],
    exports: [PublicationsService],
})
export class PublicationsModule { }


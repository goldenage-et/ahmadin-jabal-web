import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
    imports: [SubscriptionsModule],
    controllers: [MediaController],
    providers: [MediaService],
    exports: [MediaService],
})
export class MediaModule { }


import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
    imports: [SubscriptionsModule],
    controllers: [NewsletterController],
    providers: [NewsletterService],
    exports: [NewsletterService],
})
export class NewsletterModule { }


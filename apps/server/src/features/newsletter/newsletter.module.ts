import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';

@Module({
    imports: [],
    controllers: [NewsletterController],
    providers: [NewsletterService],
    exports: [NewsletterService],
})
export class NewsletterModule { }


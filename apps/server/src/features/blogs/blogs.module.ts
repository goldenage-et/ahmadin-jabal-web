import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
    imports: [SubscriptionsModule],
    controllers: [BlogsController],
    providers: [BlogsService],
    exports: [BlogsService],
})
export class BlogsModule { }


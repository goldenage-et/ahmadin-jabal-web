import { PrismaModule } from '@/database/module/prisma.module';
import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { RolesModule } from '../roles/roles.module';

@Module({
    imports: [PrismaModule, RolesModule],
    controllers: [SubscriptionsController],
    providers: [SubscriptionsService],
    exports: [SubscriptionsService],
})
export class SubscriptionsModule { }


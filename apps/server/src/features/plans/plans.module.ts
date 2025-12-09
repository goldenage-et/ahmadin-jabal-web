import { PrismaModule } from '@/database/module/prisma.module';
import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { RolesModule } from '../roles/roles.module';

@Module({
    imports: [PrismaModule, RolesModule],
    controllers: [PlansController],
    providers: [PlansService],
    exports: [PlansService],
})
export class PlansModule { }


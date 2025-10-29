import { PrismaModule } from '@/database/module/prisma.module';
import { Global, Module } from "@nestjs/common";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";

/**
 * ROLES Module for resource-action based permissions with full type safety
 */
@Global()
@Module({
  imports: [PrismaModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule { }

import { Module } from '@nestjs/common';
import { PrismaModule } from '@/database/module/prisma.module';
import { SeedService } from './seed.service';

@Module({
  imports: [PrismaModule],
  providers: [SeedService],
  exports: [],
})
export class SeedModule {}

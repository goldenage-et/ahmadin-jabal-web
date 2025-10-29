import { PrismaClient } from '@repo/prisma';
import { Global, Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

export const PRISMA_CLIENT = 'PRISMA_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: PRISMA_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const adapter = new PrismaPg({
          connectionString: configService.get('DATABASE_URL'),
        });
        console.log({ DATABASE_URL: configService.get('DATABASE_URL') });
        const prisma = new PrismaClient({
          adapter,
          log:
            configService.get('NODE_ENV') === 'development'
              ? ['query', 'info', 'warn', 'error']
              : ['error'],
        });
        return prisma;
      },
    },
  ],
  exports: [PRISMA_CLIENT],
})
export class PrismaModule {}

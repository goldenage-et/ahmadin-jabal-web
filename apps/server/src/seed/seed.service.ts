import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaClient } from '@repo/prisma';
import { initialUsers, initialRoles } from './seed.data';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) { }

  async onApplicationBootstrap() {
    this.logger.log('Seeding initial data...');
    await this.seedRoles();
    await this.seedOwnerUser();
    this.logger.log('Seeding complete.');
  }

  private async seedRoles() {
    try {
      this.logger.log('Seeding roles...');

      for (const roleData of initialRoles) {
        const existing = await this.db.role.findFirst({
          where: { name: roleData.name },
        });

        if (existing) {
          this.logger.log(`Role '${roleData.name}' already exists. Skipping.`);
          continue;
        }

        await this.db.role.create({
          data: {
            name: roleData.name,
            active: roleData.active,
            permission: roleData.permission as any,
          },
        });

        this.logger.log(`Role '${roleData.name}' created successfully.`);
      }
    } catch (error) {
      this.logger.error('Error seeding roles:', error);
    }
  }

  private async seedOwnerUser() {
    try {
      // Get the owner root role
      const ownerRole = await this.db.role.findFirst({
        where: { name: 'owner' },
      });

      if (!ownerRole) {
        this.logger.warn('Owner role not found. Please seed roles first.');
        return;
      }

      const existingOwner = await this.db.user.findFirst({
        where: {
          roles: {
            some: {
              id: ownerRole.id,
            },
          },
        },
      });

      if (existingOwner) {
        this.logger.log('Owner user already exists. Skipping seeding.');
        return;
      }

      const initialUsersWithLtpHash = await Promise.all(
        initialUsers.map(async (data) => ({
          ...data,
          ltpHash: await argon2.hash(data.password),
        })),
      );

      const users = await Promise.all(
        initialUsersWithLtpHash.map(async (data) => {
          return await this.db.user.upsert({
            where: {
              email: data.email.toLowerCase(),
            },
            update: {
              roles: {
                connect: { id: ownerRole.id },
              },
            },
            create: {
              firstName: data.firstName,
              middleName: data.middleName,
              lastName: data.lastName,
              phone: data.phone,
              roles: {
                connect: { id: ownerRole.id },
              },
              email: data.email.toLowerCase(),
              ltpHash: data.ltpHash,
              emailVerified: true,
              active: true,
            },
          });
        }),
      );

      this.logger.log(`Owner user created successfully.`);
    } catch (error) {
      this.logger.error('Error seeding owner user:', error);
    }
  }
}

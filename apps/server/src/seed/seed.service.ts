import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaClient } from '@repo/prisma';
import { initialUsers, initialRoles, initialPlans } from './seed.data';
import { ESubscriptionStatus } from '@repo/common';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) { }

  async onApplicationBootstrap() {
    this.logger.log('Seeding initial data...');
    await this.seedRoles();
    await this.seedOwnerUser();
    await this.seedPlans();
    await this.migratePremiumUsers();
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

  private async seedPlans() {
    try {
      this.logger.log('Seeding plans...');

      for (const planData of initialPlans) {
        const existing = await this.db.plan.findFirst({
          where: { name: planData.name },
        });

        if (existing) {
          this.logger.log(`Plan '${planData.name}' already exists. Skipping.`);
          continue;
        }

        await this.db.plan.create({
          data: {
            name: planData.name,
            description: planData.description,
            price: planData.price,
            currency: planData.currency,
            durationDays: planData.durationDays,
            isLifetime: planData.isLifetime,
            features: planData.features as any,
            active: planData.active,
          },
        });

        this.logger.log(`Plan '${planData.name}' created successfully.`);
      }
    } catch (error) {
      this.logger.error('Error seeding plans:', error);
    }
  }

  private async migratePremiumUsers() {
    try {
      this.logger.log('Migrating premium users to Legacy Premium plan...');

      // Get Legacy Premium plan
      const legacyPlan = await this.db.plan.findFirst({
        where: { name: 'Legacy Premium' },
      });

      if (!legacyPlan) {
        this.logger.warn('Legacy Premium plan not found. Skipping migration.');
        return;
      }

      // Find all users with isPremium = true
      const premiumUsers = await this.db.user.findMany({
        where: { isPremium: true },
      });

      if (premiumUsers.length === 0) {
        this.logger.log('No premium users found. Skipping migration.');
        return;
      }

      let migratedCount = 0;
      for (const user of premiumUsers) {
        // Check if user already has an active subscription
        const existingSubscription = await this.db.subscription.findFirst({
          where: {
            userId: user.id,
            status: ESubscriptionStatus.active,
          },
        });

        if (existingSubscription) {
          this.logger.log(`User ${user.id} already has an active subscription. Skipping.`);
          continue;
        }

        // Create Legacy Premium subscription
        await this.db.subscription.create({
          data: {
            userId: user.id,
            planId: legacyPlan.id,
            status: ESubscriptionStatus.active,
            startDate: new Date(),
            endDate: null, // Lifetime
          },
        });

        migratedCount++;
      }

      this.logger.log(`Migrated ${migratedCount} premium users to Legacy Premium plan.`);
    } catch (error) {
      this.logger.error('Error migrating premium users:', error);
    }
  }
}

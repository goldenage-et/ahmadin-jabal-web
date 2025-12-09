import { PrismaClient } from '@repo/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';
import * as pg from 'pg';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.error('   Please set DATABASE_URL in your .env file');
  process.exit(1);
}

async function createTestUsers() {
  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('Creating test users...');

    // Get or create the default "user" role
    let userRole = await prisma.role.findFirst({
      where: { name: 'user' },
    });

    if (!userRole) {
      console.log('⚠️  "user" role not found. Creating it...');
      // Create a basic user role with all required permission fields (all set to false)
      // The schema requires all permission fields to be present
      userRole = await prisma.role.create({
        data: {
          name: 'user',
          active: true,
          permission: {
            user: {
              create: false,
              update: false,
              viewOne: false,
              viewMany: false,
              delete: false,
              active: false,
            },
            setting: {
              update: false,
              viewOne: false,
              viewMany: false,
            },
            role: {
              create: false,
              assign: false,
              update: false,
              viewOne: false,
              viewMany: false,
              delete: false,
            },
            book: {
              create: false,
              update: false,
              viewOne: false,
              viewMany: false,
              delete: false,
              active: false,
              featured: false,
            },
            order: {
              update: false,
              viewOne: false,
              viewMany: false,
              delete: false,
            },
            payment: {
              update: false,
              viewOne: false,
              viewMany: false,
            },
          },
        },
      });
      console.log('✅ "user" role created');
    } else {
      // Update existing role if it has empty permissions
      const currentPermission = userRole.permission as any;
      if (!currentPermission || Object.keys(currentPermission).length === 0) {
        console.log('⚠️  "user" role has empty permissions. Updating it...');
        userRole = await prisma.role.update({
          where: { id: userRole.id },
          data: {
            permission: {
              user: {
                create: false,
                update: false,
                viewOne: false,
                viewMany: false,
                delete: false,
                active: false,
              },
              setting: {
                update: false,
                viewOne: false,
                viewMany: false,
              },
              role: {
                create: false,
                assign: false,
                update: false,
                viewOne: false,
                viewMany: false,
                delete: false,
              },
              book: {
                create: false,
                update: false,
                viewOne: false,
                viewMany: false,
                delete: false,
                active: false,
                featured: false,
              },
              order: {
                update: false,
                viewOne: false,
                viewMany: false,
                delete: false,
              },
              payment: {
                update: false,
                viewOne: false,
                viewMany: false,
              },
            },
          },
        });
        console.log('✅ "user" role permissions updated');
      }
    }

    // Hash password: Test1234!
    const passwordHash = await argon2.hash('Test1234!');

    // Create Premium User
    const premiumUser = await prisma.user.upsert({
      where: { email: 'premium@test.com' },
      update: {
        isPremium: true,
        emailVerified: true,
        active: true,
        ltpHash: passwordHash,
      },
      create: {
        firstName: 'Premium',
        middleName: 'Test',
        lastName: 'User',
        email: 'premium@test.com',
        phone: '+251911111112',
        ltpHash: passwordHash,
        emailVerified: true,
        active: true,
        isPremium: true,
        roles: {
          connect: { id: userRole.id },
        },
      },
    });

    console.log('✅ Premium user created:');
    console.log('   Email: premium@test.com');
    console.log('   Password: Test1234!');
    console.log('   Premium: true');
    console.log('   ID:', premiumUser.id);

    // Create Non-Premium User
    const regularUser = await prisma.user.upsert({
      where: { email: 'regular@test.com' },
      update: {
        isPremium: false,
        emailVerified: true,
        active: true,
        ltpHash: passwordHash,
      },
      create: {
        firstName: 'Regular',
        middleName: 'Test',
        lastName: 'User',
        email: 'regular@test.com',
        phone: '+251911111113',
        ltpHash: passwordHash,
        emailVerified: true,
        active: true,
        isPremium: false,
        roles: {
          connect: { id: userRole.id },
        },
      },
    });

    console.log('\n✅ Regular user created:');
    console.log('   Email: regular@test.com');
    console.log('   Password: Test1234!');
    console.log('   Premium: false');
    console.log('   ID:', regularUser.id);

    console.log('\n✨ Test users created successfully!');
    console.log('\n📋 Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Premium User:');
    console.log('  Email:    premium@test.com');
    console.log('  Password: Test1234!');
    console.log('  Status:   Premium ✅');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Regular User:');
    console.log('  Email:    regular@test.com');
    console.log('  Password: Test1234!');
    console.log('  Status:   Non-Premium');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

createTestUsers()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });


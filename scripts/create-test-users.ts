import { PrismaClient } from '@repo/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';
import * as pg from 'pg';

// Get DATABASE_URL from environment
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create Prisma client with adapter
const pool = new pg.Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function createTestUsers() {
  try {
    console.log('Creating test users...');

    // Get the default "user" role
    const userRole = await prisma.role.findFirst({
      where: { name: 'user' },
    });

    if (!userRole) {
      throw new Error('Default "user" role not found. Please seed roles first.');
    }

    // Hash passwords
    const passwordHash = await argon2.hash('Test1234!');

    // Create Premium User
    const premiumUser = await prisma.user.upsert({
      where: { email: 'premium@test.com' },
      update: {
        isPremium: true,
        emailVerified: true,
        active: true,
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


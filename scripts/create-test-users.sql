-- Script to create test users for premium feature testing
-- Run this script using: psql $DATABASE_URL -f scripts/create-test-users.sql
-- Or: npx prisma db execute --file scripts/create-test-users.sql

-- Note: Password hash is for 'Test1234!' using argon2
-- You may need to generate a new hash if your system uses different settings

-- First, ensure the 'user' role exists
DO $$
DECLARE
    user_role_id UUID;
    password_hash TEXT := '$argon2id$v=19$m=65536,t=3,p=4$YXNkZmFzZGZhc2RmYXNkZg$RdescudvJCsgt3ub+b+d2WssQJz0+25cjmMs037sX9I'; -- Hash for 'Test1234!'
BEGIN
    -- Get the 'user' role ID
    SELECT id INTO user_role_id FROM "Role" WHERE name = 'user' LIMIT 1;
    
    IF user_role_id IS NULL THEN
        RAISE EXCEPTION 'User role not found. Please seed roles first.';
    END IF;

    -- Create Premium User
    INSERT INTO "user" (
        id,
        "firstName",
        "middleName",
        "lastName",
        email,
        phone,
        "ltpHash",
        "emailVerified",
        active,
        "isPremium",
        "createdAt",
        "updatedAt"
    ) VALUES (
        gen_random_uuid(),
        'Premium',
        'Test',
        'User',
        'premium@test.com',
        '+251911111112',
        password_hash,
        true,
        true,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (email) DO UPDATE SET
        "isPremium" = true,
        "emailVerified" = true,
        active = true,
        "updatedAt" = NOW();

    -- Create Non-Premium User
    INSERT INTO "user" (
        id,
        "firstName",
        "middleName",
        "lastName",
        email,
        phone,
        "ltpHash",
        "emailVerified",
        active,
        "isPremium",
        "createdAt",
        "updatedAt"
    ) VALUES (
        gen_random_uuid(),
        'Regular',
        'Test',
        'User',
        'regular@test.com',
        '+251911111113',
        password_hash,
        true,
        true,
        false,
        NOW(),
        NOW()
    )
    ON CONFLICT (email) DO UPDATE SET
        "isPremium" = false,
        "emailVerified" = true,
        active = true,
        "updatedAt" = NOW();

    -- Assign 'user' role to both test users
    INSERT INTO "_user_roles" ("A", "B")
    SELECT u.id, user_role_id
    FROM "user" u
    WHERE u.email IN ('premium@test.com', 'regular@test.com')
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Test users created successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE 'Premium User:';
    RAISE NOTICE '  Email:    premium@test.com';
    RAISE NOTICE '  Password: Test1234!';
    RAISE NOTICE '  Status:   Premium ✅';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE 'Regular User:';
    RAISE NOTICE '  Email:    regular@test.com';
    RAISE NOTICE '  Password: Test1234!';
    RAISE NOTICE '  Status:   Non-Premium';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;



<!-- 80144f4f-9d7c-4cef-ac78-3e6b220a8b81 245deb9d-332f-4d2d-b131-1f3c206cd6d9 -->
# Plan Subscription System Implementation

## Overview

Transform the current boolean `isPremium` system into a flexible subscription plan management system where:

- Admins/owners can create, update, and delete subscription plans
- Users can subscribe to any available plan
- Subscriptions support both time-based (monthly/yearly/custom days) and lifetime plans
- Payment integration with existing bank transfer system
- Existing premium users migrated to "Legacy Premium" plan

## Database Schema Changes

### 1. Create Plan Model (`packages/prisma/schema.prisma`)

- Fields: `id`, `name`, `description`, `price`, `currency`, `durationDays` (nullable for lifetime), `isLifetime`, `features` (JSON), `active`, `createdAt`, `updatedAt`
- Indexes: `active`, `name`

### 2. Create Subscription Model (`packages/prisma/schema.prisma`)

- Fields: `id`, `userId`, `planId`, `status` (active, expired, cancelled), `startDate`, `endDate` (nullable for lifetime), `paymentId` (optional link to Payment), `createdAt`, `updatedAt`
- Relations: User, Plan, Payment (optional)
- Indexes: `userId`, `planId`, `status`, `endDate`, `userId_status`

### 3. Migration Strategy

- Keep `isPremium` field temporarily for backward compatibility
- Create migration to add Plan and Subscription models
- Create seed data for "Legacy Premium" plan
- Migrate existing premium users to Legacy Premium subscriptions

## Backend Implementation

### 4. Plan Schemas (`packages/common/src/schemas/plans/plan.schema.ts`)

- `ZPlan`, `ZCreatePlan`, `ZUpdatePlan`, `ZPlanQueryFilter`
- Include validation for price, duration, lifetime flag

### 5. Subscription Schemas (`packages/common/src/schemas/subscriptions/subscription.schema.ts`)

- `ZSubscription`, `ZCreateSubscription`, `ZUpdateSubscription`, `ZSubscriptionQueryFilter`
- Include status enum (active, expired, cancelled)

### 6. Plans Feature (`apps/server/src/features/plans/`)

- **plans.service.ts**: CRUD operations for plans
- **plans.controller.ts**: Admin/owner endpoints (POST, GET, PUT, DELETE)
- **plans.module.ts**: Module setup
- Permission checks using role engine (similar to roles.controller.ts)

### 7. Subscriptions Feature (`apps/server/src/features/subscriptions/`)

- **subscriptions.service.ts**: 
- Create subscription (with payment integration)
- Get user's active subscription
- Check if subscription is valid
- Auto-expire subscriptions based on endDate
- **subscriptions.controller.ts**: 
- User endpoints: subscribe, get my subscription, cancel
- Admin endpoints: get all subscriptions, manage subscriptions
- **subscriptions.module.ts**: Module setup

### 8. Update Premium Access Helper (`apps/server/src/helpers/premium-access.helper.ts`)

- Replace `isPremiumUser()` to check for active subscription instead of `isPremium` boolean
- Update `getContentAccessLevel()` to use subscription status
- Add helper to get user's active plan

### 9. Update Services Using Premium Checks

Update all services that check `isPremium`:

- `apps/server/src/features/blogs/blogs.service.ts`
- `apps/server/src/features/publications/publications.service.ts`
- `apps/server/src/features/newsletter/newsletter.service.ts`
- `apps/server/src/features/media/media.service.ts`
- Replace `isPremiumUser()` calls with subscription checks

### 10. Update User Schema (`packages/common/src/schemas/users/user.schema.ts`)

- Keep `isPremium` in schema for backward compatibility (deprecated)
- Add optional `activeSubscription` field to user responses
- Update `ZAuthUser` to include subscription info

### 11. Payment Integration

- Update `apps/server/src/features/payments/payments.service.ts` to support subscription payments
- Link subscriptions to payments when payment is completed
- Auto-activate subscription on payment confirmation

### 12. Seed Data (`apps/server/src/seed/seed.data.ts`)

- Create "Legacy Premium" plan (lifetime, free for migrated users)
- Migration script to assign Legacy Premium to existing premium users

## Frontend Updates (if applicable)

### 13. Update Premium Access Logic (`apps/client/src/lib/premium.ts`)

- Replace `isPremiumUser()` implementation to check subscription
- Update `getContentAccessLevel()` usage

### 14. Plan Management UI (Admin)

- Create plan management pages (list, create, edit, delete)
- Similar to roles management UI

### 15. Subscription UI (Users)

- Subscription page showing available plans
- User's current subscription status
- Subscribe/cancel functionality

## Migration Steps

1. Create database migration for Plan and Subscription models
2. Create seed data for Legacy Premium plan
3. Run migration script to assign Legacy Premium to existing premium users
4. Deploy backend changes
5. Update frontend (if needed)
6. Monitor and remove `isPremium` field in future migration (after verification)

## Key Files to Modify

- `packages/prisma/schema.prisma` - Add Plan and Subscription models
- `packages/common/src/schemas/plans/plan.schema.ts` - New file
- `packages/common/src/schemas/subscriptions/subscription.schema.ts` - New file
- `apps/server/src/features/plans/` - New feature module
- `apps/server/src/features/subscriptions/` - New feature module
- `apps/server/src/helpers/premium-access.helper.ts` - Update premium checks
- `apps/server/src/features/*/services.ts` - Update all services using isPremium
- `apps/server/src/seed/seed.data.ts` - Add Legacy Premium plan
- `apps/client/src/lib/premium.ts` - Update frontend premium checks

### To-dos

- [ ] Create Plan model in Prisma schema with fields: name, description, price, currency, durationDays, isLifetime, features (JSON), active
- [ ] Create Subscription model in Prisma schema with fields: userId, planId, status, startDate, endDate, paymentId (optional)
- [ ] Create plan schemas in packages/common/src/schemas/plans/plan.schema.ts (ZPlan, ZCreatePlan, ZUpdatePlan, ZPlanQueryFilter)
- [ ] Create subscription schemas in packages/common/src/schemas/subscriptions/subscription.schema.ts (ZSubscription, ZCreateSubscription, ZUpdateSubscription, ZSubscriptionQueryFilter)
- [ ] Create plans.service.ts with CRUD operations for plan management
- [ ] Create plans.controller.ts with admin/owner endpoints (POST, GET, PUT, DELETE) with permission checks
- [ ] Create plans.module.ts and register in app.module.ts
- [ ] Create subscriptions.service.ts with subscribe, get active subscription, check validity, and auto-expire logic
- [ ] Create subscriptions.controller.ts with user and admin endpoints for subscription management
- [ ] Create subscriptions.module.ts and register in app.module.ts
- [ ] Update premium-access.helper.ts to check active subscriptions instead of isPremium boolean
- [ ] Update blogs.service.ts to use subscription-based premium checks
- [ ] Update publications.service.ts to use subscription-based premium checks
- [ ] Update newsletter.service.ts to use subscription-based premium checks
- [ ] Update media.service.ts to use subscription-based premium checks
- [ ] Update payments.service.ts to link subscriptions to payments and auto-activate on payment confirmation
- [ ] Add Legacy Premium plan to seed.data.ts and create migration script for existing premium users
- [ ] Update user.schema.ts to include optional activeSubscription field in responses
- [ ] Create Prisma migration for Plan and Subscription models
- [ ] Update apps/client/src/lib/premium.ts to use subscription checks instead of isPremium boolean
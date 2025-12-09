<!-- c365dc4e-5d60-4558-b0c2-366fbe8777a3 fea9a96b-4d54-4a5c-a118-6dd6f8db00d4 -->
# Frontend Subscription System Implementation

## Overview

Build the complete frontend interface for the subscription system, including:

- Admin UI for managing subscription plans (CRUD operations)
- Admin UI for viewing and managing user subscriptions
- Customer UI for browsing plans, subscribing, and managing their subscription
- Integration with existing payment flow
- Updates to navigation and profile sections

## Server Actions

### 1. Plan Actions (`apps/client/src/actions/plan.action.ts`)

Create server actions for plan management:

- `getPlans()` - Get all plans (with optional query filters)
- `getPlan(id)` - Get single plan by ID
- `createPlan(data)` - Create new plan (admin only)
- `updatePlan(id, data)` - Update existing plan (admin only)
- `deletePlan(id)` - Delete plan (admin only)

Follow the pattern from `apps/client/src/actions/role.action.ts`, using `api.get/post/put/delete` from `@/lib/api`.

### 2. Subscription Actions (`apps/client/src/actions/subscription.action.ts`)

Create server actions for subscription management:

- `getMySubscription()` - Get current user's active subscription
- `getSubscriptions(query?)` - Get all subscriptions (admin, with filters)
- `getSubscription(id)` - Get subscription by ID
- `subscribeToPlan(planId)` - Create subscription for current user
- `cancelSubscription(subscriptionId)` - Cancel user's subscription
- `updateSubscription(id, data)` - Update subscription (admin only)

## Admin UI - Plans Management

### 3. Plans List Page (`apps/client/src/app/[locale]/admin/settings/plans/page.tsx`)

Server component that:

- Fetches plans using `getPlans()`
- Passes data to `PlansClient` component
- Similar structure to `apps/client/src/app/[locale]/admin/settings/roles/page.tsx`

### 4. Plans Client Component (`apps/client/src/app/[locale]/admin/settings/plans/plans-client.tsx`)

Client component with:

- Table displaying all plans (name, price, duration, status, features)
- Search and filter functionality (by status, lifetime flag)
- Actions dropdown (edit, delete, toggle active)
- "Create Plan" button linking to new plan page
- Empty state when no plans exist
- Follow pattern from `apps/client/src/app/[locale]/admin/settings/roles/roles-client.tsx`

### 5. Create Plan Page (`apps/client/src/app/[locale]/admin/settings/plans/new/page.tsx`)

Form page for creating new plans:

- Fields: name, description, price, currency, durationDays (nullable), isLifetime checkbox, features (JSON editor or structured form), active toggle
- Validation for price > 0, durationDays required if not lifetime
- Uses `useApiMutation` hook for form submission
- Redirects to plans list on success
- Similar to `apps/client/src/app/[locale]/admin/settings/roles/new/page.tsx`

### 6. Edit Plan Page (`apps/client/src/app/[locale]/admin/settings/plans/[planId]/page.tsx`)

Edit page for existing plans:

- Fetches plan data using `getPlan(planId)`
- Pre-fills form with existing data
- Update functionality using `updatePlan()`
- Delete button with confirmation
- Similar to `apps/client/src/app/[locale]/admin/settings/roles/[roleId]/page.tsx`

## Admin UI - Subscriptions Management

### 7. Subscriptions List Page (`apps/client/src/app/[locale]/admin/subscriptions/page.tsx`)

Server component that:

- Fetches subscriptions with pagination and filters
- Displays table with user info, plan name, status, dates, actions
- Filter by status (active, expired, cancelled)
- Search by user email/name
- Similar structure to orders management

### 8. Subscription Detail Page (`apps/client/src/app/[locale]/admin/subscriptions/[subscriptionId]/page.tsx`)

Detail view showing:

- Subscription information (user, plan, status, dates)
- Payment history linked to subscription
- Actions to update status, cancel, or extend subscription
- User information card

## Customer UI - Subscription Management

### 9. Subscription Plans Page (`apps/client/src/app/[locale]/(customer)/subscriptions/page.tsx`)

Public/subscriber page showing:

- List of available subscription plans
- Plan cards with features, pricing, duration
- "Subscribe" button for each plan
- Current subscription status banner (if user has active subscription)
- Comparison table for plans (optional)

### 10. My Subscription Page (`apps/client/src/app/[locale]/(customer)/profile/subscription/page.tsx`)

User's subscription management page:

- Current subscription status and details
- Plan information (name, features, expiration date)
- Payment history for subscription
- Cancel subscription button (with confirmation)
- Upgrade/downgrade options (if applicable)
- Renewal information

### 11. Subscribe Flow Integration

Update checkout flow to support subscription purchases:

- Modify `apps/client/src/app/[locale]/(customer)/checkout/[orderId]/payment/page.tsx` to detect subscription orders
- Create subscription order when user clicks "Subscribe" on a plan
- Link subscription activation to payment confirmation
- Redirect to subscription success page after payment

## Navigation Updates

### 12. Admin Settings Navigation (`apps/client/src/layout/config/navigation.tsx`)

Add "Plans" tab to `settingTabs()`:

- Label: "Plans"
- Value: "plans"
- Description: "Manage subscription plans and pricing"
- Icon: CreditCard or similar
- URL: `/admin/settings/plans`

### 13. Admin Main Navigation

Add "Subscriptions" to main admin routes:

- Title: "Subscriptions"
- URL: `/admin/subscriptions`
- Icon: CreditCard or Users
- Active check: `path.startsWith('/admin/subscriptions')`

### 14. Customer Profile Navigation (`apps/client/src/features/portfolio/profile-layout.tsx`)

Add subscription item to `sidebarItems`:

- Label: "Subscription"
- Icon: CreditCard or Crown
- href: `/profile/subscription`
- Position after "Payment" or "Settings"

## Component Updates

### 15. Premium Badge Component (`apps/client/src/components/premium-badge.tsx`)

Create reusable component for displaying premium/subscription status:

- Shows badge based on subscription status
- Used in profile, content pages, etc.

### 16. Plan Card Component (`apps/client/src/components/plan-card.tsx`)

Reusable component for displaying plan information:

- Used in subscription plans page
- Shows plan details, pricing, features
- Subscribe button

### 17. Subscription Status Component (`apps/client/src/components/subscription-status.tsx`)

Component showing user's current subscription:

- Active/expired/cancelled status
- Days remaining
- Renewal date
- Used in profile and subscription pages

## Integration Updates

### 18. Update Premium Helper (`apps/client/src/lib/premium.ts`)

Already updated in backend plan, but verify:

- `isPremiumUser()` checks `user.activeSubscription`
- `getContentAccessLevel()` uses subscription status
- Both functions fall back to `isPremium` for backward compatibility

### 19. Update Profile Overview (`apps/client/src/features/portfolio/profile-client.tsx`)

Add subscription status display:

- Show current subscription in overview section
- Link to subscription management page
- Display premium badge if active

### 20. Update Content Preview Components

Ensure premium content preview components use updated `getContentAccessLevel()`:

- `apps/client/src/components/premium-content-preview.tsx`
- Blog and publication pages
- Media pages

## Payment Integration

### 21. Subscription Payment Flow

When user subscribes:

1. Create order for subscription plan
2. Redirect to checkout with order ID
3. Complete payment (bank transfer or online)
4. On payment confirmation, activate subscription
5. Redirect to subscription success page

Update payment completion handler to check for subscription orders and activate accordingly.

## Key Files to Create/Modify

**New Files:**

- `apps/client/src/actions/plan.action.ts`
- `apps/client/src/actions/subscription.action.ts`
- `apps/client/src/app/[locale]/admin/settings/plans/page.tsx`
- `apps/client/src/app/[locale]/admin/settings/plans/plans-client.tsx`
- `apps/client/src/app/[locale]/admin/settings/plans/new/page.tsx`
- `apps/client/src/app/[locale]/admin/settings/plans/[planId]/page.tsx`
- `apps/client/src/app/[locale]/admin/subscriptions/page.tsx`
- `apps/client/src/app/[locale]/admin/subscriptions/[subscriptionId]/page.tsx`
- `apps/client/src/app/[locale]/(customer)/subscriptions/page.tsx`
- `apps/client/src/app/[locale]/(customer)/profile/subscription/page.tsx`
- `apps/client/src/components/premium-badge.tsx`
- `apps/client/src/components/plan-card.tsx`
- `apps/client/src/components/subscription-status.tsx`

**Modified Files:**

- `apps/client/src/layout/config/navigation.tsx` - Add plans and subscriptions to navigation
- `apps/client/src/features/portfolio/profile-layout.tsx` - Add subscription to profile sidebar
- `apps/client/src/features/portfolio/profile-client.tsx` - Show subscription status
- `apps/client/src/app/[locale]/(customer)/checkout/[orderId]/payment/page.tsx` - Handle subscription orders
- `apps/client/src/lib/premium.ts` - Verify subscription checks (already updated)

## Implementation Notes

- Follow existing patterns from roles management for admin UI
- Use shadcn/ui components (Card, Table, Button, Badge, etc.)
- Implement proper loading states and error handling
- Add confirmation dialogs for destructive actions
- Ensure responsive design for mobile devices
- Add proper TypeScript types from `@repo/common` schemas
- Use `useApiMutation` hook for all mutations
- Implement proper permission checks (admin-only actions)

### To-dos

- [ ] Create plan.action.ts with CRUD server actions (getPlans, getPlan, createPlan, updatePlan, deletePlan)
- [ ] Create subscription.action.ts with subscription management actions (getMySubscription, getSubscriptions, subscribeToPlan, cancelSubscription, updateSubscription)
- [ ] Create admin plans list page and client component with table, search, filters, and actions
- [ ] Create admin create plan page with form for all plan fields (name, description, price, currency, durationDays, isLifetime, features, active)
- [ ] Create admin edit plan page with pre-filled form, update, and delete functionality
- [ ] Create admin subscriptions list page with table showing all user subscriptions, filters, and search
- [ ] Create admin subscription detail page showing subscription info, payment history, and management actions
- [ ] Create customer subscription plans page showing available plans with plan cards and subscribe buttons
- [ ] Create customer my subscription page in profile showing current subscription, status, cancel option, and payment history
- [ ] Update navigation.tsx to add Plans tab to admin settings and Subscriptions to main admin routes
- [ ] Add subscription item to profile sidebar in profile-layout.tsx
- [ ] Create reusable components: premium-badge.tsx, plan-card.tsx, subscription-status.tsx
- [ ] Update profile-client.tsx to display subscription status in overview section
- [ ] Update checkout payment page to handle subscription orders and activate subscription on payment confirmation
- [ ] Verify premium.ts helpers are using subscription checks correctly (should already be updated from backend plan)
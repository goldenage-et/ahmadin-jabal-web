import phone from 'phone';
import { z } from 'zod';
import { EInvitationStatus } from '../enums';
import { ZRole } from '../roles.schema';
import { ZSubscriptionWithPlan } from '../subscriptions/subscription.schema';

export const ZUser = z.object({
  id: z.string(),
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string().nullable().optional(),
  phone: z
    .string()
    .nullable()
    .optional()
    .refine((val) => !val || val.length === 0 || phone(val).isValid, {
      message: 'Invalid Phone Number',
    }),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  active: z.boolean(),
  isPremium: z.boolean().default(false),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});
export type TUser = z.infer<typeof ZUser>;

export const ZUserBasic = ZUser.extend({
  activeSubscription: ZSubscriptionWithPlan.nullable().optional(),
});
export type TUserBasic = z.infer<typeof ZUserBasic>;

export const ZAuthUser = ZUser.extend({
  roles: z.array(ZRole),
  activeSubscription: ZSubscriptionWithPlan.nullable().optional(),
});
export type TAuthUser = z.infer<typeof ZAuthUser>;

export const ZUserDetail = ZUser.extend({});

export type TUserDetail = z.infer<typeof ZUserDetail>;

export const ZCreateUser = z.object({
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().refine((val) => val.length === 0 || phone(val).isValid, {
    message: 'Invalid Phone Number',
  }),
});
export type TCreateUser = z.infer<typeof ZCreateUser>;

export const ZUpdateUser = z.object({
  emailVerified: z.boolean().optional(),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z
    .string()
    .refine((val) => val.length === 0 || phone(val).isValid, {
      message: 'Invalid Phone Number',
    })
    .optional(),
  active: z.boolean().optional(),
  roles: z.array(z.uuid()).optional(),
});
export type TUpdateUser = z.infer<typeof ZUpdateUser>;

export const ZUpdateMe = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  image: z.string().optional(),
  phone: z
    .string()
    .refine((val) => val.length === 0 || phone(val).isValid, {
      message: 'Invalid Phone Number',
    })
    .optional(),
});
export type TUpdateMe = z.infer<typeof ZUpdateMe>;

export const ZAssignRole = z.object({
  user: z.string(),
  roles: z.array(z.uuid()),
});
export type TAssignRole = z.infer<typeof ZAssignRole>;

export const ZUserQueryUnique = z.object({
  id: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export type TUserQueryUnique = z.infer<typeof ZUserQueryUnique>;

export const ZUserQueryFilter = z.object({
  // Search parameters
  search: z.string().optional(),

  // Pagination parameters
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),

  // Status filters
  active: z.coerce.boolean().optional(),
  deleted: z.coerce.boolean().optional(),

  // Role filter
  roles: z.array(z.uuid()).optional(),

  // Sorting parameters
  sortBy: z
    .enum(['firstName', 'email', 'active', 'roles', 'createdAt'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
export type TUserQueryFilter = z.infer<typeof ZUserQueryFilter>;

export const ZAccount = z.object({
  id: z.string(),
  user: z.string(),
  provider: z.string(),
  providerId: z.string(),
  accessToken: z.string().optional(),
  tokenType: z.string().optional(),
  expiresIn: z.number().optional(),
  idToken: z.string().optional(),
  scope: z.string().optional(),
  expiresAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
});
export type TAccount = z.infer<typeof ZAccount>;

// New schema for Auth Session
export const ZSession = z.object({
  id: z.string(),
  userId: z.string(),
  sessionId: z.string(),
  clientAgent: z.string().optional(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
});
export type TSession = z.infer<typeof ZSession>;

export const ZSessionBasic = ZSession.omit({
  sessionId: true,
});
export type TSessionBasic = z.infer<typeof ZSessionBasic>;


export const ZInvitation = z.object({
  id: z.uuid(),
  email: z.string().email(),
  invitedBy: z.uuid(),
  targetId: z.string(), // e.g., organizationId, projectId, etc.
  status: z.enum(EInvitationStatus).default(EInvitationStatus.pending),
  roles: z.array(z.string()).optional(),
  token: z.string().optional(),
  acceptedAt: z.coerce.date().optional(),
  declinedAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().optional(),
  message: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type TInvitation = z.infer<typeof ZInvitation>;

// Schema for creating a new invitation
export const ZCreateInvitation = z.object({
  email: z.string().email(),
  invitedBy: z.uuid(),
  targetId: z.uuid(),
  message: z.string().optional(),
  roles: z.array(z.string()).optional(),
  token: z.string().optional(),
});

export type TCreateInvitation = z.infer<typeof ZCreateInvitation>;

// Schema for updating invitation status
export const ZUpdateInvitationStatus = z.object({
  status: z.enum(EInvitationStatus),
});

export type TUpdateInvitationStatus = z.infer<typeof ZUpdateInvitationStatus>;

// Query filter for invitations
export const ZInvitationQueryFilter = z.object({
  id: z.uuid().optional(),
  email: z.email().optional(),
  invitedBy: z.uuid().optional(),
  targetId: z.uuid().optional(),
  status: z.enum(EInvitationStatus).optional(),
});

export type TInvitationQueryFilter = z.infer<typeof ZInvitationQueryFilter>;

export const ZInvitationQueryUnique = z.object({
  id: z.uuid().optional(),
  email: z.string().email().optional(),
  invitedBy: z.uuid().optional(),
  targetId: z.uuid().optional(),
});

export type TInvitationQueryUnique = z.infer<typeof ZInvitationQueryUnique>;

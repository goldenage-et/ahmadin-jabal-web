import phone from 'phone';
import { z } from 'zod';

export const ZPassword = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least 1 numeric character');

// ===========================REST================================

export const ZRegister = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  middleName: z.string().min(2, {
    message: 'Meddle name must be at least 2 characters.',
  }),
  lastName: z
    .string()
    .min(2, {
      message: 'Last name must be at least 2 characters.',
    })
    .optional(),
  email: z.email(),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || phone(val).isValid, {
      message: 'Invalid Phone Number',
    }),
  password: ZPassword,
});
export type TRegister = z.infer<typeof ZRegister>;

export const ZLogin = z.object({
  email: z.email(),
  password: ZPassword,
});

export type TLogin = z.infer<typeof ZLogin>;

export const ZLoginOption = z.object({
  clientAgent: z.string().optional(),
});

export type TLoginOption = z.infer<typeof ZLoginOption>;

export const ZVerifyEmail = z.object({
  otp: z.string(),
  email: z.email(),
});
export type TVerifyEmail = z.infer<typeof ZVerifyEmail>;

export const ZChangeEmail = z.object({
  email: z.email(),
});
export type TChangeEmail = z.infer<typeof ZChangeEmail>;

export const ZEmailVerification = z.object({
  email: z.email(),
});
export type TEmailVerification = z.infer<typeof ZEmailVerification>;

export const ZForgetPassword = z.object({
  email: z.email(),
});
export type TForgetPassword = z.infer<typeof ZForgetPassword>;

export const ZVerifyOtp = z.object({
  otp: z.string(),
  email: z.email(),
});
export type TVerifyOtp = z.infer<typeof ZVerifyOtp>;

export const ZSetPassword = z.object({
  otp: z.string(),
  email: z.email(),
  password: ZPassword,
});
export type TSetPassword = z.infer<typeof ZSetPassword>;

export const ZDeleteAccount = z.object({
  password: ZPassword,
});
export type TDeleteAccount = z.infer<typeof ZDeleteAccount>;

export const ZSwitchOrganization = z.object({
  organizationId: z.string(),
});
export type TSwitchOrganization = z.infer<typeof ZSwitchOrganization>;

export const ZChangePassword = z.object({
  oldPassword: z.string(),
  newPassword: ZPassword,
});
export type TChangePassword = z.infer<typeof ZChangePassword>;

export type TPushNotification = {
  title: string;
  body: string;
};

export type TPublishNotification = {
  title: string;
  body: string;
};

export const ZGoogleUser = z.object({
  id: z.string(),
  name: z.string().nullable(),
  given_name: z.string().nullable(),
  family_name: z.string().nullable(),
  email: z.email(),
});

export type TGoogleUser = z.infer<typeof ZGoogleUser>;

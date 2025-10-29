import { EStorageType, formatZodError } from '@repo/common';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url(),
  CLIENT_HOST: z.url(),
  CLIENT_PORT: z.coerce.number().int(),
  SERVER_HOST: z.url(),
  SERVER_PORT: z.coerce.number().int(),

  MAIL_HOST: z.string().optional(),
  MAIL_PORT: z.coerce.number().int().positive().optional(),
  MAIL_USERNAME: z.string().optional(),
  MAIL_PASSWORD: z.string().optional(),

  FILE_STORAGE_TYPE: z.enum(EStorageType).default(EStorageType.DISK),
  DISK_STORAGE_PATH: z.string().default('uploads'),
  DISK_STORAGE_BASE_URL: z.string().url().optional(),

  MINIO_ENDPOINT: z.string().optional(),
  MINIO_PORT: z.coerce.number().optional(),
  MINIO_BUCKET_NAME: z.string().optional(),
  MINIO_USE_SSL: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
  MINIO_ACCESS_KEY: z.string().optional(),
  MINIO_SECRET_KEY: z.string().optional(),

  OAUTH_REDIRECT_URL_BASE: z.url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
});

// Validation function
export function validateEnv(config: Record<string, any>) {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    const errors = formatZodError(result.error as any);
    throw new Error(`Environment validation error:\n${JSON.stringify(errors)}`);
  }
  console.log('Validating environment variables:', result.data);
  return result.data;
}

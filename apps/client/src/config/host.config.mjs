import { formatZodError } from '@repo/common';
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SERVER_HOST: z.string().url(),
  NEXT_PUBLIC_CLIENT_HOST: z.string().url(),
  NEXT_PUBLIC_MIMIO_HOST: z.string().url(),
});

export function validateEnv() {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_SERVER_HOST: process.env.NEXT_PUBLIC_SERVER_HOST,
    NEXT_PUBLIC_CLIENT_HOST: process.env.NEXT_PUBLIC_CLIENT_HOST,
    NEXT_PUBLIC_MIMIO_HOST: process.env.NEXT_PUBLIC_MIMIO_HOST,
  });
  if (!result.success) {
    const errors = formatZodError(result.error);
    throw new Error(`Environment validation error:\n${JSON.stringify(errors)}`);
  }
  return result.data;
}

const server_host =
  process.env.NEXT_PUBLIC_SERVER_HOST ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:8010'
    : 'https://ahmadin-api.harunjeylan.et');
const client_host =
  process.env.NEXT_PUBLIC_CLIENT_HOST ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://ahmadin.harunjeylan.et');
const mimio_host =
  process.env.NEXT_PUBLIC_MIMIO_HOST ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:9000'
    : 'https://abayminio.harunjeylan.et');

export { client_host, mimio_host, server_host };

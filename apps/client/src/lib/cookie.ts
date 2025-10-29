'use server';
import { cookies } from 'next/headers';

export async function getCookieHeader() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return cookieHeader;
}

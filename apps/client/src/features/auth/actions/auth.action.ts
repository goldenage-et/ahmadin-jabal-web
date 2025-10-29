'use server';

import { api } from '@/lib/api';
import {
  TChangePassword,
  TForgetPassword,
  TLogin,
  TRegister,
  TSessionBasic,
  TSetPassword,
  TUserBasic,
  TVerifyEmail,
} from '@repo/common';

export async function signupWithEmail(data: TRegister) {
  const res = await api.post<{ message: string; user: string }>(
    `/auth/register`,
    data,
  );

  return res;
}

export async function acceptInvitation(token: string) {
  const res = await api.get<{ message: string; user: string }>(
    `/auth/join/${token}`,
  );

  return res;
}

export async function loginWithEmail(data: TLogin) {
  const res = await api.post<TUserBasic>(`/auth/login`, data);
  return res;
}

export async function getEmailVerification(data: { email: string }) {
  const res = await api.post<{ message: string }>(
    `/auth/email-verification`,
    data,
  );
  return res;
}

export async function verifyEmail(data: TVerifyEmail) {
  const res = await api.post<{ message: string; user: string }>(
    `/auth/verify-email`,
    data,
  );
  return res;
}

export async function forgetPassword(data: TForgetPassword) {
  const res = await api.post<{ email: string }>(`/auth/forget-password`, data);
  return res;
}

export async function setPassword(data: TSetPassword) {
  const res = await api.post<{ message: string; user: string }>(
    '/auth/set-password',
    data,
  );
  return res;
}

export async function changePassword(data: TChangePassword) {
  const res = await api.post<{ message: string }>(
    '/auth/change-password',
    data,
  );
  return res;
}

export async function getUserSessions() {
  const res = await api.get<TSessionBasic[]>('/auth/sessions');
  return res;
}

export async function switchStore(storeId: string) {
  const res = await api.post<{ user: TUserBasic; session: TSessionBasic }>(
    '/auth/switch-store',
    { storeId },
  );
  return res;
}

export async function logout() {
  const res = await api.delete<{ success: boolean }>('/auth/logout');
  return res;
}

export async function logoutOther(id: string) {
  const res = await api.delete<{ success: boolean }>(`/auth/logout/${id}`);
  return res;
}

export async function logoutAll() {
  const res = await api.delete<{ deletedCount: number }>(`/auth/logout/all`);
  return res;
}

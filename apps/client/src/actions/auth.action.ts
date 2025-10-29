'use server';

import { api } from '@/lib/api';
import { TAuthUser, TSession } from '@repo/common';
import { cache } from 'react';

export const getSession = cache(async () => {
  const response = await api.get<{
    user: TAuthUser;
    session: TSession;
  }>(`/auth/session`);
  return response;
});

export const getAuth = cache(async () => {
  const auth = await getSession();
  if (!auth || auth.error) {
    return {
      session: null,
      user: null,
      error: auth,
    };
  }
  return {
    session: auth.session,
    user: auth.user,
    error: null,
  };
});


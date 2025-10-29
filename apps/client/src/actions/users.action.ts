'use server';

import { api } from '@/lib/api';
import {
  TUserBasic,
  TUserDetail,
  TCreateUser,
  TUpdateUser,
  TFetcherResponse,
} from '@repo/common';

// Get many users
export async function getManyUsers(params?: {
  role?: string;
  search?: string;
}): Promise<TFetcherResponse<TUserBasic[]>> {
  return api.get<TUserBasic[]>(`/users`, { params });
}

// Get a single user
export async function getOneUser(
  id: string,
): Promise<TFetcherResponse<TUserDetail>> {
  return api.get<TUserDetail>(`/users/${id}`);
}

// Create a new user
export async function createUser(
  data: TCreateUser,
): Promise<TFetcherResponse<TUserBasic>> {
  return api.post<TUserBasic>(`/users`, data);
}

// Update a user
export async function updateUser(
  id: string,
  data: TUpdateUser,
): Promise<TFetcherResponse<TUserBasic>> {
  return api.put<TUserBasic>(`/users/${id}`, data);
}

// Delete a user
export async function deleteUser(
  id: string,
): Promise<TFetcherResponse<boolean>> {
  return api.delete<boolean>(`/users/${id}`);
}

// Invite users
export async function inviteUsers(data: {
  emails: string[];
  roles: string[];
}): Promise<TFetcherResponse<{ invitations: any[] }>> {
  return api.post<{ invitations: any[] }>(`/users/invite`, data);
}

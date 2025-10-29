'use server';

import { api } from '@/lib/api';
import { TRegister, TUserBasic, TUserQueryFilter } from '@repo/common';

import { TUpdateMe, TUpdateUser } from '@repo/common';

// User search (GET /users/search?q=...)
export async function searchUsers(query: string) {
  const res = await api.get<TUserBasic[]>(
    `/users/search?q=${encodeURIComponent(query)}`,
  );
  return res;
}

// Get current user (GET /users/me)
export async function getCurrentUser() {
  const res = await api.get<TUserBasic>(`/users/me`);
  return res;
}

// Update current user (PUT /users/me)
export async function updateCurrentUser(data: TUpdateMe) {
  const res = await api.put<TUserBasic>(`/users/me`, data);
  return res;
}

// Change email (POST /auth/change-email)
export async function changeEmail(data: { email: string }) {
  const res = await api.post<{ message: string }>(`/auth/change-email`, data);
  return res;
}

// Delete current user (DELETE /users/me)
export async function deleteCurrentUser() {
  const res = await api.delete<{ success: boolean }>(`/users/me`);
  return res;
}

// Create user (POST /users)
export async function createUser(data: TRegister) {
  const res = await api.post<TUserBasic>(`/users`, data);
  return res;
}

// Get all users (GET /users)
export async function getUsers(params: TUserQueryFilter) {
  const res = await api.get<TUserBasic[]>(`/users`, { params });
  return res;
}

// Get user by id (GET /users/:id)
export async function getUserById(id: string) {
  const res = await api.get<TUserBasic>(`/users/${id}`);
  return res;
}

// Update user by id (PUT /users/:id)
export async function updateUserById(id: string, data: TUpdateUser) {
  const res = await api.put<TUserBasic>(`/users/${id}`, data);
  return res;
}

// Delete user by id (DELETE /users/:id)
export async function deleteUserById(id: string) {
  const res = await api.delete<{ success: boolean }>(`/users/${id}`);
  return res;
}

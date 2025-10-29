'use server';

import { api } from '@/lib/api';
import {
  TCreateMemberRequest,
  TUpdateMemberRequest,
  TMemberListQuery,
  TMemberListResponse,
  TMemberStats,
  TMemberWithUser,
  TBulkMemberAction,
  TMemberInvitation,
  TMemberActivity,
} from '@repo/common';

// Member Management API functions
export async function getMembers(
  storeId: string,
  query: TMemberListQuery,
): Promise<TMemberListResponse> {
  const response = await api.get<TMemberListResponse>(
    `/admin/stores/${storeId}/members`,
    { params: query },
  );
  if ('error' in response) throw response;
  return response;
}

export async function getMemberStats(storeId: string): Promise<TMemberStats> {
  const response = await api.get<TMemberStats>(
    `/admin/stores/${storeId}/members/stats`,
  );
  if ('error' in response) throw response;
  return response;
}

export async function getPendingInvitations(
  storeId: string,
): Promise<TMemberInvitation[]> {
  const response = await api.get<TMemberInvitation[]>(
    `/admin/stores/${storeId}/members/invitations`,
  );
  if ('error' in response) throw response;
  return response;
}

export async function inviteMember(
  storeId: string,
  createMemberRequest: TCreateMemberRequest,
): Promise<TMemberInvitation> {
  const response = await api.post<TMemberInvitation>(
    `/admin/stores/${storeId}/members`,
    createMemberRequest,
  );
  if ('error' in response) throw response;
  return response;
}

export async function updateMember(
  storeId: string,
  memberId: string,
  updateMemberRequest: TUpdateMemberRequest,
): Promise<TMemberWithUser> {
  const response = await api.put<TMemberWithUser>(
    `/admin/stores/${storeId}/members/${memberId}`,
    updateMemberRequest,
  );
  if ('error' in response) throw response;
  return response;
}

export async function removeMember(
  storeId: string,
  memberId: string,
): Promise<void> {
  const response = await api.delete(
    `/admin/stores/${storeId}/members/${memberId}`,
  );
  if ('error' in response) throw response;
  return response;
}

export async function bulkUpdateMembers(
  storeId: string,
  bulkAction: TBulkMemberAction,
): Promise<{ updated: number }> {
  const response = await api.put<{ updated: number }>(
    `/admin/stores/${storeId}/members/bulk`,
    bulkAction,
  );
  if ('error' in response) throw response;
  return response;
}

export async function resendInvitation(
  storeId: string,
  invitationId: string,
): Promise<TMemberInvitation> {
  const response = await api.post<TMemberInvitation>(
    `/admin/stores/${storeId}/members/invitations/${invitationId}/resend`,
    {},
  );
  if ('error' in response) throw response;
  return response;
}

export async function cancelInvitation(
  storeId: string,
  invitationId: string,
): Promise<void> {
  const response = await api.delete(
    `/admin/stores/${storeId}/members/invitations/${invitationId}`,
  );
  if ('error' in response) throw response;
  return response;
}

export async function getMemberActivity(
  storeId: string,
  limit?: number,
): Promise<TMemberActivity[]> {
  const response = await api.get<TMemberActivity[]>(
    `/admin/stores/${storeId}/members/activity`,
    {
      params: { limit: limit || 50 },
    },
  );
  if ('error' in response) throw response;
  return response;
}

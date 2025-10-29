'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getMembers,
  getMemberStats,
  getPendingInvitations,
  inviteMember,
  updateMember,
  removeMember,
  bulkUpdateMembers,
  resendInvitation,
  cancelInvitation,
  getMemberActivity,
} from '@/actions/member-management.action';
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

export function useMemberManagement(storeId: string) {
  const [members, setMembers] = useState<TMemberWithUser[]>([]);
  const [stats, setStats] = useState<TMemberStats | null>(null);
  const [invitations, setInvitations] = useState<TMemberInvitation[]>([]);
  const [activity, setActivity] = useState<TMemberActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchMembers = useCallback(
    async (
      query: TMemberListQuery = {
        page: 1,
        limit: 10,
        sortBy: 'joinedAt',
        sortOrder: 'desc',
      },
    ) => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMembers(storeId, query);
        setMembers(response.members);
        setPagination({
          total: response.total,
          page: response.page,
          limit: response.limit,
          totalPages: response.totalPages,
        });
      } catch (err: any) {
        console.error('Failed to fetch members:', err);
        setError(err.message || 'Failed to load members.');
      } finally {
        setLoading(false);
      }
    },
    [storeId],
  );

  const fetchStats = useCallback(async () => {
    try {
      const response = await getMemberStats(storeId);
      setStats(response);
    } catch (err: any) {
      console.error('Failed to fetch member stats:', err);
    }
  }, [storeId]);

  const fetchInvitations = useCallback(async () => {
    try {
      const response = await getPendingInvitations(storeId);
      setInvitations(response);
    } catch (err: any) {
      console.error('Failed to fetch invitations:', err);
    }
  }, [storeId]);

  const fetchActivity = useCallback(
    async (limit?: number) => {
      try {
        const response = await getMemberActivity(storeId, limit);
        setActivity(response);
      } catch (err: any) {
        console.error('Failed to fetch member activity:', err);
      }
    },
    [storeId],
  );

  const handleInviteMember = async (
    createMemberRequest: TCreateMemberRequest,
  ) => {
    try {
      const newInvitation = await inviteMember(storeId, createMemberRequest);
      setInvitations((prev) => [...prev, newInvitation]);
      return newInvitation;
    } catch (err: any) {
      console.error('Failed to invite member:', err);
      throw err;
    }
  };

  const handleUpdateMember = async (
    memberId: string,
    updateMemberRequest: TUpdateMemberRequest,
  ) => {
    try {
      const updatedMember = await updateMember(
        storeId,
        memberId,
        updateMemberRequest,
      );
      setMembers((prev) =>
        prev.map((member) => (member.id === memberId ? updatedMember : member)),
      );
      return updatedMember;
    } catch (err: any) {
      console.error('Failed to update member:', err);
      throw err;
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember(storeId, memberId);
      setMembers((prev) => prev.filter((member) => member.id !== memberId));
      // Update stats
      await fetchStats();
    } catch (err: any) {
      console.error('Failed to remove member:', err);
      throw err;
    }
  };

  const handleBulkUpdate = async (bulkAction: TBulkMemberAction) => {
    try {
      const result = await bulkUpdateMembers(storeId, bulkAction);
      // Refresh members list
      await fetchMembers({
        page: pagination.page,
        limit: pagination.limit,
        sortBy: 'joinedAt',
        sortOrder: 'desc',
      });
      return result;
    } catch (err: any) {
      console.error('Failed to bulk update members:', err);
      throw err;
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      const updatedInvitation = await resendInvitation(storeId, invitationId);
      setInvitations((prev) =>
        prev.map((invitation) =>
          invitation.id === invitationId ? updatedInvitation : invitation,
        ),
      );
      return updatedInvitation;
    } catch (err: any) {
      console.error('Failed to resend invitation:', err);
      throw err;
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await cancelInvitation(storeId, invitationId);
      setInvitations((prev) =>
        prev.filter((invitation) => invitation.id !== invitationId),
      );
    } catch (err: any) {
      console.error('Failed to cancel invitation:', err);
      throw err;
    }
  };

  const refetch = useCallback(
    async (query?: TMemberListQuery) => {
      await Promise.all([
        fetchMembers(query),
        fetchStats(),
        fetchInvitations(),
        fetchActivity(),
      ]);
    },
    [fetchMembers, fetchStats, fetchInvitations, fetchActivity],
  );

  useEffect(() => {
    if (storeId) {
      // Initial load - fetch all data
      Promise.all([
        fetchMembers(),
        fetchStats(),
        fetchInvitations(),
        fetchActivity(),
      ]);
    }
  }, [storeId, fetchMembers, fetchStats, fetchInvitations, fetchActivity]);

  return {
    // Data
    members,
    stats,
    invitations,
    activity,
    pagination,

    // State
    loading,
    error,

    // Actions
    fetchMembers,
    fetchStats,
    fetchInvitations,
    fetchActivity,
    handleInviteMember,
    handleUpdateMember,
    handleRemoveMember,
    handleBulkUpdate,
    handleResendInvitation,
    handleCancelInvitation,
    refetch,
  };
}

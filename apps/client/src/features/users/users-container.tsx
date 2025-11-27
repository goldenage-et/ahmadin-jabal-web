'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TUserBasic, TUserQueryFilter } from '@repo/common';
import { UsersDataTable } from './users-data-table';
import { UserModal } from './user-modal';
import useSearchState from '@/hooks/use-search-state';

type TUsersContainerProps = {
  users: TUserBasic[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};
export function UsersContainer({
  users,
  total = 0,
  page = 1,
  limit = 10,
  totalPages = 1,
}: TUsersContainerProps) {
  const queryClient = useQueryClient();
  const [pageQuery, setPageQuery] = useSearchState('page', page?.toString());
  const [limitQuery, setLimitQuery] = useSearchState(
    'limit',
    limit?.toString(),
  );
  const [sortByQuery, setSortByQuery] = useSearchState('sortBy', 'createdAt');
  const [sortOrderQuery, setSortOrderQuery] = useSearchState(
    'sortOrder',
    'desc',
  );

  // Modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TUserBasic | null>(null);

  const handleViewUser = (user: TUserBasic) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setViewModalOpen(false);
    setSelectedUser(null);
  };

  const handleFiltersChange = (newFilters: Partial<TUserQueryFilter>) => {
    console.log({ newFilters });

    if (newFilters.page) {
      setPageQuery(newFilters.page.toString());
    }
    if (newFilters.limit) {
      setLimitQuery(newFilters.limit.toString());
    }
    if (newFilters.sortBy) {
      setSortByQuery(newFilters.sortBy);
    }
    if (newFilters.sortOrder) {
      setSortOrderQuery(newFilters.sortOrder);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Users</h1>
          <p className='text-muted-foreground'>
            View all users in the platform
          </p>
        </div>
      </div>

      <UsersDataTable
        data={users}
        total={total}
        page={page}
        limit={limit}
        totalPages={totalPages}
        filters={{
          page: parseInt(pageQuery),
          limit: parseInt(limitQuery),
          sortBy: sortByQuery as
            | 'createdAt'
            | 'roles'
            | 'active'
            | 'email'
            | 'firstName',
          sortOrder: sortOrderQuery as 'desc' | 'asc',
        }}
        onView={handleViewUser}
        onFiltersChange={handleFiltersChange}
        queryClient={queryClient}
      />

      {/* User View Modal */}
      <UserModal
        isOpen={viewModalOpen}
        onClose={handleCloseModal}
        initialData={selectedUser}
        isSubmitting={false}
        onSubmit={() => { }} // Read-only mode, no submit functionality
        readOnly={true}
      />
    </div>
  );
}

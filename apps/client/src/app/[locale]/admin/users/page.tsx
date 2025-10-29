import { Metadata } from 'next';
import { UsersContainer } from '@/features/users/users-container';
import { getManyUsers } from '@/actions/users.action';
import { TUserQueryFilter } from '@repo/common';
import { Users } from 'lucide-react';
import { getUsers } from '@/features/user/actions/user.action';

export const metadata: Metadata = {
  title: 'Users Management | ahmadin Super Admin',
  description: 'Manage all users in the ahmadin platform',
};

type TUsersPageProps = {
  searchParams: Promise<TUserQueryFilter>;
};

export default async function UsersPage({ searchParams }: TUsersPageProps) {
  const filters = await searchParams;
  const response = await getUsers(filters);
  if (!response || response.error) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <Users className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-lg font-semibold mb-2'>Failed to load users</h3>
          <p className='text-muted-foreground mb-4'>
            There was an error loading the users. Please try again.
          </p>
        </div>
      </div>
    );
  }
  console.log(response);

  return (
    <UsersContainer
      users={response}
    />
  );
}

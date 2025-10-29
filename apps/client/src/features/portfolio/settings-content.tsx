'use client';

import UserSetting from '@/features/user/components/user-setting';
import { TUserBasic } from '@repo/common';
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/actions/profile.action';

export function SettingsContent() {
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: getMyProfile,
  });

  if (!profileData?.user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center space-x-2 text-sm text-gray-500'>
        <a href='/' className='hover:text-gray-700'>Home</a>
        <span>›</span>
        <a href='/profile' className='hover:text-gray-700'>Account</a>
        <span>›</span>
        <span className='text-gray-900 font-medium'>Settings</span>
      </div>

      <UserSetting user={profileData.user} />
    </div>
  );
}

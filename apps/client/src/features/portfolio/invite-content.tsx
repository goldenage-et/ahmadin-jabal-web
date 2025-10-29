'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function InviteContent() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center space-x-2 text-sm text-gray-500'>
        <a href='/' className='hover:text-gray-700'>Home</a>
        <span>›</span>
        <a href='/profile' className='hover:text-gray-700'>Account</a>
        <span>›</span>
        <span className='text-gray-900 font-medium'>Invite friends</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invite Friends</CardTitle>
          <CardDescription>Refer friends and earn rewards.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-gray-600'>Invite friends system coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

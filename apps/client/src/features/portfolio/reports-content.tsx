'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function ReportsContent() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center space-x-2 text-sm text-gray-500'>
        <a href='/' className='hover:text-gray-700'>Home</a>
        <span>›</span>
        <a href='/profile' className='hover:text-gray-700'>Account</a>
        <span>›</span>
        <span className='text-gray-900 font-medium'>Manage reports</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Reports</CardTitle>
          <CardDescription>Download your account reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-gray-600'>Report management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function HelpContent() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center space-x-2 text-sm text-gray-500'>
        <a href='/' className='hover:text-gray-700'>Home</a>
        <span>›</span>
        <a href='/profile' className='hover:text-gray-700'>Account</a>
        <span>›</span>
        <span className='text-gray-900 font-medium'>Help center</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Help Center</CardTitle>
          <CardDescription>Find answers to your questions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-gray-600'>Help center coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

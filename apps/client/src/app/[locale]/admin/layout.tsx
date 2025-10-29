import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getAuth } from '../../../actions/auth.action';
import { MainLayout } from '../../../layout/main-layout';
import { QueryProvider } from '../../../components/query-provider';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { user, session } = await getAuth();
  if (!user) {
    return redirect('/auth/signin?callbackUrl=/superadmin');
  }
  console.log({ user });

  return (
    <QueryProvider>
      <MainLayout user={user} variant='superadmin'>
        <div className='p-4 md:p-6'>
          <div className='mx-auto'>{children}</div>
        </div>
      </MainLayout>
    </QueryProvider>
  );
}

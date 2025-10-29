import { getAuth } from '@/actions/auth.action';
import { GeneralSettingsTab } from '@/app/_features/store/settings-tabs/general-settings-tab';
import { redirect } from 'next/navigation';

interface LayoutProps {
  params: Promise<{}>;
}

export default async function StoreSettingsPage({ params }: LayoutProps) {
  const { user, member } = await getAuth();
  if (!member || !user) {
    redirect('/');
  }
  return (
    <GeneralSettingsTab member={member!} user={user!} />
  );
}

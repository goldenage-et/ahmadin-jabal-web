import { getAuth } from '@/actions/auth.action';
import { GeneralSettingsTab } from '@/features/admin/settings/general-settings-tab';
import { redirect } from 'next/navigation';

export default async function GeneralSettingsPage() {
  const { user } = await getAuth();
  if (!user) {
    redirect('/');
  }
  return <GeneralSettingsTab user={user} />;
}

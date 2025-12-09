import { ProfileLayoutWrapper } from '@/features/portfolio/profile-layout-wrapper';
import { QueryProvider } from '../../../../components/query-provider';

export default function ProfileLayoutWrapperComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileLayoutWrapper>{children}</ProfileLayoutWrapper>
  );
}

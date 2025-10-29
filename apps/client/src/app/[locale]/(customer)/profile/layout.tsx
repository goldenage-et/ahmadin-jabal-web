import { QueryProvider } from '../../../../components/query-provider';
import { ProfileLayoutWrapper } from '../components/profile-layout-wrapper';

export default function ProfileLayoutWrapperComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileLayoutWrapper>{children}</ProfileLayoutWrapper>
  );
}

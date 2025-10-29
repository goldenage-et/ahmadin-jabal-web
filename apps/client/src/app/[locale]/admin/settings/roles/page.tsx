import { getRootRoles, getStoreRoles } from '@/actions/role.action';
import { RolesClient } from './roles-client';

export default async function RolesPage() {
    const response = await getRootRoles();
    const roles = response.error ? [] : response;

    return <RolesClient initialRoles={roles} />;
}

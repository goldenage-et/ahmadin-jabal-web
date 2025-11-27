import { getRoles } from '@/actions/role.action';
import { RolesClient } from './roles-client';

export default async function RolesPage() {
    const roles = await getRoles();
    const rolesArray = Array.isArray(roles) ? roles : [];

    return <RolesClient initialRoles={rolesArray} />;
}

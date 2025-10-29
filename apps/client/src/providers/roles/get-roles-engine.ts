import { RoleEngine } from "@repo/common";

let rolesEngine: RoleEngine | null = null;

export function getRoleEngine() {
    if (!rolesEngine) {
        rolesEngine = new RoleEngine();
    }
    const canAll = rolesEngine.canAll.bind(rolesEngine);
    const canAny = rolesEngine.canAny.bind(rolesEngine);
    const can = rolesEngine.can.bind(rolesEngine);
    return {
        canAll,
        canAny,
        can,
    };
}
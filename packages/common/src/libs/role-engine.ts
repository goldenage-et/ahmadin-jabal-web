import { TAuthUser } from "@/schemas/users/user.schema";
import { EResources, TRole } from "../schemas/roles.schema";

export class RoleEngine {
    // for root
    can<R extends keyof TRole['permission']>(user: TAuthUser, recourse: R, action: keyof TRole['permission'][R]): boolean {
        return this.evaluateRole(user, recourse as EResources, [action] as string[], false)
    }

    canAny<R extends keyof TRole['permission']>(user: TAuthUser, recourse: R, actions: (keyof TRole['permission'][R])[]): boolean {
        return this.evaluateRole(user, recourse as EResources, actions as string[], true)
    }

    canAll<R extends keyof TRole['permission']>(user: TAuthUser, recourse: R, actions: (keyof TRole['permission'][R])[]): boolean {
        return this.evaluateRole(user, recourse as EResources, actions as string[], false)
    }

    evaluateRole(user: TAuthUser, recourse: EResources, actions: string[], any: boolean) {
        if (!user) return false
        if (!user.roles) return false

        const results = user.roles.map((role): boolean => {
            const roleRules = role.permission[recourse as keyof typeof role.permission]

            if (!roleRules) return false
            // Get action rule
            const actionRule = any ? actions.some(action => roleRules[action as keyof typeof roleRules]) : actions.every(action => roleRules[action as keyof typeof roleRules])
            return actionRule
        })
        return results?.some((result) => result)
    }
}
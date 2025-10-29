import {
  TAuthUser,
  TRole,
} from "@repo/common";
import { getRoleEngine } from "../get-roles-engine";


export function getRoles({
  user,
}: {
  user?: TAuthUser | null;
}) {
  const engine = getRoleEngine();

  const canAll = <R extends keyof TRole["permission"]>(recourse: R, actions: (keyof TRole["permission"][R])[]) => {
    if (!user) return false;
    return engine.canAll(user, recourse, actions);
  }
  const canAny = <R extends keyof TRole["permission"]>(recourse: R, actions: (keyof TRole["permission"][R])[]) => {
    if (!user) return false;
    return engine.canAny(user, recourse, actions);
  }

  const can = <R extends keyof TRole["permission"]>(recourse: R, action: keyof TRole["permission"][R]) => {
    if (!user) return false;
    return engine.can(user, recourse, action);
  }

  return {
    canAll,
    canAny,
    can,
  };
}

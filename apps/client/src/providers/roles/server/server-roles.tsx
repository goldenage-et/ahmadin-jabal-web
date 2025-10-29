import {
  TAuthUser,
  TRole,
} from "@repo/common";
import React from "react";
import { getRoles } from "./get-roles";


export function ServerCan<R extends keyof TRole["permission"]>({
  user,
  recourse,
  action,
  children,
}: {
  user: TAuthUser;
  recourse: R;
  action: keyof TRole["permission"][R];
  children: React.ReactNode;
}) {
  const { can } = getRoles({ user });
  if (!can(recourse, action)) {
    return null;
  }
  return <>{children}</>;
}

export function ServerCanAll<R extends keyof TRole["permission"]>({
  user,
  recourse,
  actions,
  children,
}: {
  user: TAuthUser;
  recourse: R;
  actions: (keyof TRole["permission"][R])[];
  children: React.ReactNode;
}) {
  const { canAll } = getRoles({ user });
  if (!canAll(recourse, actions)) {
    return null;
  }
  return <>{children}</>;
}

export function ServerCanAny<R extends keyof TRole["permission"]>({
  user,
  recourse,
  actions,
  children,
}: {
  user: TAuthUser;
  recourse: R;
  actions: (keyof TRole["permission"][R])[];
  children: React.ReactNode;
}) {
  const { canAny } = getRoles({ user });
  if (!canAny(recourse, actions)) {
    return null;
  }
  return <>{children}</>;
}

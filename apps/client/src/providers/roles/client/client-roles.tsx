import {
  TRole,
} from "@repo/common";
import React from "react";
import { useRoles } from "./use-roles";


export function ClientCan<R extends keyof TRole["permission"]>({
  recourse,
  action,
  children,
}: {
  recourse: R;
  action: keyof TRole["permission"][R];
  children: React.ReactNode;
}) {
  const { can } = useRoles();
  if (!can(recourse, action)) {
    return null;
  }
  return <>{children}</>;
}

export function ClientCanAll<R extends keyof TRole["permission"]>({
  recourse,
  actions,
  children,
}: {
  recourse: R;
  actions: (keyof TRole["permission"][R])[];
  children: React.ReactNode;
}) {
  const { canAll } = useRoles();
  if (!canAll(recourse, actions)) {
    return null;
  }
  return <>{children}</>;
}

export function ClientCanAny<R extends keyof TRole["permission"]>({
  recourse,
  actions,
  children,
}: {
  recourse: R;
  actions: (keyof TRole["permission"][R])[];
  children: React.ReactNode;
}) {
  const { canAny } = useRoles();
  if (!canAny(recourse, actions)) {
    return null;
  }
  return <>{children}</>;
}


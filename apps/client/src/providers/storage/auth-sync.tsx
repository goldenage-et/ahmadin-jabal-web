"use client";

import {
  TAuthUser,
  TSession,
} from "@repo/common";
import { useEffect } from "react";
import { useAuth } from "./auth.storage";
interface AuthSyncProps {
  user?: TAuthUser | null;
  session?: TSession | null;
}

export function AuthSync({
  user,
  session,
}: AuthSyncProps) {
  const setAuth = useAuth((state) => state.setAuth);

  useEffect(() => {
    if (user && session) {
      setAuth({
        user,
        session,
      });
    }
  }, [user, session]);

  return null;
}

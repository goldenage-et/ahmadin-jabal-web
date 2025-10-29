"use client";

import {
  TAuthUser,
  TSession
} from "@repo/common";
import { create } from "zustand";

/**
 * Session storage state interface
 */
export interface AuthState {
  user: TAuthUser | null;
  session: TSession | null;
  // Actions
  setAuth: (data: {
    user?: TAuthUser | null;
    session?: TSession | null;
  }) => void;

  clearAuth: () => void;
}

export const useAuth = create<AuthState>()((set) => ({
  user: null,
  session: null,
  member: null,
  members: [],
  // Set auth data
  setAuth: (data) => set((state) => ({ ...state, ...data })),

  clearAuth: () =>
    set({
      user: null,
      session: null,
    }),
}));

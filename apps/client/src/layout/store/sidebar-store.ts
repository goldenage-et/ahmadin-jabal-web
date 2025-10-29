'use client';

import { create } from 'zustand';

export type SidebarState = {
  open: boolean;
  contentWidth: number;
  collapsible: 'icon' | 'offcanvas';
};

export type SidebarActions = {
  setContentWidth: (width: number) => void;
  setCollapse: (collapsible: 'icon' | 'offcanvas') => void;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

export type SidebarStore = SidebarState & SidebarActions;

export const useSidebarStore = create<SidebarStore>((set, get) => ({
  open: false,
  collapsible: 'icon',
  contentWidth: 0,

  setContentWidth: (contentWidth) => {
    set({ contentWidth });
  },

  setCollapse: (collapsible) => {
    set({ collapsible });
  },

  setOpen: (open) => {
    set({ open });
  },

  toggle: () => {
    set((state) => ({ open: !state.open }));
  },
}));

// Legacy export for backward compatibility
export const useAdminSidebar = useSidebarStore;

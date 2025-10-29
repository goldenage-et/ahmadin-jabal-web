'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAdminSidebar } from '../store/sidebar-store';

export const useSidebar = () => {
  const { open, setOpen, collapsible, setContentWidth } = useAdminSidebar();
  const ref = useRef<HTMLDivElement>(null);

  const toggleSidebar = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  useEffect(() => {
    if (ref.current) {
      setContentWidth(ref.current.offsetWidth);
    }

    const timeout = setTimeout(() => {
      if (ref.current) {
        setContentWidth(ref.current.offsetWidth);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [setContentWidth]);

  return {
    open,
    collapsible,
    ref,
    toggleSidebar,
  };
};

import { TBookBasic } from '@repo/common';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BuyNowStore {
  buyNowItem: TBookBasic | null;
  setBuyNowItem: (item: TBookBasic) => void;
  clearBuyNowItem: () => void;
  hasBuyNowItem: () => boolean;
}

export const useBuyNowStore = create<BuyNowStore>()(
  persist(
    (set, get) => ({
      buyNowItem: null,

      setBuyNowItem: (item: TBookBasic) => {
        set({ buyNowItem: item });
      },

      clearBuyNowItem: () => {
        set({ buyNowItem: null });
      },

      hasBuyNowItem: () => {
        return get().buyNowItem !== null;
      },
    }),
    {
      name: 'ahmadin-buynow-storage',
      // Use sessionStorage instead of localStorage for temporary data
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    },
  ),
);


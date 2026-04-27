'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VratTrackingState {
  followedVrats: string[];
  reminderHours: number;
  followVrat: (slug: string) => void;
  unfollowVrat: (slug: string) => void;
  isFollowing: (slug: string) => boolean;
  setReminderHours: (h: number) => void;
}

export const useVratTrackingStore = create<VratTrackingState>()(
  persist(
    (set, get) => ({
      followedVrats: [],
      reminderHours: 2,

      followVrat: (slug: string) => {
        const current = get().followedVrats;
        if (!current.includes(slug)) {
          set({ followedVrats: [...current, slug] });
        }
      },

      unfollowVrat: (slug: string) => {
        set({ followedVrats: get().followedVrats.filter((s) => s !== slug) });
      },

      isFollowing: (slug: string) => {
        return get().followedVrats.includes(slug);
      },

      setReminderHours: (h: number) => {
        set({ reminderHours: h });
      },
    }),
    {
      name: 'dekho-vrat-tracking',
    },
  ),
);

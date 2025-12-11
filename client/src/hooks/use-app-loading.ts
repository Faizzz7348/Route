import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppLoadingState {
  lastActiveTime: number;
  hasSeenIntro: boolean;
  shouldShowIntro: () => boolean;
  updateLastActiveTime: () => void;
  markIntroAsSeen: () => void;
  resetIntro: () => void;
}

const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds

export const useAppLoading = create<AppLoadingState>()(
  persist(
    (set, get) => ({
      lastActiveTime: Date.now(),
      hasSeenIntro: false,

      shouldShowIntro: () => {
        const { lastActiveTime, hasSeenIntro } = get();
        const now = Date.now();
        const timeSinceLastActive = now - lastActiveTime;
        
        // Show intro if:
        // 1. First time (never seen intro)
        // 2. Been inactive for more than 1 hour
        return !hasSeenIntro || timeSinceLastActive > ONE_HOUR;
      },

      updateLastActiveTime: () => {
        set({ lastActiveTime: Date.now() });
      },

      markIntroAsSeen: () => {
        set({ hasSeenIntro: true, lastActiveTime: Date.now() });
      },

      resetIntro: () => {
        set({ hasSeenIntro: false, lastActiveTime: Date.now() });
      },
    }),
    {
      name: 'app-loading-storage',
    }
  )
);

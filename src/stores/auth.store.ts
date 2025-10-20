import type { UserProfile } from "@/types/user_profile.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStoreState = {
  user_profile: UserProfile | null;
};

type AuthStoreActions = {
  setUserProfile: (profile: UserProfile | null) => void;
  clearUserProfile: () => void;
};

type AuthStore = AuthStoreState & AuthStoreActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user_profile: null,
      setUserProfile: (profile) => set({ user_profile: profile }),

      clearUserProfile: () => set({ user_profile: null }),
    }),
    { name: "auth-storage" }
  )
);

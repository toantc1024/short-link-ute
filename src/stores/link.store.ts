import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Link } from "@/types/link.type";
import {
  getLinksByUserId,
  createLink,
  deleteLink,
  updateLink,
} from "@/services/link.service";
import { useAuthStore } from "./auth.store";

type LinkStoreState = {
  links: Link[];
  isLoading: boolean;
};

type LinkStoreActions = {
  fetchLinks: (userId?: string) => Promise<void>;
  addLink: (link: Partial<Link>) => Promise<Link>;
  removeLink: (id: string) => Promise<void>;
  updateLink: (id: string, updates: Partial<Link>) => Promise<void>;
  setLinks: (links: Link[]) => void;
  clearLinks: () => void;
};

type LinkStore = LinkStoreState & LinkStoreActions;

export const useLinkStore = create<LinkStore>()(
  persist(
    (set) => ({
      links: [],
      isLoading: false,

      fetchLinks: async (userId?: string) => {
        if (!userId) return;

        set({ isLoading: true });
        try {
          const links = await getLinksByUserId(userId);
          set({ links, isLoading: false });
        } catch (error) {
          console.error("Error fetching links:", error);
          set({ isLoading: false });
        }
      },

      addLink: async (linkData: Partial<Link>) => {
        let link: Link = await createLink({
          ...linkData,
        });

        set((state) => ({
          links: [...state.links, link],
        }));

        return link;
      },

      removeLink: async (id: string) => {
        const { user_profile } = useAuthStore.getState();

        try {
          if (user_profile?.role !== "anonymous") {
            // Only delete from database if user is logged in
            await deleteLink(id);
          }

          // Remove from local store
          set((state) => ({
            links: state.links.filter((link) => link.id !== id),
          }));
        } catch (error) {
          console.error("Error removing link:", error);
          throw error;
        }
      },

      updateLink: async (id: string, updates: Partial<Link>) => {
        const { user_profile } = useAuthStore.getState();

        try {
          if (user_profile?.role !== "anonymous") {
            // Only update in database if user is logged in
            await updateLink(id, updates);
          }

          // Update in local store
          set((state) => ({
            links: state.links.map((link) =>
              link.id === id ? { ...link, ...updates } : link
            ),
          }));
        } catch (error) {
          console.error("Error updating link:", error);
          throw error;
        }
      },

      setLinks: (links) => set({ links }),
      clearLinks: () => set({ links: [] }),
    }),
    {
      name: "link-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

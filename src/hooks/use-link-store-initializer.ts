import { useEffect } from "react";
import { useLinkStore } from "@/stores/link.store";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Hook to initialize link store based on user authentication status
 * - For anonymous users: loads links from localStorage
 * - For logged-in users: fetches links from database
 */
export function useLinkStoreInitializer() {
  const { fetchLinks, clearLinks } = useLinkStore();
  const { user_profile } = useAuthStore();

  useEffect(() => {
    if (!user_profile) {
      // No user profile yet, don't do anything
      return;
    }

    if (user_profile.role === "anonymous") {
      // For anonymous users, links are already loaded from localStorage via persist
      // No need to fetch from database
      return;
    } else {
      // For logged-in users, clear any persisted anonymous links and fetch from database
      clearLinks();
      fetchLinks(user_profile.id);
    }
  }, [user_profile, fetchLinks, clearLinks]);
}

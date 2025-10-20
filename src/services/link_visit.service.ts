import { supabase } from "@/lib/supabase";
import type { LinkVisit } from "@/types/link_visit.type";

// Function to get client IP address (best effort)
const getClientIP = async (): Promise<string> => {
  try {
    // Try to get IP from a public API
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip || "unknown";
  } catch (error) {
    console.warn("Could not fetch IP address:", error);
    return "unknown";
  }
};

// Function to get user agent
const getUserAgent = (): string => {
  return navigator.userAgent || "unknown";
};

// Function to get referrer
const getReferrer = (): string => {
  return document.referrer || "direct";
};

export const createLinkVisit = async (
  linkId: string,
  ipAddress?: string,
  userAgent?: string,
  referrer?: string
): Promise<LinkVisit | null> => {
  try {
    // If not provided, try to collect the information
    const visitData: Partial<LinkVisit> = {
      link_id: linkId,
      ip_address: ipAddress || (await getClientIP()),
      user_agent: userAgent || getUserAgent(),
      referrer: referrer || getReferrer(),
    };

    const { data, error } = await supabase
      .from("link_visits")
      .insert(visitData)
      .select()
      .single();

    if (error) {
      console.error("Error creating link visit:", error);
      // Don't throw error to avoid blocking the redirect
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in createLinkVisit:", error);
    // Don't throw error to avoid blocking the redirect
    return null;
  }
};

export const getLinkVisitsByLinkId = async (
  linkId: string
): Promise<LinkVisit[]> => {
  const { data, error } = await supabase
    .from("link_visits")
    .select("*")
    .eq("link_id", linkId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching link visits:", error);
    throw error;
  }

  return data || [];
};

export const getLinkVisitsCount = async (linkId: string): Promise<number> => {
  const { count, error } = await supabase
    .from("link_visits")
    .select("*", { count: "exact", head: true })
    .eq("link_id", linkId);

  if (error) {
    console.error("Error fetching link visits count:", error);
    throw error;
  }

  return count || 0;
};

export const getLinkVisitStats = async (linkId: string) => {
  try {
    const { data, error } = await supabase
      .from("link_visits")
      .select("ip_address, user_agent, referrer, created_at")
      .eq("link_id", linkId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching link visit stats:", error);
      throw error;
    }

    const visits = data || [];
    const totalVisits = visits.length;
    const uniqueVisitors = new Set(visits.map((visit) => visit.ip_address))
      .size;

    // Get top referrers
    const referrerCounts = visits.reduce(
      (acc: Record<string, number>, visit) => {
        const referrer = visit.referrer || "direct";
        acc[referrer] = (acc[referrer] || 0) + 1;
        return acc;
      },
      {}
    );

    const topReferrers = Object.entries(referrerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([referrer, count]) => ({ referrer, count }));

    // Get visits by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentVisits = visits.filter(
      (visit) => new Date(visit.created_at) >= thirtyDaysAgo
    );

    const visitsByDate = recentVisits.reduce(
      (acc: Record<string, number>, visit) => {
        const date = new Date(visit.created_at).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {}
    );

    return {
      totalVisits,
      uniqueVisitors,
      topReferrers,
      visitsByDate,
      recentVisits: recentVisits.length,
    };
  } catch (error) {
    console.error("Error in getLinkVisitStats:", error);
    throw error;
  }
};

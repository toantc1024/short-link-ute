import { supabase } from "@/lib/supabase";
import type { Link } from "@/types/link.type";
export const getLinkByShortCode = async (
  short_code: string
): Promise<Link | null> => {
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("short_code", short_code)
    .single();
  if (error) {
    console.error("Error fetching link by short code:", error);
    throw error;
  }
  return data;
};

export const getLinkById = async (id: string): Promise<Link | null> => {
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error fetching link by ID:", error);
    throw error;
  }
  return data;
};
export const getLinksByUserId = async (user_id: string): Promise<Link[]> => {
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user_id);
  if (error) {
    console.error("Error fetching links:", error);
    throw error;
  }
  return data || [];
};

export const createLink = async (link: Partial<Link>): Promise<Link> => {
  const { data, error } = await supabase.from("links").insert(link).select();
  if (error) {
    console.error("Error creating link:", error);
    throw error;
  }
  return data[0];
};

export const deleteLink = async (id: string): Promise<void> => {
  const { error } = await supabase.from("links").delete().eq("id", id);
  if (error) {
    console.error("Error deleting link:", error);
    throw error;
  }
};
export const updateLink = async (
  id: string,
  updates: Partial<Link>
): Promise<Link> => {
  const { data, error } = await supabase
    .from("links")
    .update(updates)
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error updating link:", error);
    throw error;
  }
  return data;
};

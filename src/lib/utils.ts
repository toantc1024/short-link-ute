import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate the full shortened URL following the convention: current_origin/short_code
 * This is the standard format for all short URL operations
 */
export function getShortUrl(shortCode: string): string {
  const currentOrigin = window.location.origin;
  return `${currentOrigin}/${shortCode}`;
}

/**
 * Extract short code from a full short URL
 */
export function extractShortCode(shortUrl: string): string {
  try {
    const url = new URL(shortUrl);
    return url.pathname.substring(1); // Remove the leading '/'
  } catch {
    return shortUrl; // If not a valid URL, assume it's already a short code
  }
}

/**
 * Validate if a string is a valid URL with proper protocol
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Normalize URL by ensuring it has a protocol
 */
export function normalizeUrl(url: string): string {
  if (!url.trim()) return url;

  // If no protocol, add https://
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }

  return url;
}

/**
 * Check if short code is available (basic validation)
 */
export function isValidShortCode(code: string): boolean {
  if (!code.trim()) return false;

  // Basic validation: alphanumeric and hyphens only, 3-50 characters
  const shortCodeRegex = /^[a-zA-Z0-9-]{3,50}$/;
  return shortCodeRegex.test(code.trim());
}

/**
 * Format click count with appropriate units
 */
export function formatClickCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Generate a random short code for anonymous users
 */
export function generateRandomShortCode(length: number = 6): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Utility function to track link visits with error handling
 * Returns true if tracking was successful, false otherwise
 */
export async function trackLinkVisit(linkId: string): Promise<boolean> {
  try {
    const { createLinkVisit } = await import("@/services/link_visit.service");
    const result = await createLinkVisit(linkId);
    return result !== null;
  } catch (error) {
    console.warn("Failed to track link visit:", error);
    return false;
  }
}

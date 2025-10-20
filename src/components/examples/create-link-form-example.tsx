/**
 * Example usage of the link store in a standalone form component
 * This demonstrates how to use the link creation functionality
 * outside of the hero section.
 */

import { useState } from "react";
import { toast } from "sonner";
import { useLinkStore } from "@/stores/link.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getShortUrl,
  isValidUrl,
  isValidShortCode,
  normalizeUrl,
} from "@/lib/utils";

export function CreateLinkFormExample() {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { addLink } = useLinkStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!url.trim()) {
      toast.error("Please enter a URL to shorten");
      return;
    }

    // Normalize URL (add https:// if missing)
    const normalizedUrl = normalizeUrl(url.trim());

    if (!isValidUrl(normalizedUrl)) {
      toast.error("Please enter a valid URL");
      return;
    }

    // Validate short code if provided
    if (customCode.trim() && !isValidShortCode(customCode.trim())) {
      toast.error(
        "Invalid short code. Use only letters, numbers, and hyphens (-) (3-50 characters)"
      );
      return;
    }

    setIsLoading(true);
    try {
      const newLink = await addLink({
        original_url: normalizedUrl,
        short_code: customCode.trim() || undefined, // Let backend generate if empty
      });

      // Copy to clipboard and show success toast
      const fullUrl = getShortUrl(
        newLink.short_code || customCode.trim() || ""
      );
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Copied to clipboard");

      // Reset form
      setUrl("");
      setCustomCode("");
    } catch (error) {
      console.error("Error creating link:", error);
      toast.error("Failed to create link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Enter URL to shorten"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <Input
            placeholder="Custom short code (optional)"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full"
        >
          {isLoading ? "Creating..." : "Shorten URL"}
        </Button>
      </form>
    </div>
  );
}

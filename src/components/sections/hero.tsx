"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuroraText } from "../ui/aurora-text";
import { useHeaderSize } from "@/hooks/use-header-size";
import {
  getShortUrl,
  isValidUrl,
  isValidShortCode,
  normalizeUrl,
  cn,
} from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Input } from "../ui/input";
import LinkTable from "../block/link-table";
import { useLinkStore } from "@/stores/link.store";
import { useLinkStoreInitializer } from "@/hooks/use-link-store-initializer";
import { GridPattern } from "../ui/grid-pattern";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

function HeroTitles() {
  return (
    <div className="flex w-full  flex-col space-y-4 overflow-hidden pt-0">
      <div className="absolute z-[-1] flex h-[500px] w-full flex-col items-center justify-center rounded-lg">
        <GridPattern
          squares={[
            [4, 4],
            [5, 1],
            [8, 2],
            [5, 3],
            [5, 5],
            [10, 10],
            [12, 15],
            [15, 10],
            [10, 15],
            [15, 10],
            [10, 15],
            [15, 10],
          ]}
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
          )}
        />
      </div>
      <motion.h1
        className="text-center text-4xl font-medium leading-tight text-foreground sm:text-5xl md:text-6xl"
        initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
        animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease,
          staggerChildren: 0.2,
        }}
      >
        {[<AuroraText>HCMUTE</AuroraText>, "S-Link & QR Code"].map(
          (text, index) => (
            <motion.span
              key={index}
              className="inline-block px-1 md:px-2 text-balance font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                ease,
              }}
            >
              {text}
            </motion.span>
          )
        )}
      </motion.h1>
      <motion.p
        className="text-center text-lg leading-7 text-muted-foreground sm:leading-9 text-balance"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.6,
          duration: 0.8,
          ease,
        }}
      >
        Rút gọn liên kết và tạo mã QR dễ dàng
      </motion.p>
    </div>
  );
}

function CreateLinkForm() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { addLink } = useLinkStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!originalUrl.trim()) {
      toast.error("Vui lòng nhập liên kết cần rút gọn");
      return;
    }

    // Normalize URL (add https:// if missing)
    const normalizedUrl = normalizeUrl(originalUrl.trim());

    if (!isValidUrl(normalizedUrl)) {
      toast.error("Liên kết không hợp lệ. Vui lòng nhập URL đầy đủ");
      return;
    }

    // Validate short code only if provided
    if (shortCode.trim() && !isValidShortCode(shortCode.trim())) {
      toast.error(
        "Mã rút gọn không hợp lệ. Chỉ sử dụng chữ cái, số và dấu gạch ngang (-) (3-50 ký tự)"
      );
      return;
    }

    setIsLoading(true);
    try {
      const newLink = await addLink({
        original_url: normalizedUrl,
        short_code: shortCode.trim() || undefined, // Let system generate if empty
      });

      // Copy to clipboard and show success toast
      const finalShortCode = newLink.short_code || shortCode.trim();
      const fullUrl = getShortUrl(finalShortCode);
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Copied to clipboard");

      // Reset form
      setOriginalUrl("");
      setShortCode("");
    } catch (error) {
      console.error("Error creating link:", error);
      toast.error("Có lỗi xảy ra khi tạo liên kết. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="mx-auto z-[9999] mt-6 flex w-full max-w-2xl flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8, ease }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-2 rounded-4xl flex border-border border-1 w-full gap-2"
      >
        <Input
          className="!rounded-3xl w-full py-5 px-4"
          placeholder="Dán liên kết cần rút gọn"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          disabled={isLoading}
          required
        />
        <Input
          className="w-auto !rounded-3xl py-5 px-4"
          placeholder="Mã rút gọn (tùy chọn)"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
          disabled={isLoading}
        />
        <Button
          type="submit"
          className="!rounded-3xl !py-5"
          effect="expandIcon"
          icon={ArrowRight}
          iconPlacement="right"
          disabled={isLoading || !originalUrl.trim()}
        >
          {isLoading ? "Đang tạo..." : "Tạo"}
        </Button>
      </form>
    </motion.div>
  );
}

export default function Hero2() {
  const { headerHeight } = useHeaderSize();

  // Initialize link store
  useLinkStoreInitializer();

  return (
    <section id="hero" className="  relative">
      <div
        className="bg-full p-2 "
        style={{
          // height: `calDac(100vh - ${headerHeight}px)`,
          minHeight: `calc(100vh - ${headerHeight}px)`,
          // paddingTop:
          //   headerHeight > 0 ? `${Math.max(32, headerHeight * 0.5)}px` : "32px",
        }}
      >
        <div className="rounded-4xl   h-full relative flex w-full bg flex-col items-center justify-start  pt-24 px-4 pt-8 sm:px-6 lg:px-8 transition-all duration-300">
          {/* <div className="absolute w-full h-full top-[-150px] left-0 overflow-hidden pointer-events-none z-[-1]">
            <GridPattern
              squares={[
                [4, 4],
                [5, 1],
                [8, 2],
                [5, 3],
                [5, 5],
                [10, 10],
                [12, 15],
                [15, 10],
                [10, 15],
                [15, 10],
                [10, 15],
                [15, 10],
              ]}
              className={cn(
                "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
                "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
              )}
            />
          </div> */}
          <div className="pb-4 relative sm:pb-8 ">
            <HeroTitles />
            <CreateLinkForm />
          </div>
          <motion.div
            className="mx-auto md:px-24 flex w-full flex-col items-center justify-center  space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, ease }}
          >
            <LinkTable />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

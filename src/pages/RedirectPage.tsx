import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { getLinkByShortCode } from "@/services/link.service";
import { createLinkVisit } from "@/services/link_visit.service";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Link2Off } from "lucide-react";

const RedirectPage = () => {
  const { short_code } = useParams<{ short_code: string }>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [hasError, setHasError] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const link = await getLinkByShortCode(short_code || "");

        if (link && link.is_active !== false) {
          // Track the visit before redirecting (ensure it completes first)
          try {
            await createLinkVisit(link.id);
            console.log("Visit tracked successfully");
          } catch (error) {
            console.warn("Failed to track visit:", error);
            // Continue with redirect even if tracking fails
          }

          // Add a small delay to show the loading animation and ensure smooth navigation
          setTimeout(() => {
            window.location.href = link.original_url;
          }, 200); // 0.2 second delay
          // Don't set loading to false here - keep showing the loading animation until redirect
        } else {
          setHasError(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching link:", error);
        setHasError(true);
        setIsLoading(false);
      }
      // Remove the finally block to avoid setting loading to false for successful redirects
    };

    if (short_code) {
      fetchLink();
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  }, [short_code]);
  return (
    <div className="relative h-screen flex flex-col justify-between">
      <div className=" absolute flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg ">
        {/* <GridPattern
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
            "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
          )}
        /> */}
      </div>
      <div className=" flex flex-col items-center justify-center h-full   gap-4">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center gap-4"
          >
            <Spinner variant="ellipsis" className="h-24 w-24 text-primary" />
            <p className="text-2xl sm:text-3xl lg:text-4xl">
              Đang chuyển hướng
            </p>
          </motion.div>
        ) : hasError ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-4"
          >
            <Link2Off className="h-24 w-24 text-destructive" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-destructive mb-2">
                Liên kết đã hỏng
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Liên kết này không tồn tại hoặc đã bị vô hiệu hóa
              </p>
            </div>
          </motion.div>
        ) : null}
      </div>
      <motion.div
        className="mx-auto md:px-24 flex w-full flex-col items-center justify-center  space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.4,
          duration: 0.2,
        }}
      >
        <div className="pb-4 pt-0 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-4">
          {/* Copyright */}
          <span className="text-center w-full text-muted-foreground text-xs sm:text-sm">
            Thực hiện bởi Phòng Truyền Thông <br /> Trường Đại học Sư phạm Kỹ
            thuật TP. Hồ Chí Minh
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default RedirectPage;

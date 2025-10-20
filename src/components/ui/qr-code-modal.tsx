"use client";

import * as React from "react";
import { QrCode, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { getLinkById } from "@/services/link.service";
import type { Link } from "@/types/link.type";
import SQUARE_LOGO from "@/assets/logo/square_logo.png";

interface QRCodeModalProps {
  linkId: string;
  trigger?: React.ReactNode;
}

export function QRCodeModal({ linkId, trigger }: QRCodeModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [link, setLink] = React.useState<Link | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const qrRef = React.useRef<HTMLCanvasElement>(null);

  // Check if mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const truncateUrl = (url: string, maxLength: number = 50): string => {
    if (url.length <= maxLength) return url;
    return `${url.substring(0, maxLength - 3)}...`;
  };

  const fetchLinkData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get link data and increment view count
      const linkData = await getLinkById(linkId);

      setLink(linkData);
    } catch (err) {
      console.error("Error fetching link data:", err);
      setError("Không thể tải dữ liệu liên kết");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    fetchLinkData();
  };

  const handleClose = () => {
    setIsOpen(false);
    setLink(null);
    setError(null);
  };

  const downloadQRCode = () => {
    if (!qrRef.current || !link) return;

    try {
      // Since we're using QRCodeCanvas, we can directly get the canvas data
      const canvas = qrRef.current;
      const dataUrl = canvas.toDataURL("image/png");

      // Create download link
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `qr-code-${link.short_code}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      downloadQRCodeFallback();
    }
  };

  const downloadQRCodeFallback = () => {
    if (!qrRef.current || !link) return;

    try {
      // Alternative method: get canvas as blob and download
      qrRef.current.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `qr-code-${link.short_code}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (error) {
      console.error("Error downloading QR code fallback:", error);
    }
  };

  const getFullUrl = () => {
    if (!link?.short_code) return "";
    return `${window.location.origin}/${link.short_code}`;
  };

  return (
    <>
      {/* Trigger */}
      <div onClick={handleOpen} className="cursor-pointer">
        {trigger || (
          <Button variant="ghost" size="sm">
            <QrCode className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

          {/* Modal Content */}
          <div className="relative z-50 w-full max-w-md mx-auto bg-background rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background rounded-t-lg">
              <h2 className="text-lg font-semibold">Mã QR</h2>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Spinner
                    variant="ellipsis"
                    className="h-12 w-12 text-primary mb-4"
                  />
                  <p className="text-sm text-muted-foreground">
                    Đang tải dữ liệu liên kết...
                  </p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              ) : link ? (
                <div className="flex flex-col items-center space-y-4">
                  {/* QR Code */}
                  <div className="bg-white p-4 sm:p-6 rounded-lg border shadow-sm">
                    <QRCodeCanvas
                      ref={qrRef}
                      value={getFullUrl()}
                      size={isMobile ? 200 : 256}
                      level="M"
                      marginSize={4}
                      fgColor="#000000"
                      bgColor="#ffffff"
                      imageSettings={{
                        src: SQUARE_LOGO,
                        x: undefined,
                        y: undefined,
                        height: isMobile ? 32 : 40,
                        width: isMobile ? 32 : 40,
                        excavate: true,
                        opacity: 1,
                      }}
                    />
                  </div>

                  {/* Link Info */}
                  <div className="text-center space-y-2 w-full">
                    <p className="text-sm font-medium">{link.short_code}</p>
                    <p className="text-xs text-muted-foreground break-all px-2">
                      {getFullUrl()}
                    </p>
                    <div className="px-2">
                      <p className="text-xs text-muted-foreground">
                        Chuyển hướng đến:{" "}
                        <span className="font-medium" title={link.original_url}>
                          {truncateUrl(link.original_url, 25)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={downloadQRCode}
                    className="w-full"
                    variant="default"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống PNG
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
